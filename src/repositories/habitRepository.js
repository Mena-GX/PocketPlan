import * as Crypto from 'expo-crypto';
import {getDatabase} from '../database';

const VALID_FREQUENCIES = [
    'daily',
    'twice_daily',
    'weekly',
    'monthly',
];

const VALID_OCCURRENCE_STATUSES = [
    'incomplete',
    'complete',
    'missed',
];

const VALID_WEEKDAYS = [1,2,3,4,5,6,7];

function validateHabit(habitData){
    if(!habitData || typeof habitData !== 'object'){
        throw new Error('Habit data must be provided');
    }

    if(
        typeof habitData.title != 'string' ||
        !habitData.title.trim()
    ) {
        throw new Error('Habit title cannot be empty');
    }

    const frequency = habitData.frequency;

    if(!VALID_FREQUENCIES.includes(frequency)){
        throw new Error('Frequency must be daily, twice_daily, weekly, or monthly');
    }

    const startDate = habitData.start_date;

    if(
        typeof startDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ) {
        throw new Error('Start date must use YYYY-MM-DD format.');
    }

    const parsedStart = new Date(`${startDate}T00:00:00Z`);

    if(
        Number.isNaN(parsedStart.getTime()) ||
        parsedStart.toISOString().slice(0,10) !== startDate
    ) {
        throw new Error('Start date is not a valid calendar date.');
    }

    const endDate = habitData.end_date || null;

    if(endDate !== null){
        if(
            typeof endDate !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
        ) {
            throw new Error('End date must use YYYY-MM-DD format');
        }

        const parsedEnd = new Date(`${endDate}T00:00:00Z`);

        if(
            Number.isNaN(parsedEnd.getTime()) ||
            parsedEnd.toISOString().slice(0,10) !== endDate
        ) {
            throw new Error('End date is not a valid calendar date.');
        }

        if (endDate < startDate){
            throw new Error('End date cannot be before the start date.');
        }
    }

    const dayOfMonth = habitData.day_of_month ?? null;

    if(frequency === 'monthly'){
        if(
            !Number.isInteger(dayOfMonth) ||
            dayOfMonth < 1 ||
            dayOfMonth > 31
        ) {
            throw new Error(
                'Monthly habits require a day of the month from 1 to 31.'
            );
        }
    }

    const scheduleTime1 = habitData.scheduled_time_1 ?? null;
    const scheduleTime2 = habitData.scheduled_time_2 ?? null;

    for(const time of [scheduleTime1, scheduleTime2]){
        if(
            time !== null &&
            (typeof time !== 'string' ||
                !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
        ) {
            throw new Error('Scheduled times must use HH:MM format')
        }
    }

    if (frequency === 'twice_daily' && !scheduleTime2) {
        throw new Error (
            'Twice daily habits require a second scheduled time.'
        );
    }

    return {
        title: habitData.title.trim(),
        description: habitData.description?.trim() || null,
        frequency,
        day_of_month: dayOfMonth,
        scheduled_time_1: scheduleTime1,
        scheduled_time_2: scheduleTime2,
        start_date: startDate,
        end_date: endDate,
        is_active: habitData.is_active === false ? 0 : 1,
        category_id: habitData.category_id || null,
    };
}

function validateWeekdays(weekdays, frequency){
    if(!Array.isArray(weekdays)) {
        throw new Error('Weekdays must be provided as an array');
    }

    for (const day of weekdays){
        if(!VALID_WEEKDAYS.includes(day)){
            throw new Error(
                'Weekdays must be integers from 1 (Monday) to 7 (Sunday).'
            );
        }
    }

    if (new Set(weekdays).size !== weekdays.length) {
        throw new Error('Duplicate weekdays are not allowed.');
    }

    if (frequency === 'weekly' && weekdays.length === 0){
        throw new Error(
            'Weekly habits must have at least one scheduled weekday.'
        );
    }

    return [...weekdays].sort((a,b) => a - b);
}

export async function createHabit(habitData, weekdays = []){
    const habit = validateHabit(habitData);
    const days = validateWeekdays(weekdays, habit.frequency);
    const db = await getDatabase();

    const now = new Date().toISOString();
    const id = Crypto.randomUUID();

    await db.withTransactionAsync(async () => {
        await db.runAsync(
            `INSERT INTO habits (
                id,
                title,
                description,
                frequency,
                day_of_month,
                scheduled_time_1,
                scheduled_time_2,
                start_date,
                end_date,
                is_active,
                category_id,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            id,
            habit.title,
            habit.description,
            habit.frequency,
            habit.day_of_month,
            habit.scheduled_time_1,
            habit.scheduled_time_2,
            habit.start_date,
            habit.end_date,
            habit.is_active,
            habit.category_id,
            now,
            now
        );

        for (const weekday of days) {
            await db.runAsync(
                `INSERT INTO habit_schedule_days (habit_id, weekday)
                VALUES (?,?)`,
                id,
                weekday
            );
        }
    });

    return {
        id,
        ...habit,
        weekdays: days,
        created_at: now,
        updated_at: now,
    };
}

export async function getAllHabits() {
    const db = await getDatabase();

    const habits = await db.getAllAsync(`
        SELECT *
        FROM habits
        ORDER BY is_active DESC, title COLLATE NOCASE ASC
        `);

    for (const habit of habits){
        const days = await db.getAllAsync(
            `SELECT weekday
            FROM habit_schedule_days
            WHERE habit_id = ?
            ORDER BY weekday ASC`,
            habit.id
        );

        habit.weekdays = days.map((day) => day.weekday);
    }

    return habits;
}

export async function getHabitById(id){
    const db = await getDatabase();

    const habit = await db.getFirstAsync(
        `SELECT * FROM habits WHERE id = ?`,
        id
    );

    if(!habit) {
        return null;
    }

    const days = await db.getAllAsync(
        `SELECT weekday
        FROM habit_schedule_days
        WHERE habit_id = ?
        ORDER BY weekday ASC`,
        id
    );

    return {
        ...habit,
        weekdays: days.map((day) => day.weekday),
    };
}

export async function updateHabit(id, habitData, weekdays = []){
    const habit = validateHabit(habitData);
    const days = validateWeekdays(weekdays, habit.frequency);
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
            `UPDATE habits
            SET title = ?,
                description = ?,
                frequency = ?,
                day_of_month = ?,
                scheduled_time_1 = ?,
                scheduled_time_2 = ?,
                start_date = ?,
                end_date = ?,
                is_active = ?,
                category_id = ?,
                updated_at = ?
            WHERE id = ?`,
            habit.title,
            habit.description,
            habit.frequency,
            habit.day_of_month,
            habit.scheduled_time_1,
            habit.scheduled_time_2,
            habit.start_date,
            habit.end_date,
            habit.is_active,
            habit.category_id,
            now,
            id
        );

        if(result.changes == 0){
            throw new Error('Habit not found.');
        }

        await db.runAsync(
            `DELETE FROM habit_schedule_days WHERE habit_id = ?`,
            id
        );

        for (const weekday of days){
            await db.runAsync(
                `INSERT INTO habit_schedule_days (habit_id, weekday)
                VALUES (?,?)`,
                id,
                weekday
            );
        }
    });

    return await getHabitById(id);
}

export async function deleteHabit(id){
    const db = await getDatabase();

    const result = await db.runAsync(
        `DELETE FROM habits WHERE id = ?`,
        id
    );

    if(result.changes === 0){
        throw new Error('Habit not found.');
    }

    return true;
}

export async function getHabitOccurrences(
    habitId,
    startDate = null,
    endDate = null,
){
    const db = await getDatabase();

    if(startDate && endDate){
        return await db.getAllAsync(
            `SELECT *
            FROM habit_occurrences
            WHERE habit_id = ?
                AND scheduled_date BETWEEN ? AND ?
            ORDER BY scheduled_date ASC, occurrence_number ASC`,
            habitId,
            startDate,
            endDate
        );
    }

    if (startDate) {
        return await db.getAllAsync(
            `SELECT *
            FROM habit_occurrences
            WHERE habit_id = ? AND scheduled_date >= ?
            ORDER BY scheduled_date ASC, occurrence_number ASC`,
            habitId,
            startDate
        );
    }
    
    if (endDate) {
        return await db.getAllAsync(
            `SELECT *
            FROM habit_occurrences
            WHERE habit_id = ? AND scheduled_date <= ?
            ORDER BY scheduled_date ASC, occurrence_number ASC`,
            habitId,
            endDate
        );
    }

    return await db.getAllAsync(
        `SELECT * 
        FROM habit_occurrences
        WHERE habit_id = ?
        ORDER BY scheduled_date ASC, occurrence_number ASC`,
        habitId
    );
}

export async function updateHabitOccurrenceStatus(
    occurrenceId,
    status
) {
    if(!VALID_OCCURRENCE_STATUSES.includes(status)) {
        throw new Error(
            'Occurrernce status must be incomplete, complete, or missed.'
        );
    }

    const db = await getDatabase();

    const nowDate = new Date();
    const today = [
        nowDate.getFullYear(),
        String(nowDate.getMonth() + 1).padStart(2, '0'),
        String(nowDate.getDate()).padStart(2, '0'),
    ].join('-');

    const now = nowDate.toISOString();

    const result = await db.runAsync(
        `UPDATE habit_occurrences
        SET status = ?
            completed_at = ?
            updated_at = ?
        WHERE id = ?
            AND scheduled_date = ?`,
        status,
        status === 'complete' ? now : null,
        now,
        occurrenceId,
        today
    );

    if(result.changes === 0) {
        throw new Error(
            'Occurrence not found or it is not scheduled for today.'
        );
    }

    return await db.getFirstAsync(
        `SELECT * FROM habit_occurrences WHERE id = ?`,
        occurrenceId
    );
}
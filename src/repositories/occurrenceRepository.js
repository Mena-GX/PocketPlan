import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database';

const VALID_STATUSES = [
    'incomplete',
    'complete',
    'missed',
];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseDate(dateString){
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function getWeekday(date){
    //Javascript: Sunday = 0, Monday = 1, etc.
    //PocketPlan: Monday = 1, Sunday = 7
    return date.getDay() === 0 ? 7 : date.getDay();
}

function isValidDateString(dateString){
    if(
        typeof dateString !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
        return false;
    }

    const date = parseDate(dateString);

    return formatDate(date) === dateString;
}

function validateDateRange(startDate, endDate){
    if(!isValidDateString(startDate)){
        throw new Error('Start date must use a valid YYYY-MM-DD date.');
    }

    if(!isValidDateString(endDate)){
        throw new Error('End date must use a valid YYYY-MM-DD date.')
    }

    if(endDate < startDate) {
        throw new Error('End date cannot be before the start date.');
    }
}

export async function generateHabitOccurrences(
    habitId,
    startDate,
    endDate
) {
    validateDateRange(startDate, endDate);

    const db = await getDatabase();

    const habit = await db.getFirstAsync(
        `SELECT * FROM habits WHERE id = ?`,
        habitId
    );

    if (!habit){
        throw new Error('Habit not found');
    }

    if(!habit.is_active){
        return 0;
    }

    const weekdayRows = await db.getAllAsync(
        `SELECT weekday
        FROM habit_schedule_days
        WHERE habit_id = ?
        ORDER BY weekday ASC`,
        habitId
    );

    const scheduledWeekdays = weekdayRows.map(
        (row) => row.weekday
    );

    const effectiveStart =
        startDate > habit.start_date
            ? startDate
            : habit.start_date;

    const effectiveEnd =
        habit.end_date && endDate > habit.end_date
            ? habit.end_date
            : endDate;

    if(effectiveStart > effectiveEnd){
        return 0;
    }

    let insertedCount = 0;

    await db.withTransactionAsync(async () => {
        const currentDate = parseDate(effectiveStart);
        const lastDate = parseDate(effectiveEnd);

        while(currentDate <= lastDate){
            const dateString = formatDate(currentDate);
            const weekday = getWeekday(currentDate);

            let shouldSchedule = false;
            let occurrenceCount = 1;

            switch(habit.frequency){
                case 'daily':
                    shouldSchedule = true;
                    break;

                case 'twice_daily':
                    shouldSchedule = true;
                    occurrenceCount = 2;
                    break;

                case 'weekly':
                    shouldSchedule = scheduledWeekdays.includes(weekday);
                    break;
                
                case 'monthly':
                    shouldSchedule = currentDate.getDate() === habit.day_of_month;
                    break;
                
                default:
                    throw new Error('Unsupported habit frequency.');
            }

            if(shouldSchedule){
                for(
                    let occurrenceNumber = 1;
                    occurrenceNumber <= occurrenceCount;
                    occurrenceNumber++
                ){
                    const now = new Date().toISOString();
                    const id = Crypto.randomUUID();

                    const result = await db.runAsync(
                        `INSERT OR IGNORE INTO habit_occurrences (
                            id,
                            habit_id,
                            scheduled_date,
                            occurrence_number,
                            status,
                            completed_at,
                            created_at,
                            updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                         id,
                         habitId,
                         dateString,
                         occurrenceNumber,
                         'incomplete',
                         null,
                         now,
                         now
                    );

                    insertedCount += result.changes;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return insertedCount;
}

export async function getHabitOccurrencesForDate(date){
    if(!isValidDateString(date)){
        throw new Error('Date must use a valud YYY-MM-DD date.');
    }

    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT
            habit_occurrences.*,
            habits.title,
            habits.description,
            habits.frequency,
            habits.scheduled_time_1,
            habits.scheduled_time_2
        FROM habit_occurrences
        INNER JOIN habits
            ON habit_occurrences.habit_id = habits.id
        WHERE habit_occurrences.scheduled_date = ?
        ORDER BY
            habits.title COLLATE NOCASE ASC,
            habit_occurrences.occurrence_number ASC`,
        date
    );
}

export async function updateOccurrenceStatus(occurrenceId, status){
    if(!VALID_STATUSES.includes(status)){
        throw new Error('Status must be incomplete, complete, or missed');
    }

    const db = await getDatabase();

    const today = formatDate(new Date());
    const now = new Date().toISOString();

    const completedAt = status === 'complete' ? now : null;

    const result = await db.runAsync(
        `UPDATE habit_occurrences
        SET status = ?,
            completed_at = ?,
            updated_at = ?
        WHERE id = ?
            AND scheduled_date = ?`,
        status,
        completedAt,
        now,
        occurrenceId,
        today
    );

    if(result.changes === 0){
        throw new Error(
            'Occurrence not found or it is not scheduled for today'
        );
    }

    return await db.getFirstAsync(
        `SELECT *
        FROM habit_occurrences
        WHERE id = ?`,
        occurrenceId
    );
}
import { getDatabase } from "../database";

import { generateHabitOccurrences, getHabitOccurrencesForDate } from "./occurrenceRepository";

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isValidDate(dateString){
    if(
        typeof dateString !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);

    const date = new Date(year, month -1, day);

    return formatDate(date) == dateString;
}

export async function getDailyTasks(date){
    if(!isValidDate(date)){
        throw new Error('A valid YYYY-MM-DD date is required.');
    }

    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT
            tasks.*,
            categories.name AS category_name
        FROM tasks
        LEFT JOIN categories
            ON tasks.category_id = categories.id
        WHERE tasks.due_date = ?
        ORDER BY
            CASE
                WHEN tasks.due_time IS NULL THEN 1
                ELSE 0
            END,
            tasks.due_time ASC,
            CASE tasks.priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
            END,
            tasks.created_at DESC`,
        date
    );
}

export async function getDailyHabits(date){
    if(!isValidDate(date)){
        throw new Error('A valid YYYY-MM-DD date is required.');
    }

    return await getHabitOccurrencesForDate(date);
}

export async function getDailyData(date = formatDate(new Date())) {
    if(!isValidDate(date)){
        throw new Error('A valid YYYY-MM-DD date is required');
    }

    const db = await getDatabase();

    const activeHabits = await db.getAllAsync(
        `SELECT id
        FROM habits
        WHERE is_active = 1`,
    );

    for (const habit of activeHabits){
        await generateHabitOccurrences(
            habit.id,
            date,
            date
        );
    }

    const [tasks, habits] = await Promise.all([
        getDailyTasks(date),
        getDailyHabits(date),
    ]);

    const completedTasks = tasks.filter(
        (task) => task.status === 'complete'
    ).length;

    const completedHabits = habits.filter(
        (habit) => habit.status === 'complete'
    ).length;

    const totalActivities = tasks.length + habits.length;

    const completedActivities = completedTasks + completedHabits;

    const remainingActivities = totalActivities - completedActivities;

    const progressPercentage = totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100);

    return {
        date,
        tasks,
        habits,

        progress: {
            total: totalActivities,
            completed: completedActivities,
            remaining: remainingActivities,
            percentage: progressPercentage,
        },

        taskProgress: {
            total: tasks.length,
            completed: completedTasks,
        },

        habitProgress: {
            total: habits.length,
            completed: completedHabits,
        },
    };
}
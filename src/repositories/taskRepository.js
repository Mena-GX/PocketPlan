import { getDatabase } from "../database";
import * as Crypto from 'expo-crypto';

const VALID_PRIORITIES = ['high', 'medium', 'low'];

const VALID_STATUSES = [
    'incomplete',
    'in_progress',
    'complete',
    'missed',
];

function validateTask(taskData){
    if(!taskData || typeof taskData !== 'object'){
        throw new Error('Task data must be provided.');
    }

    if(typeof taskData.title !== 'string' || !taskData.title.trim()){
        throw new Error('Task title cannot be empty');
    }

    const priority = taskData.priority ?? 'medium';

    if (!VALID_PRIORITIES.includes(priority)){
        throw new Error('Priority must be high, medium, or low.');
    }

    const status = taskData.status ?? 'incomplete';

    if (!VALID_STATUSES.includes(status)){
        throw new Error('Status must be incomplet, in_progress, complete, or missed.');
    }

    return {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || null,
        due_date: taskData.due_date || null,
        due_time: taskData.due_time ?? null,
        priority,
        status,
        category_id: taskData.category_id || null,
    };
}

export async function createTask(taskData){
    const task = validateTask(taskData);
    const db = await getDatabase();

    const now = new Date().toISOString();
    const id = Crypto.randomUUID();

    console.log(id);

    await db.runAsync(
        `INSERT INTO tasks (
            id,
            title,
            description,
            due_date,
            due_time,
            priority,
            status,
            category_id,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        task.title,
        task.description,
        task.due_date,
        task.due_time ?? null,
        task.priority,
        task.status,
        task.category_id,
        now,
        now
    );

    console.log(id);

    return {
        id,
        ...task,
        due_time: task.due_time ?? null,
        created_at: now,
        updated_at: now,
    };
}

export async function getAllTasks(){
    const db = await getDatabase();

    return await db.getAllAsync(`
        SELECT
            id,
            title,
            description,
            due_date,
            due_time,
            priority,
            status,
            category_id,
            created_at,
            updated_at
        FROM tasks
        ORDER BY
            CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
                due_date ASC,
                due_time ASC,
                created_at DESC
        `);
}

export async function getTaskById(id){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT
            id,
            title,
            description,
            due_date,
            due_time,
            priority,
            status,
            category_id,
            created_at,
            updated_at
        FROM tasks
        WHERE id = ?`,
        id
    );
}

export async function updateTask(id, taskData){
    const task= validateTask(taskData);
    const db = await getDatabase()
    const now = new Date().toISOString();

    const result = await db.runAsync(
        `UPDATE tasks
        SET title = ?,
            description = ?,
            due_date = ?,
            due_time = ?,
            priority = ?,
            status = ?,
            category_id = ?,
            updated_at = ?
        WHERE id = ?`,
        task.title,
        task.description,
        task.due_date,
        task.due_time,
        task.priority,
        task.status,
        task.category_id,
        now,
        id
    );

    if (result.changes === 0){
        throw new Error('Task not found.');
    }

    return await getTaskById(id);
}

export async function updateTaskStatus(id, status){
    if (!VALID_STATUSES.includes(status)) {
        throw new Error('Status must be incomplete, in_progress, complete, or missed');
    }

    const db = await getDatabase();
    const now = new Date().toISOString();

    const result = await db.runAsync(
        `UPDATE tasks
        SET status = ?, updated_at = ?
        WHERE id = ?`,
        status,
        now,
        id
    );
    
    if(result.changes === 0){
        throw new Error('Task not found.');
    }

    return await getTaskById(id);
}

export async function deleteTask(id){
    const db = await getDatabase();

    const result = await db.runAsync(
        `DELETE FROM tasks WHERE id = ?`,
        id
    );

    if(result.changes === 0){
        throw new Error('Task not found.');
    }

    return true;
}
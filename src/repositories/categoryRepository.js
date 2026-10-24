import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database';

//Create a new category
export async function createCategory(name) {
    const cleanedName = name.trim();

    if(!cleanedName) {
        throw new Error('Category name cannot be empty');
    }

    const db = await getDatabase();
    const now = new Date().toISOString();
    const id = Crypto.randomUUID();

    await db.runAsync(
        `INSERT INTO categories
            (id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?)`,
        id,
        cleanedName,
        now,
        now
    );

    return {
        id,
        name: cleanedName,
        created_at: now,
        updated_at: now,
    };
}

//Retrieve all categories, alphabetically
export async function getAllCategories() {
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT id, name, created_at, updated_at
        FROM categories
        ORDER BY name COLLATE NOCASE ASC`
    );
}

//Retreieve one category using its ID
export async function getCategoryById(id){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT id, name, created_at, updated_at
        FROM categories
        WHERE id = ?`,
        id
    );
}

//Rename an existing category
export async function updateCategory(id, name){
    const cleanedName = name.trim();

    if(!cleanedName){
        throw new Error('Category name cannot be empty.');
    }

    const db = await getDatabase();
    const now = new Date().toISOString();

    const result = await db.runAsync(
        `UPDATE categories
        SET name = ?, updated_at = ?
        WHERE id = ?`,
        cleanedName,
        now,
        id
    );

    if (result.changes === 0){
        throw new Error('Category cannot be found.');
    }

    return await getCategoryById(id);
}

//Delete a category without deleting its tasks or habits
export async function deleteCategory(id) {
    const db = await getDatabase();

    const result = await db.runAsync(
        `DELETE FROM categories WHERE id = ?`,
        id
    );

    if (result.changes === 0){
        throw new Error('Category not found.');
    }

    return true;
}
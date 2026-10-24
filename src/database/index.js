import * as SQLite from 'expo-sqlite'
import { SCHEMA_SQL } from "./schema";

let databaseInstance = null;

export async function getDatabase() {
    if(databaseInstance){
        return databaseInstance;
    }

    const db = await SQLite.openDatabaseAsync('pocketplan.db');

    //Enable foreign key checks on this connection
    await db.execAsync('PRAGMA foreign_keys = ON;');

    //create all tables and indexes
    await db.execAsync(SCHEMA_SQL);

    databaseInstance = db;

    return databaseInstance;
}
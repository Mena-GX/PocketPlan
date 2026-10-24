import { getDatabase } from "./index";

export async function testDatabase() {
    const db = await getDatabase();

    const result = await db.getAllAsync(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
        ORDER BY name;    
    `);

    console.log('PocketPLan database tables:');

    for (const table of result){
        console.log(table.name);
    }

    return result;
}
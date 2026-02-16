import { sql } from '@vercel/postgres';

export async function query(queryString, values) {
    try {
        const result = await sql.query(queryString, values);
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

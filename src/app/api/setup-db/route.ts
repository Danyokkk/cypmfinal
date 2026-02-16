import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        image_url TEXT,
        phone VARCHAR(50),
        telegram VARCHAR(50),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `, []);

    // Migration for existing tables (safe to run multiple times)
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url TEXT;`, []);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`, []);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram VARCHAR(50);`, []);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`, []);

    // Auth Verification Migration
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`, []);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;`, []);

    await query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50),
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'active',
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `, []);

    return NextResponse.json({ success: true, message: 'Tables created successfully' });
  } catch (error) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: 'Failed to create tables', details: error }, { status: 500 });
  }
}

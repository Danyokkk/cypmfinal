import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        const user = data.user;

        // Create session for middleware
        await createSession({
            userId: user.id,
            email: user.email,
            name: user.user_metadata.full_name || 'User',
            role: user.user_metadata.role || 'user'
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.user_metadata.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

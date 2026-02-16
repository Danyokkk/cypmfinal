import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.session) {
            const user = data.session.user;

            // Create our custom session cookie to match our middleware logic
            await createSession({
                userId: user.id,
                email: user.email,
                name: user.user_metadata.full_name || user.user_metadata.name || 'User',
                role: 'user',
                image_url: user.user_metadata.avatar_url || null
            });
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', request.url));
}

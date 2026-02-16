import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (code) {
        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Supabase Auth Exchange Error:', error);
                return NextResponse.redirect(
                    new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
                );
            }

            if (data?.session) {
                const user = data.session.user;

                // Detailed metadata check for Google/other providers
                const name = user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.user_metadata?.user_name ||
                    'User';

                const avatar = user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    null;

                // Create our custom session cookie for the middleware
                await createSession({
                    userId: user.id,
                    email: user.email,
                    name: name,
                    role: 'user',
                    image_url: avatar
                });

                console.log('Session created successfully for user:', user.email);
            } else {
                return NextResponse.redirect(
                    new URL('/login?error=No+session+found+after+exchange', request.url)
                );
            }
        } catch (err: any) {
            console.error('Callback unexpected error:', err);
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(err.message || 'Unknown error')}`, request.url)
            );
        }
    }

    // Redirect to next or dashboard
    return NextResponse.redirect(new URL(next, request.url));
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

// Define the name of the session cookie
const SESSION_COOKIE_NAME = 'session';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    const response = NextResponse.redirect(new URL(next, request.url));

    if (code) {
        try {
            // 1. Exchange the code for a Supabase session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Supabase Auth Exchange Error:', error);
                return NextResponse.redirect(
                    new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
                );
            }

            if (data?.session) {
                const user = data.session.user;

                // 2. Parse metadata
                const name = user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.user_metadata?.user_name ||
                    user.email?.split('@')[0] ||
                    'User';

                const avatar = user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    null;

                // 3. Sync user with public.users table (important for the rest of the app)
                const { error: upsertError } = await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        name: name,
                        image_url: avatar,
                        is_verified: true, // OAuth emails are verified
                        last_login: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (upsertError) {
                    console.error('User sync error (public.users):', upsertError);
                    // We continue anyway since auth succeeded
                }

                // 4. Manual Session Creation (Matching current app auth logic)
                // We use a custom JWT for the 'session' cookie
                const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-it';
                const key = new TextEncoder().encode(SECRET_KEY);

                const payload = {
                    userId: user.id,
                    email: user.email,
                    name: name,
                    role: 'user',
                    image_url: avatar
                };

                const { SignJWT } = await import('jose');
                const token = await new SignJWT(payload)
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('7d')
                    .sign(key);

                // 5. Set cookie on the redirect response object
                response.cookies.set(SESSION_COOKIE_NAME, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });

                console.log('Google Auth success. User synced and session set:', user.email);
                return response;
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

    return response;
}

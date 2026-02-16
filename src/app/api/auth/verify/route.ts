import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=Invalid Token', request.url));
    }

    try {
        // Find user with this token
        const result = await query('SELECT id FROM users WHERE verification_token = $1', [token]) as any;

        if (result.rows.length === 0) {
            return NextResponse.redirect(new URL('/login?error=Token not found or expired', request.url));
        }

        const user = result.rows[0];

        // Mark as verified and clear token
        await query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
            [user.id]
        );

        return NextResponse.redirect(new URL('/login?message=Account verified successfully! You can now log in.', request.url));

    } catch (error) {
        console.error('Verification Error:', error);
        return NextResponse.redirect(new URL('/login?error=Internal processing error', request.url));
    }
}

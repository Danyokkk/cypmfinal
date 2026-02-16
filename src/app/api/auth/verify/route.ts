import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=Invalid Token', request.url));
    }

    try {
        // Find user with this token
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('id')
            .eq('verification_token', token)
            .single();

        if (findError || !user) {
            return NextResponse.redirect(new URL('/login?error=Token not found or expired', request.url));
        }

        // Mark as verified and clear token
        const { error: updateError } = await supabase
            .from('users')
            .update({
                is_verified: true,
                verification_token: null
            })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return NextResponse.redirect(new URL('/login?message=Account verified successfully! You can now log in.', request.url));

    } catch (error) {
        console.error('Verification Error:', error);
        return NextResponse.redirect(new URL('/login?error=Internal processing error', request.url));
    }
}

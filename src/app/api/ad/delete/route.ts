import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = session as any;

        const { id } = await request.json();

        // Verify ownership and delete
        const { data: ad, error: fetchError } = await supabase
            .from('ads')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !ad) {
            return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        }

        if (ad.user_id !== user.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { error: deleteError } = await supabase
            .from('ads')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

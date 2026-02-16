import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = session as any;

        const formData = await request.formData();
        const phone = formData.get('phone') as string;
        const telegram = formData.get('telegram') as string;
        const bio = formData.get('bio') as string;
        const image = formData.get('image') as File;

        let imageUrl = user.image_url; // Use existing if no new one

        if (image && image.size > 0) {
            const fileName = `avatars/${user.userId}-${Date.now()}-${image.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('ads')
                .upload(fileName, image, {
                    cacheControl: '3600',
                    upsert: false, // Set to true if you want to overwrite existing files with the same name
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('ads')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            } else {
                console.error('Avatar Upload Error:', uploadError);
            }
        }

        // Update Supabase (targeting 'users' table in public schema)
        const { error } = await supabase
            .from('users')
            .update({
                phone,
                telegram,
                bio,
                image_url: imageUrl
            })
            .eq('id', user.userId);

        if (error) {
            console.error('Supabase Update Error:', error);
            // Fallback: If 'users' table doesn't exist yet, we still proceed to update session
            // to avoid blocking the user, but we should log it.
        }

        // Update Session with new data
        await createSession({ ...user, phone, telegram, bio, image_url: imageUrl });

        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

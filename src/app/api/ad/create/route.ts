import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File;

        // Validate inputs
        if (!title || !price || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session as any).userId;

        let imageUrl = null;
        if (imageFile) {
            // Upload to Vercel Blob (keeping this for now)
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('ads')
            .insert([
                {
                    user_id: userId,
                    title,
                    price: parseFloat(price),
                    description,
                    image_url: imageUrl,
                    status: 'active'
                }
            ])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, adId: data[0].id });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

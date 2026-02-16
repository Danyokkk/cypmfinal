import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
        if (imageFile && imageFile.size > 0) {
            const fileName = `${userId}-${Date.now()}-${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('ads')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Storage Upload Error:', uploadError);
                return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('ads')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
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

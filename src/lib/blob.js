import { put } from '@vercel/blob';

export async function uploadImage(file, filename) {
    const blob = await put(filename, file, {
        access: 'public',
    });
    return blob;
}

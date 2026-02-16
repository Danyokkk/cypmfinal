'use client';

import { useState } from 'react';
import styles from './post-ad.module.css';
import { Upload } from 'lucide-react';

export default function PostAdPage() {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        const form = e.currentTarget;
        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
        const price = (form.elements.namedItem('price') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
        const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        if (fileInput.files?.[0]) {
            formData.append('image', fileInput.files[0]);
        }

        try {
            const res = await fetch('/api/ad/create', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('Ad posted successfully!');
                // Redirect or clear form
                window.location.href = '/dashboard';
            } else {
                alert('Failed to post ad.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Post an Ad</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '40px', maxWidth: '600px', width: '100%' }}>

                <div className={styles.group}>
                    <label className={styles.label}>Title</label>
                    <input name="title" type="text" className={styles.input} placeholder="What are you selling?" required />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Price (€)</label>
                    <input name="price" type="number" className={styles.input} placeholder="0.00" required />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Description</label>
                    <textarea name="description" className={styles.textarea} placeholder="Describe your item..." rows={5} required />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Photos</label>
                    <div className={styles.uploadBox} style={{ position: 'relative', overflow: 'hidden' }}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                        ) : (
                            <>
                                <Upload size={32} color="var(--primary)" />
                                <p>Click to upload or drag and drop</p>
                            </>
                        )}
                        <input type="file" className={styles.fileInput} accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>

                <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                    {loading ? 'Posting...' : 'Publish Ad'}
                </button>
            </form>
        </div>
    );
}

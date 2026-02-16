import { supabase } from '@/lib/supabase';
import AdCard from '@/components/AdCard';
import Link from 'next/link';

export default async function BrowsePage() {
    const { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching ads:', error);
    }

    const adsData = ads || [];

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1240px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '50px', textAlign: 'center', fontSize: '3rem', fontWeight: 900 }}>
                Browse <span style={{ color: 'var(--primary)' }}>Listings</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {adsData.map((ad: any) => (
                    <AdCard key={ad.id} ad={ad} />
                ))}
            </div>

            {adsData.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'rgba(255,255,255,0.4)' }}>
                    <p>No ads found. Be the first to post!</p>
                    <Link href="/post-ad" className="glass-button" style={{ marginTop: '20px', display: 'inline-block' }}>Post Ad</Link>
                </div>
            )}
        </div>
    );
}

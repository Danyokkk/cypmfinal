import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function AdDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch ad details with join (assuming users table exists and linked by user_id)
    const { data: ad, error } = await supabase
        .from('ads')
        .select(`
            *,
            seller:user_id (
                name,
                image_url,
                bio,
                phone,
                telegram
            )
        `)
        .eq('id', id)
        .single();

    if (error || !ad) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <h1>Ad Not Found</h1>
                    <Link href="/browse" className="glass-button" style={{ marginTop: '20px', display: 'inline-block' }}>
                        Browse Ads
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                {/* Left Column: Image */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: 'rgba(0,0,0,0.3)' }}>
                    {ad.image_url ? (
                        <img
                            src={ad.image_url}
                            alt={ad.title}
                            style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '12px', objectFit: 'contain' }}
                        />
                    ) : (
                        <div style={{ color: 'var(--text-muted)' }}>No Image Available</div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <span style={{
                            background: 'var(--primary-glow)',
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: '1px solid var(--primary)'
                        }}>
                            Active
                        </span>
                        <h1 style={{ fontFamily: 'var(--font-unbounded)', fontSize: '2.5rem', marginTop: '10px', lineHeight: 1.1 }}>
                            {ad.title}
                        </h1>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '10px' }}>
                            €{Number(ad.price).toLocaleString()}
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <div>
                        <h3 style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>Description</h3>
                        <p style={{ lineHeight: 1.6, fontSize: '1.1rem', color: '#fff' }}>
                            {ad.description}
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: 'var(--glass-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {ad.seller?.image_url ? (
                                <img src={ad.seller.image_url} alt="Seller" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{ad.seller?.name?.charAt(0).toUpperCase() || '?'}</span>
                            )}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{ad.seller?.name || 'Unknown Seller'}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verified Seller</p>
                        </div>
                    </div>

                    {ad.seller?.bio && (
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem' }}>"{ad.seller.bio}"</p>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {ad.seller?.telegram && (
                            <a href={ad.seller.telegram.startsWith('http') ? ad.seller.telegram : `https://t.me/${ad.seller.telegram.replace('@', '')}`} target="_blank" className="glass-button" style={{ textAlign: 'center', background: 'var(--primary-glow)', borderColor: 'var(--primary)', color: 'white' }}>
                                Connect on Socials
                            </a>
                        )}
                        {ad.seller?.phone && (
                            <a href={`tel:${ad.seller.phone}`} className="glass-button" style={{ textAlign: 'center' }}>
                                Call {ad.seller.phone}
                            </a>
                        )}
                        {!ad.seller?.telegram && !ad.seller?.phone && (
                            <button className="glass-button" disabled style={{ opacity: 0.5, textAlign: 'center' }}>No Contact Info</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
    const session = await getSession();
    const user = session as any;

    if (!user || user.role !== 'admin') {
        // Basic protection, middleware should also handle this
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <h1>Access Denied</h1>
                    <p>You need admin privileges to view this page.</p>
                    <Link href="/" className="glass-button" style={{ marginTop: '20px', display: 'inline-block' }}>
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch data based on what's needed
    const adsResult = await query(
        `SELECT ads.*, users.name as seller_name 
     FROM ads 
     JOIN users ON ads.user_id = users.id 
     ORDER BY ads.created_at DESC`,
        []
    ) as any;
    const ads = adsResult.rows;

    const usersResult = await query(
        `SELECT * FROM users ORDER BY created_at DESC`,
        []
    ) as any;
    const users = usersResult.rows;

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-unbounded)', marginBottom: '40px' }}>Admin <span style={{ color: 'var(--primary)' }}>Panel</span></h1>

            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ marginBottom: '20px' }}>Pending Approvals / Users</h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                    {users.map((u: any) => (
                        <div key={u.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ marginBottom: '5px' }}>{u.name} ({u.email})</h3>
                                <p style={{ fontSize: '0.8rem', color: u.is_verified ? '#10b981' : '#ef4444' }}>
                                    Status: {u.is_verified ? 'Verified' : 'PENDING APPROVAL'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {!u.is_verified && (
                                    <form action={async () => {
                                        'use server';
                                        await query('UPDATE users SET is_verified = TRUE WHERE id = $1', [u.id]);
                                        redirect('/admin');
                                    }}>
                                        <button type="submit" className="glass-button" style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}>
                                            Approve User
                                        </button>
                                    </form>
                                )}
                                <form action={async () => {
                                    'use server';
                                    if (u.role === 'admin') return; // Don't delete self
                                    await query('DELETE FROM users WHERE id = $1', [u.id]);
                                    redirect('/admin');
                                }}>
                                    <button type="submit" className="glass-button" style={{ borderColor: 'red', color: 'red', fontSize: '0.8rem' }}>
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ marginBottom: '20px' }}>Recent Ads</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {ads.map((ad: any) => (
                        <div key={ad.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {ad.image_url && <img src={ad.image_url} alt="thumb" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>{ad.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Seller: {ad.seller_name} • Price: €{ad.price} • Status: {ad.status}
                                    </p>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server';
                                await query('DELETE FROM ads WHERE id = $1', [ad.id]);
                                redirect('/admin');
                            }}>
                                <button type="submit" className="glass-button" style={{ borderColor: 'red', color: 'red', fontSize: '0.8rem' }}>
                                    Delete Ad
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

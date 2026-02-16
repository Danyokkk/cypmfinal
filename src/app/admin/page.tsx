import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function AdminPage() {
    const session = await getSession();
    const user = session as any;

    if (!user || user.role !== 'admin') {
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

    // Fetch Ads with Users join
    const { data: ads, error: adsError } = await supabase
        .from('ads')
        .select(`
            *,
            users:user_id (name)
        `)
        .order('created_at', { ascending: false });

    // Fetch Users
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    // Server Actions
    async function approveUser(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);
        revalidatePath('/admin');
    }

    async function deleteUser(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        // Don't delete self
        if (userId === user.userId) return;

        await supabase
            .from('users')
            .delete()
            .eq('id', userId);
        revalidatePath('/admin');
    }

    async function deleteAd(formData: FormData) {
        'use server';
        const adId = formData.get('adId') as string;
        await supabase
            .from('ads')
            .delete()
            .eq('id', adId);
        revalidatePath('/admin');
    }

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-unbounded)', marginBottom: '40px' }}>Admin <span style={{ color: 'var(--primary)' }}>Panel</span></h1>

            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ marginBottom: '20px' }}>Pending Approvals / Users</h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                    {users?.map((u: any) => (
                        <div key={u.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ marginBottom: '5px' }}>{u.name} ({u.email})</h3>
                                <p style={{ fontSize: '0.8rem', color: u.is_verified ? '#10b981' : '#ef4444' }}>
                                    Status: {u.is_verified ? 'Verified' : 'PENDING APPROVAL'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {!u.is_verified && (
                                    <form action={approveUser}>
                                        <input type="hidden" name="userId" value={u.id} />
                                        <button type="submit" className="glass-button" style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}>
                                            Approve User
                                        </button>
                                    </form>
                                )}
                                <form action={deleteUser}>
                                    <input type="hidden" name="userId" value={u.id} />
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
                    {ads?.map((ad: any) => (
                        <div key={ad.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {ad.image_url && <img src={ad.image_url} alt="thumb" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>{ad.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Seller: {(ad.users as any)?.name || 'Unknown'} • Price: €{ad.price} • Status: {ad.status}
                                    </p>
                                </div>
                            </div>
                            <form action={deleteAd}>
                                <input type="hidden" name="adId" value={ad.id} />
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

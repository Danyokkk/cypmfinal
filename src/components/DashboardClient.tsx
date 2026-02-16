'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, Trash2, PlusCircle, Settings, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DashboardClient({ user, userAds }: { user: any, userAds: any[] }) {
    const [activeTab, setActiveTab] = useState<'ads' | 'profile'>('ads');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Profile State
    const [phone, setPhone] = useState(user.phone || '');
    const [telegram, setTelegram] = useState(user.telegram || '');
    const [bio, setBio] = useState(user.bio || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image_url || null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.dashboard-header', { y: -30, opacity: 0, duration: 0.8 })
            .from('.dashboard-nav', { x: -20, opacity: 0, duration: 0.5 }, '-=0.4')
            .from('.dashboard-content', { y: 20, opacity: 0, duration: 0.8 }, '-=0.3')
            .from('.stat-card', { scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.5');
    }, { scope: containerRef });

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('telegram', telegram);
        formData.append('bio', bio);

        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput.files?.[0]) {
            formData.append('image', fileInput.files[0]);
        }

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                gsap.to('.save-btn', { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
                router.refresh();
            } else {
                alert('Failed to update.');
            }
        } catch (err) {
            alert('Error updating profile.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAd(id: number) {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        try {
            const res = await fetch('/api/ad/delete', {
                method: 'POST',
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                gsap.to(`#ad-${id}`, { x: 50, opacity: 0, duration: 0.5, onComplete: () => router.refresh() });
            }
        } catch (err) {
            alert('Failed to delete');
        }
    }

    return (
        <div ref={containerRef} style={{ padding: '120px 20px 60px', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{
                maxWidth: '1100px',
                width: '100%',
                padding: '40px',
                background: 'rgba(3, 3, 11, 0.8)',
                backdropFilter: 'blur(30px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '32px'
            }}>

                {/* Header */}
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
                            Dashboard
                        </h1>
                        <p style={{ marginTop: '10px', opacity: 0.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{user.name}</span>
                        </p>
                    </div>
                    {user.image_url ? (
                        <img src={user.image_url} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 30px rgba(73, 115, 255, 0.3)' }} />
                    ) : (
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid var(--glass-border)' }}>
                            {user.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="dashboard-nav" style={{ display: 'flex', gap: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px', paddingBottom: '15px' }}>
                    <button
                        onClick={() => setActiveTab('ads')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: activeTab === 'ads' ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                        }}
                    >
                        <LayoutGrid size={18} /> My Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: activeTab === 'profile' ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                        }}
                    >
                        <Settings size={18} /> Profile Details
                    </button>
                </div>

                {/* Content */}
                <div className="dashboard-content">
                    {activeTab === 'ads' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
                                <div className="stat-card glass-panel" style={{ padding: '30px', background: 'rgba(73, 115, 255, 0.05)', border: '1px solid rgba(73, 115, 255, 0.2)' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 800 }}>Total Active Ads</p>
                                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginTop: '5px' }}>{userAds.length}</h2>
                                </div>
                                <Link href="/post-ad" className="stat-card glass-panel" style={{
                                    padding: '30px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: '#fff',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    transition: '0.3s'
                                }}>
                                    <PlusCircle size={40} color="var(--primary)" />
                                    <span style={{ marginTop: '15px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Create New Listing</span>
                                </Link>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {userAds.length === 0 ? (
                                    <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 0.5 }}>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>You haven't posted any ads yet.</p>
                                    </div>
                                ) : (
                                    userAds.map((ad: any) => (
                                        <div id={`ad-${ad.id}`} key={ad.id} className="glass-panel ad-item" style={{
                                            padding: '24px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'rgba(255,255,255,0.02)',
                                            transition: 'transform 0.3s'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                                                    {ad.image_url ? (
                                                        <img src={ad.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '5px' }}>{ad.title}</h3>
                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 900 }}>€{ad.price}</span>
                                                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{ad.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAd(ad.id)}
                                                style={{
                                                    background: 'rgba(255, 60, 60, 0.1)',
                                                    border: '1px solid rgba(255, 60, 60, 0.2)',
                                                    color: '#ff4d4d',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    transition: '0.3s'
                                                }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '50px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.03)',
                                    margin: '0 auto 25px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '2px solid var(--glass-border)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Upload color="rgba(255,255,255,0.2)" size={40} />
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Change Avatar</p>
                            </div>

                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Bio / About You</label>
                                    <textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Describe yourself to buyers..."
                                        style={{
                                            width: '100%',
                                            padding: '20px',
                                            borderRadius: '20px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid var(--glass-border)',
                                            color: 'white',
                                            minHeight: '150px',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+357..."
                                            style={{
                                                width: '100%',
                                                padding: '15px 20px',
                                                borderRadius: '15px',
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Telegram ID</label>
                                        <input
                                            type="text"
                                            value={telegram}
                                            onChange={e => setTelegram(e.target.value)}
                                            placeholder="@username"
                                            style={{
                                                width: '100%',
                                                padding: '15px 20px',
                                                borderRadius: '15px',
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="glass-button save-btn" disabled={loading} style={{
                                    width: '100%',
                                    padding: '18px',
                                    fontSize: '1rem',
                                    marginTop: '20px'
                                }}>
                                    {loading ? 'Processing...' : 'Sync Profile with Galaxy'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .ad-item:hover {
                    background: rgba(255,255,255,0.05) !important;
                    transform: translateX(10px);
                }
                .stat-card:hover {
                    border-color: var(--primary) !important;
                    transform: translateY(-5px);
                }
                button:hover {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}

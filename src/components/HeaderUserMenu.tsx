'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeaderUserMenu({ user }: { user: any }) {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
                {user.image_url ? (
                    <img src={user.image_url} alt="Me" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} />
                ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user.name.charAt(0)}
                    </div>
                )}
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Hello, {user.name.split(' ')[0]}</span>
            </Link>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>

            <Link href="/post-ad" className="glass-button" style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                + Post Ad
            </Link>

            <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}
            >
                Sign Out
            </button>
        </div>
    );
}

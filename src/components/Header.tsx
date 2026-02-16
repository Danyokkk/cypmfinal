import Link from 'next/link';
import { getSession } from '@/lib/auth';
import HeaderUserMenu from './HeaderUserMenu';

export default async function Header() {
    const session = await getSession();
    const user = session as any;

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '1100px',
                padding: '12px 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(3, 3, 11, 0.7)',
                backdropFilter: 'blur(15px)',
                borderRadius: '24px',
                border: '1px solid var(--glass-border)'
            }}>
                <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>
                    CYP<span style={{ color: 'var(--primary)' }}>Market</span>
                </Link>

                <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Home</Link>
                    <Link href="/browse" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Browse</Link>

                    {user ? (
                        <HeaderUserMenu user={user} />
                    ) : (
                        <>
                            <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Login</Link>
                            <Link href="/signup" className="glass-button" style={{ padding: '8px 20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

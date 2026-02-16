import Link from 'next/link';

export default function Branding() {
    return (
        <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '0',
            width: '100%',
            textAlign: 'center',
            zIndex: 20
        }}>
            <Link
                href="https://t.me/daqxn"
                target="_blank"
                style={{
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    color: 'rgba(0, 0, 0, 0.6)',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
            >
                Made by{' '}
                <span style={{
                    background: 'linear-gradient(90deg, #00f0ff, #7000ff, #ff0055)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: 'gradient 3s linear infinite',
                    fontWeight: 800
                }}>
                    @daan1k
                </span>
            </Link>
        </div>
    );
}

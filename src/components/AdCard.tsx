'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function AdCard({ ad }: { ad: any }) {
    const cardRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <Link
            href={`/ad/${ad.id}`}
            ref={cardRef}
            className="glass-panel"
            style={{
                display: 'block',
                textDecoration: 'none',
                overflow: 'hidden',
                transition: 'border-color 0.3s',
                transformStyle: 'preserve-3d'
            }}
        >
            <div style={{ height: '220px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative' }}>
                {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="ad-image" />
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>No Image</div>
                )}
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900 }}>
                    NEW
                </div>
            </div>

            <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{ad.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>€{ad.price}</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '4px' }}>{ad.seller_name || 'Anonymous'}</span>
                    </div>
                    <div className="glass-button" style={{ padding: '8px 16px', fontSize: '0.7rem' }}>View Details</div>
                </div>
            </div>

            <style jsx>{`
                .glass-panel:hover {
                    border-color: var(--primary);
                }
                .glass-panel:hover .ad-image {
                    transform: scale(1.1);
                }
            `}</style>
        </Link>
    );
}

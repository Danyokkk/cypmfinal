'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import styles from './Hero.module.css';

export default function Hero() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(titleRef.current,
            { y: 50, opacity: 0, skewY: 7 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2 }
        )
            .fromTo(subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                '-=0.8'
            )
            .fromTo(buttonsRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.6'
            );
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 ref={titleRef} className={styles.title} style={{ fontFamily: 'var(--font-accent)', fontSize: '5rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    CYP <span style={{ color: 'var(--primary)' }}>Market</span>
                </h1>
                <p ref={subtitleRef} className={styles.subtitle} style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '20px auto' }}>
                    The future of buying and selling in Cyprus. <br />
                    <span style={{ fontWeight: 700 }}>Professional. Secure. Liquid.</span>
                </p>

                <div ref={buttonsRef} className={styles.actions}>
                    <Link href="/browse" className="glass-button" style={{ fontSize: '1rem', padding: '15px 40px' }}>
                        Browse Ads
                    </Link>
                    <Link href="/post-ad" className="glass-button" style={{ background: 'transparent', border: '2px solid white', color: 'white', fontSize: '1rem', padding: '15px 40px' }}>
                        Post Ad
                    </Link>
                </div>
            </div>
        </section>
    );
}

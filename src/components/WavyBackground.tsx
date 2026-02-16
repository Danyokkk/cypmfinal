'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function WavyBackground() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const waveRef1 = useRef<HTMLSpanElement>(null);
    const waveRef2 = useRef<HTMLSpanElement>(null);
    const waveRef3 = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to(waveRef1.current, { x: xPos, y: yPos, duration: 1.5, ease: 'power2.out' });
            gsap.to(waveRef2.current, { x: -xPos * 0.5, y: -yPos * 0.5, duration: 2, ease: 'power2.out' });
            gsap.to(waveRef3.current, { x: xPos * 0.8, y: -yPos * 0.8, duration: 2.5, ease: 'power2.out' });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="wavy-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden',
                background: '#4973ff'
            }}
        >
            <div className="wave" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                <span ref={waveRef1}></span>
                <span ref={waveRef2}></span>
                <span ref={waveRef3}></span>
            </div>
        </section>
    );
}

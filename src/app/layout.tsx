import React from "react";
import "./globals.css";
import Header from "@/components/Header";

import WavyBackground from "@/components/WavyBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <WavyBackground />

        <Header />
        <main>{children}</main>

        <div className="links" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '12px',
          zIndex: 100,
          background: 'rgba(255,255,255,0.1)',
          padding: '8px 16px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <a href="https://t.me/daqxn" target="_blank" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)' }}>
            Made by @daan1k
          </a>
        </div>
      </body>
    </html>
  );
}

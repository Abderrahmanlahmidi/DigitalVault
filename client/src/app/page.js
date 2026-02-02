"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/ui/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden font-sans">
      <Navbar />

      <main>
        <Hero />
      </main>

      {/* Subtle Background Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] contrast-150 brightness-150"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}

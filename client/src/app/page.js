"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      <Navbar />

      <main>
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden border-b border-neutral-900">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black/40 to-black"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-md mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <span className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">Secure Digital Asset Marketplace</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
                Premium Marketplace for <br className="hidden md:block" />
                Digital Creators.
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                The definitive platform for 3D models, code snippets, and Notion templates. Secure payments and temporary download links built for creators who demand excellence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                  Explore Assets <ArrowRight size={16} />
                </Link>
                <Link href="/demo" className="w-full sm:w-auto px-8 py-4 border border-neutral-700 bg-transparent hover:bg-neutral-900 text-white text-sm font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
                  List Your Assets
                </Link>
              </div>

              <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['Acme Corp', 'GlobalBank', 'Nebula', 'Vertex', 'Orbit'].map((brand) => (
                  <span key={brand} className="text-lg font-bold text-neutral-500 font-sans tracking-tight hover:text-white transition-colors cursor-default">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

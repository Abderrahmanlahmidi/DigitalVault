'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Zap, Layers } from 'lucide-react';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-48 pb-32 overflow-hidden lg:overflow-visible">
            {/* Background High-End Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />

                {/* Dynamic Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto text-center"
                >

                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-3xl mb-12 shadow-2xl"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Global Digital Hardware</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tight leading-[0.85] text-white"
                    >
                        UPGRADE YOUR <br />
                        <span className="text-white/20 italic uppercase tracking-tighter">Architecture.</span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        variants={itemVariants}
                        className="text-neutral-500 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-16 leading-relaxed"
                    >
                        Secure the world's most sophisticated digital assets.
                        From high-fidelity 3D models to optimized code fragments,
                        everything resides in the vault.
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            href="/products"
                            className="group w-full sm:w-auto px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                        >
                            Explore Vault
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/create-product"
                            className="w-full sm:w-auto px-12 py-6 border border-white/10 bg-neutral-900/40 backdrop-blur-xl text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                        >
                            List Material
                            <Zap size={18} className="text-emerald-500" />
                        </Link>
                    </motion.div>

                    {/* Trust/Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-20 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-x-16 gap-y-10"
                    >
                        {[
                            { icon: ShieldCheck, color: 'emerald', label: 'Secured', sub: 'Transactions' },
                            { icon: Layers, color: 'indigo', label: 'Premium', sub: 'Digital Stock' },
                            { icon: Sparkles, color: 'amber', label: 'Verified', sub: 'Creators Only' }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-default">
                                <div className={`p-3 bg-white/5 rounded-xl text-neutral-600 transition-colors ${stat.color === 'emerald' ? 'group-hover:text-emerald-500' :
                                    stat.color === 'indigo' ? 'group-hover:text-indigo-500' :
                                        'group-hover:text-amber-500'
                                    }`}>
                                    <stat.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black text-lg leading-tight uppercase tracking-tighter italic group-hover:text-white transition-colors">{stat.label}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">{stat.sub}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

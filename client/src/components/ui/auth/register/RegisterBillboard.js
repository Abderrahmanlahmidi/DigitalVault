'use client';

import { motion } from 'framer-motion';
import { Users, Globe, Zap, Box } from 'lucide-react';

export default function RegisterBillboard() {
    return (
        <div className="hidden lg:block lg:w-1/2 relative bg-black overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1770&auto=format&fit=crop"
                alt="Digital Network"
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-[2000ms]"
            />

            {/* Artistic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent" />

            {/* Dynamic Grid Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}
            />

            <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="max-w-xl"
                >
                    <div className="flex gap-4 mb-10">
                        {[Users, Globe, Zap, Box].map((Icon, idx) => (
                            <div key={idx} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
                                <Icon size={24} strokeWidth={1.5} />
                            </div>
                        ))}
                    </div>

                    <h3 className="text-6xl font-black mb-8 tracking-tight leading-[0.9] text-white">
                        JOIN THE <br />
                        <span className="text-white/20 italic">DIRECTIVE</span>
                    </h3>

                    <p className="text-neutral-500 text-lg font-medium leading-relaxed mb-12">
                        Expand your reach in the digital dimension. Connect with
                        visionaries and trade architecture-ready assets in the most
                        secure marketplace ever built.
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Member Count</p>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-2xl tracking-tighter italic">12.4K+</span>
                                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Verified</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-2">Encryption</p>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-2xl tracking-tighter italic">SHA_512</span>
                                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Active</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />
        </div>
    );
}

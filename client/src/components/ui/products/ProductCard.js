'use client';

import { motion } from 'framer-motion';
import { Eye, ShoppingCart, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product, index }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative"
        >
            <div className="relative bg-neutral-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-emerald-500/40 hover:bg-neutral-900/80 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col h-full">

                {/* Premium Image Container */}
                <div className="aspect-[16/11] relative overflow-hidden m-3 rounded-[1.8rem]">
                    {product.previewUrls?.[0] ? (
                        <img
                            src={product.previewUrls[0]}
                            alt={product.title}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700 font-black italic tracking-tighter text-3xl">
                            NO IMG
                        </div>
                    )}

                    {/* Top Tags */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black tracking-widest uppercase">
                            {product.category?.name || 'Asset'}
                        </div>
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                        <Link
                            href={`/products/${product.id}`}
                            className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-emerald-400 transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 ease-out"
                        >
                            <Eye size={24} />
                        </Link>
                        <button className="w-14 h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center hover:bg-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-100 ease-out">
                            <ShoppingCart size={24} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-8 pt-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black tracking-tight leading-tight max-w-[70%] group-hover:text-emerald-400 transition-colors">
                            {product.title}
                        </h3>
                        <div className="text-xl font-black text-white/90">
                            ${parseFloat(product.price).toFixed(0)}<span className="text-xs text-neutral-600 font-medium italic">.{(parseFloat(product.price) % 1).toFixed(2).slice(2)}</span>
                        </div>
                    </div>

                    <p className="text-neutral-500 text-sm font-medium leading-[1.6] line-clamp-2 mb-8">
                        {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-500 p-[1px] group-hover:rotate-12 transition-transform duration-500">
                                <div className="w-full h-full rounded-[11px] bg-black flex items-center justify-center">
                                    <img
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.user?.username || 'DV'}`}
                                        alt="User"
                                        className="w-6 h-6 rounded-lg opacity-80"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]">
                                {product.user?.username?.split(' ')[0] || 'VAULT'}
                            </span>
                        </div>

                        <Link
                            href={`/products/${product.id}`}
                            className="text-xs font-black uppercase tracking-[0.2em] text-neutral-600 hover:text-emerald-400 transition-colors flex items-center gap-2 group/btn"
                        >
                            Details
                            <Zap size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background decorative glow on hover */}
            <div className="absolute -inset-2 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
        </motion.div>
    );
}

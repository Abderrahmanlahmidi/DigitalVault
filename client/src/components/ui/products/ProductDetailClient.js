'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Star, ShoppingCart, Zap, MessageSquare, Share2, Download, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailClient({ product, activeImage, setActiveImage }) {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
            {/* Breadcrumbs / Back Link */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <Link
                    href="/products"
                    className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Side: Product Media */}
                <div className="lg:col-span-7 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-[16/10] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group"
                    >
                        {product.previewUrls?.[activeImage] ? (
                            <img
                                src={product.previewUrls[activeImage]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-800 font-black italic text-4xl">
                                ASSET PREVIEW
                            </div>
                        )}

                        {/* Tags on Image */}
                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                            <div className="px-4 py-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                                {product.category?.name || 'Digital Asset'}
                            </div>
                        </div>
                    </motion.div>

                    {/* Thumbnail Grid */}
                    {product.previewUrls?.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {product.previewUrls.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-emerald-500 scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                                >
                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="py-12 border-t border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-600 mb-8">Detailed Specification</h3>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                            <div className="p-6 bg-neutral-900/30 rounded-3xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Instant Verification</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">All digital assets are scanned and verified by our security protocol.</p>
                                </div>
                            </div>
                            <div className="p-6 bg-neutral-900/30 rounded-3xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Temporary Links</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Secure download links are valid for 24 hours after purchase.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Purchase Card */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 lg:pl-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-900/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="mb-8 flex justify-between items-start">
                                <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">{product.title}</h1>
                                <button className="p-3 bg-white/5 rounded-2xl text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="text-4xl font-black">
                                    ${parseFloat(product.price).toFixed(0)}<span className="text-lg text-neutral-600 italic">.{(parseFloat(product.price) % 1).toFixed(2).slice(2)}</span>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="flex items-center gap-2 text-amber-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm font-black italic">4.9</span>
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">(2.4k sales)</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <button className="w-full py-6 bg-white text-black font-black text-sm rounded-[1.5rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3">
                                    <ShoppingCart size={20} /> ADD TO CART
                                </button>
                                <button className="w-full py-6 bg-neutral-900 border border-white/10 text-white font-black text-sm rounded-[1.5rem] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
                                    <Zap size={20} className="text-emerald-500" /> PURCHASE NOW
                                </button>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-black border border-white/5 rounded-2xl p-1 shadow-inner group overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.user?.username || 'DV'}`}
                                            className="w-full h-full rounded-xl transition-transform group-hover:scale-110"
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1">Created By</p>
                                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer">{product.user?.username || 'Digital Vault Creator'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                        <MessageSquare size={14} /> Contact
                                    </button>
                                    <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                        <Share2 size={14} /> Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

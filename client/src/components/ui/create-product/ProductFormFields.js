'use client';

import { Layers, DollarSign, Tag, Save, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductFormFields({ register, categories, isSubmitting, uploadProgress }) {
    return (
        <section className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl sticky top-32">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-10 flex items-center gap-3">
                <Layers size={16} /> 03. Specifications
            </h2>

            <div className="space-y-8">
                {/* Title */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Asset Name</label>
                    <input
                        {...register('title', { required: true })}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500/30 transition-all font-black"
                        placeholder="EPIC PRODUCT NAME"
                    />
                </div>

                {/* Row Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Vault Price ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                            <input
                                type="number" step="0.01"
                                {...register('price', { required: true })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-emerald-500/30 transition-all font-black"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                            <select
                                {...register('category', { required: true })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-10 outline-none focus:border-emerald-500/30 transition-all font-black appearance-none cursor-pointer"
                            >
                                <option value="">SELECT</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Manifesto / Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        rows={6}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500/30 transition-all font-medium text-sm leading-relaxed resize-none"
                        placeholder="Describe the soul of this digital asset..."
                    />
                </div>

                {/* Status Toggle */}
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6 text-center">Initial Security Status</p>
                    <div className="flex gap-4">
                        {['PENDING', 'APPROVED'].map(s => (
                            <label key={s} className="flex-1">
                                <input type="radio" value={s} {...register('status')} className="hidden peer" />
                                <div className="w-full py-3 text-center rounded-xl border border-white/5 bg-white/5 text-[10px] font-black tracking-widest cursor-pointer transition-all peer-checked:bg-emerald-500 peer-checked:text-black peer-checked:border-emerald-500">
                                    {s}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8 flex flex-col gap-6">
                    {isSubmitting && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">
                                <span>Synchronizing Vault</span> <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                            </div>
                        </div>
                    )}
                    <button
                        type="submit" disabled={isSubmitting}
                        className="w-full py-6 bg-white text-black font-black text-sm rounded-[1.5rem] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSubmitting ? "INITIATING VAULT UPLOAD..." : "SECURE ASSET"}
                        {!isSubmitting && <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                    </button>
                </div>
            </div>
        </section>
    );
}

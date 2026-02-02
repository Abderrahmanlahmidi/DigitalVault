'use client';

import { Upload, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUpload({ imagePreviews, handleImageChange, removeImage, setActiveImage }) {
    return (
        <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-8 flex items-center gap-3">
                <Upload size={16} /> 01. Visual Previews
            </h2>

            <div className="space-y-6">
                <input
                    type="file" accept="image/*" multiple
                    onChange={handleImageChange} className="hidden" id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="block border-2 border-dashed border-white/5 bg-neutral-900/40 rounded-[2.5rem] py-16 text-center cursor-pointer group hover:border-emerald-500/30 hover:bg-neutral-900/60 transition-all duration-500"
                >
                    <div className="w-20 h-20 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
                        <Upload className="text-neutral-500 group-hover:text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-xl font-black mb-2">Drop Previews Here</h3>
                    <p className="text-neutral-500 text-sm font-medium">Upload up to 10 high-resolution images.</p>
                </label>

                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                        <AnimatePresence>
                            {imagePreviews.map((preview, index) => (
                                <motion.div
                                    key={preview}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5"
                                >
                                    <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button" onClick={() => setActiveImage(preview)}
                                            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            type="button" onClick={() => removeImage(index)}
                                            className="p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
}

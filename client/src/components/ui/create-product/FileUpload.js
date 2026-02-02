'use client';

import { FileText, X, Zap, ShieldCheck } from 'lucide-react';

export default function FileUpload({ selectedFile, register, setValue, formatFileSize }) {
    return (
        <section className="pt-12 border-t border-white/5">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-8 flex items-center gap-3">
                <FileText size={16} /> 02. Digital Material
            </h2>
            <div className="relative">
                <input
                    {...register('file', { required: 'Asset file is required' })}
                    type="file" className="hidden" id="file-upload"
                />
                {!selectedFile?.length ? (
                    <label htmlFor="file-upload" className="flex items-center gap-6 p-8 bg-neutral-900/40 border border-white/5 rounded-[2rem] cursor-pointer group hover:bg-neutral-900/60 hover:border-indigo-500/30 transition-all duration-500">
                        <div className="w-16 h-16 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                            <ShieldCheck className="text-neutral-500 group-hover:text-indigo-400" size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black mb-1">Select Digital Asset</h4>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">ZIP, PDF or Binary (Max 2GB)</p>
                        </div>
                    </label>
                ) : (
                    <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                <Zap size={28} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-black truncate max-w-[200px]">{selectedFile[0].name}</p>
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">{formatFileSize(selectedFile[0].size)}</p>
                            </div>
                        </div>
                        <button
                            type="button" onClick={() => setValue('file', null)}
                            className="p-3 bg-white/5 hover:bg-rose-500/20 text-neutral-500 hover:text-rose-500 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

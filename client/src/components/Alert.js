import React from 'react';
import { CheckCircle2, AlertCircle, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Alert({ type = 'error', message, onClose }) {
    if (!message) return null;

    const isSuccess = type === 'success';
    const Icon = isSuccess ? ShieldCheck : ShieldAlert;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mb-8 p-6 rounded-2xl border flex items-center justify-between gap-4 backdrop-blur-xl shadow-2xl ${isSuccess
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-500/5'
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${isSuccess ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{message}</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all active:scale-90"
                    >
                        <X size={16} />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

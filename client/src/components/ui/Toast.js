'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
};

const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-50',
    error: 'border-rose-500/20 bg-rose-500/10 text-rose-50',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-50',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-50',
};

const Toast = ({ message, type, onClose }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
            }}
            className={`
                pointer-events-auto
                flex items-center gap-3 px-4 py-3 rounded-xl border
                backdrop-blur-xl shadow-2xl
                min-w-[300px] max-w-md
                ${colors[type] || colors.info}
            `}
        >
            <div className="flex-shrink-0">
                {icons[type] || icons.info}
            </div>

            <div className="flex-grow text-sm font-medium">
                {message}
            </div>

            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
                <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
        </motion.div>
    );
};

export default Toast;

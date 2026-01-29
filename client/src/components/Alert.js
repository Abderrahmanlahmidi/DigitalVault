import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-emerald-900/20' : 'bg-red-900/20';
    const borderColor = isSuccess ? 'border-emerald-900/50' : 'border-red-900/50';
    const textColor = isSuccess ? 'text-emerald-400' : 'text-red-400';
    const Icon = isSuccess ? CheckCircle2 : AlertCircle;

    return (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between gap-3 text-sm border ${bgColor} ${borderColor} ${textColor}`}>
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`p-1 rounded-full hover:bg-white/10 transition-colors ${textColor}`}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCircle } from 'lucide-react';

export default function ProfileHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
            <Link
                href="/"
                className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Dashboard
            </Link>

            <div className="flex items-center gap-3 mb-4">
                <UserCircle size={16} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Security Vault</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                ACCOUNT <span className="text-white/20 uppercase">Settings</span>
            </h1>
        </motion.div>
    );
}

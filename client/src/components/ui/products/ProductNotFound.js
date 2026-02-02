'use client';

import { Info } from 'lucide-react';
import Link from 'next/link';

export default function ProductNotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-8 border border-white/5">
                <Info className="text-neutral-600" size={40} />
            </div>
            <h1 className="text-2xl font-black mb-4 tracking-tight">ASSET NOT FOUND</h1>
            <p className="text-neutral-500 max-w-sm mb-8">
                The requested digital asset could not be located in our vault. It may have been relocated or removed.
            </p>
            <Link href="/products" className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all">
                BACK TO MARKETPLACE
            </Link>
        </div>
    );
}

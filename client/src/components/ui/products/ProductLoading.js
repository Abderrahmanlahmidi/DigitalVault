'use client';

import { Loader2 } from 'lucide-react';

export default function ProductLoading({ message = "Retrieving Asset Data" }) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
            <p className="text-neutral-500 font-bold tracking-widest text-xs uppercase animate-pulse">
                {message}
            </p>
        </div>
    );
}

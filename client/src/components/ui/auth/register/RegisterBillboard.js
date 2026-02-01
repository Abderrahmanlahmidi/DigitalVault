'use client';

import { Users } from 'lucide-react';

export default function RegisterBillboard() {
    return (
        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
            <img
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1920&q=80"
                alt="Join Community"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <Users className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-white/80 tracking-wider">COMMUNITY</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white leading-tight">Join the Creator Network</h3>
                <p className="text-neutral-400 max-w-md leading-relaxed">
                    Buy and sell 3D models, code, and templates in an ecosystem designed for secure transactions and instant access.
                </p>
            </div>
        </div>
    );
}

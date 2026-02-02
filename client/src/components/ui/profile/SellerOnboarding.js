'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Loader2, Store, Briefcase, ChevronRight, Sparkles } from 'lucide-react';

export default function SellerOnboarding({ userId }) {
    const queryClient = useQueryClient();

    const { data: profile } = useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            if (!userId) return null;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
                headers: { 'user-id': userId }
            });
            return response.data || {};
        },
        enabled: !!userId,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                firstName: data.firstName || data.given_name,
                lastName: data.lastName || data.family_name,
                phoneNumber: data.phoneNumber || data.phone_number,
                role: data.role,
            };
            return axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, payload, {
                headers: { 'user-id': userId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
        },
    });

    if (!profile || (profile?.role?.name !== 'CLIENT' && profile?.role !== 'CLIENT')) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-neutral-900/60 border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white text-black rounded-2xl shadow-2xl">
                                    <Store size={28} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Commercial License</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-6">
                                ACTIVATE <br />
                                <span className="text-white/20 uppercase italic">Merchant Mode</span>
                            </h2>
                            <p className="text-neutral-500 text-lg font-medium leading-relaxed max-w-lg">
                                Transform your account into a high-performance storefront. Distribute 3D models,
                                premium code fragments, and templates with secure automated delivery.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Encrypted File Delivery',
                                'Automated Sales Links',
                                'Secure Download Vault',
                                'Global Creator Support'
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-black text-neutral-400 uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    {benefit}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => updateProfileMutation.mutate({ ...profile, role: 'seller', given_name: profile.firstName, family_name: profile.lastName, phone_number: profile.phoneNumber })}
                            disabled={updateProfileMutation.isPending}
                            className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black text-xs rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 group/btn shadow-2xl shadow-white/5"
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    INITIATE ONBOARDING
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="hidden lg:flex w-72 h-72 bg-black/40 border border-white/5 rounded-[3rem] items-center justify-center relative overflow-hidden group-hover:border-emerald-500/20 transition-colors">
                        <Briefcase size={120} className="text-neutral-800/40 relative z-10" strokeWidth={1} />
                        <Sparkles size={40} className="absolute top-10 right-10 text-emerald-500/20 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

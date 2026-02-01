'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Loader2, Store, Briefcase } from 'lucide-react';



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

    if (!profile || profile?.role?.name !== 'CLIENT') {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative overflow-hidden group"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-8 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white text-black rounded-xl">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">Become a Seller</h3>
                        </div>
                        <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
                            Join our specialized marketplace for 3D models, code snippets, and Notion templates. Sell securely with temporary download links.
                        </p>

                        <ul className="space-y-3">
                            {[
                                'Sell 3D models, code, and templates',
                                'Files accessible only after payment',
                                'Temporary secure download links',
                                'Reach a global audience of creators'
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => updateProfileMutation.mutate({ ...profile, role: 'seller', given_name: profile.firstName, family_name: profile.lastName, phone_number: profile.phoneNumber })}
                            disabled={updateProfileMutation.isPending}
                            className="w-full sm:w-auto mt-4 px-8 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Become a Seller
                                    <Store size={18} className="group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                    <div className="hidden lg:block">
                        <Briefcase size={120} className="text-neutral-800/50 -mr-4 -mt-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

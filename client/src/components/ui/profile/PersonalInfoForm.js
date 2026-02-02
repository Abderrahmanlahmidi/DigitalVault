'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, Store, Save, Loader2, Sparkles } from 'lucide-react';
import Alert from '@/components/Alert';

export default function PersonalInfoForm({ userId }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const { data: profile, isLoading } = useQuery({
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

    useEffect(() => {
        if (profile) {
            setValue('given_name', profile.firstName || '');
            setValue('family_name', profile.lastName || '');
            setValue('email', profile.email || '');
            setValue('phone_number', profile.phoneNumber || '');
        }
    }, [profile, setValue]);

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData) => {
            const payload = {
                firstName: updatedData.given_name,
                lastName: updatedData.family_name,
                phoneNumber: updatedData.phone_number,
                role: updatedData.role,
            };
            return axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, payload, {
                headers: { 'user-id': userId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
        },
    });

    const onUpdateProfile = (data) => {
        updateProfileMutation.mutate(data);
    };

    if (isLoading || !profile) {
        return (
            <div className="bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-emerald-500" size={48} strokeWidth={1} />
                <p className="text-neutral-500 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Syncing User Data</p>
            </div>
        );
    }

    const currentRole = profile?.role?.name?.toUpperCase() || 'CLIENT';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl"
        >
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-2 flex items-center gap-2">
                        <User size={14} /> 01. Identification
                    </h3>
                    <p className="text-neutral-500 text-sm font-medium">Coordinate your digital material identity.</p>
                </div>
                {updateProfileMutation.isSuccess && (
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-fade-in">
                        VAULT UPDATED
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">First Name</label>
                        <input
                            {...register('given_name', { required: true })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                            placeholder="LEGACY"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Last Name</label>
                        <input
                            {...register('family_name', { required: true })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                            placeholder="OPERATOR"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Vault Email</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700" size={18} />
                            <input
                                {...register('email')}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-neutral-600 cursor-not-allowed font-bold"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Secure Link Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700" size={18} />
                            <input
                                {...register('phone_number')}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                                placeholder="+1 000 000 0000"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Operational Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => onUpdateProfile({ ...profile, given_name: profile.firstName, family_name: profile.lastName, phone_number: profile.phoneNumber, role: 'CLIENT' })}
                            className={`p-1 rounded-[1.8rem] transition-all duration-500 ${currentRole === 'CLIENT' ? 'bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-transparent'}`}
                        >
                            <div className={`flex items-center gap-5 p-6 rounded-[1.5rem] border transition-all duration-500 ${currentRole === 'CLIENT' ? 'border-indigo-500 bg-black text-indigo-400' : 'border-white/5 bg-black/40 text-neutral-500 hover:border-white/10'}`}>
                                <div className={`p-3 rounded-xl ${currentRole === 'CLIENT' ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
                                    <User size={22} strokeWidth={currentRole === 'CLIENT' ? 2.5 : 1.5} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-sm uppercase tracking-widest">Client Mode</p>
                                    <p className="text-[10px] font-medium opacity-60">Procure digital assets</p>
                                </div>
                                {currentRole === 'CLIENT' && <ShieldCheck className="ml-auto" size={20} />}
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => onUpdateProfile({ ...profile, given_name: profile.firstName, family_name: profile.lastName, phone_number: profile.phoneNumber, role: 'SELLER' })}
                            className={`p-1 rounded-[1.8rem] transition-all duration-500 ${currentRole === 'SELLER' ? 'bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-transparent'}`}
                        >
                            <div className={`flex items-center gap-5 p-6 rounded-[1.5rem] border transition-all duration-500 ${currentRole === 'SELLER' ? 'border-emerald-500 bg-black text-emerald-400' : 'border-white/5 bg-black/40 text-neutral-500 hover:border-white/10'}`}>
                                <div className={`p-3 rounded-xl ${currentRole === 'SELLER' ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                                    <Store size={22} strokeWidth={currentRole === 'SELLER' ? 2.5 : 1.5} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-sm uppercase tracking-widest">Seller Mode</p>
                                    <p className="text-[10px] font-medium opacity-60">Distribute digital material</p>
                                </div>
                                {currentRole === 'SELLER' && <ShieldCheck className="ml-auto" size={20} />}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="group flex items-center gap-3 px-10 py-5 bg-white text-black text-xs font-black rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-white/5 disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {updateProfileMutation.isPending ? "SYNCHRONIZING..." : "SAVE ARCHIVE CHANGES"}
                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
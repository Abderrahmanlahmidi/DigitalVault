'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, Store, Save, Loader2 } from 'lucide-react';
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

    const getRoleName = (p) => {
        if (!p?.role) return 'CLIENT';
        return typeof p.role === 'object' ? p.role.name : p.role;
    };

    useEffect(() => {
        if (profile) {
            setValue('given_name', profile.firstName || '');
            setValue('family_name', profile.lastName || '');
            setValue('email', profile.email || '');
            setValue('phone_number', profile.phoneNumber || '');
            setValue('role', getRoleName(profile).toUpperCase());
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
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-white" size={32} />
                <p className="text-neutral-500 text-sm">Loading your information...</p>
            </div>
        );
    }

    const currentRole = getRoleName(profile).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="text-neutral-500" size={20} /> Personal Information
                </h3>
                <p className="text-neutral-500 text-sm mt-1">Update your personal details here.</p>
            </div>

            <Alert
                type="success"
                message={updateProfileMutation.isSuccess ? 'Profile updated successfully.' : null}
                onClose={() => updateProfileMutation.reset()}
            />

            <Alert
                type="error"
                message={updateProfileMutation.isError ? (updateProfileMutation.error?.response?.data?.message || "Failed to update profile.") : null}
                onClose={() => updateProfileMutation.reset()}
            />

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">First Name</label>
                        <input
                            {...register('given_name', { required: 'First name is required' })}
                            type="text"
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                            placeholder="Jane"
                        />
                        {errors.given_name && <p className="text-red-500 text-xs mt-1">{errors.given_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">Last Name</label>
                        <input
                            {...register('family_name', { required: 'Last name is required' })}
                            type="text"
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                            placeholder="Doe"
                        />
                        {errors.family_name && <p className="text-red-500 text-xs mt-1">{errors.family_name.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">Email Address</label>
                        <div className="relative">
                            <input
                                {...register('email')}
                                type="email"
                                disabled
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 pl-10 text-neutral-500 cursor-not-allowed outline-none"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">Phone Number</label>
                        <div className="relative">
                            <input
                                {...register('phone_number')}
                                type="tel"
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 pl-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                placeholder="+1 (555) 000-0000"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral-400 block">Account Role</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Client Mode Button */}
                        <button
                            type="button"
                            disabled={currentRole === 'CLIENT' || updateProfileMutation.isPending}
                            onClick={() => onUpdateProfile({
                                given_name: profile.firstName,
                                family_name: profile.lastName,
                                phone_number: profile.phoneNumber,
                                role: 'CLIENT'
                            })}
                            className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${currentRole === 'CLIENT'
                                ? 'border-indigo-500 bg-indigo-500/10 cursor-default'
                                : 'border-neutral-800 bg-black hover:border-indigo-400/50 hover:bg-indigo-500/5 cursor-pointer'
                                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${currentRole === 'CLIENT' ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <User size={22} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${currentRole === 'CLIENT' ? 'text-indigo-400' : 'text-white'}`}>Client Mode</p>
                                    <p className="text-xs text-neutral-500">Buy 3D models & code</p>
                                </div>
                            </div>
                            {currentRole === 'CLIENT' && <ShieldCheck className="text-indigo-500" size={20} />}
                        </button>

                        {/* Seller Mode Button */}
                        <button
                            type="button"
                            disabled={currentRole === 'SELLER' || updateProfileMutation.isPending}
                            onClick={() => onUpdateProfile({
                                given_name: profile.firstName,
                                family_name: profile.lastName,
                                phone_number: profile.phoneNumber,
                                role: 'SELLER'
                            })}
                            className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${currentRole === 'SELLER'
                                ? 'border-emerald-500 bg-emerald-500/10 cursor-default'
                                : 'border-neutral-800 bg-black hover:border-emerald-400/50 hover:bg-emerald-500/5 cursor-pointer'
                                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${currentRole === 'SELLER' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                                    <Store size={22} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${currentRole === 'SELLER' ? 'text-emerald-400' : 'text-white'}`}>Seller Mode</p>
                                    <p className="text-xs text-neutral-500">Sell models & code</p>
                                </div>
                            </div>
                            {currentRole === 'SELLER' && <ShieldCheck className="text-emerald-500" size={20} />}
                        </button>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {updateProfileMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
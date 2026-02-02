'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Save, KeyRound } from 'lucide-react';

export default function SecurityForm({ userId }) {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    const updatePasswordMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            };
            return axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, payload, {
                headers: { 'user-id': userId }
            });
        },
        onSuccess: () => {
            reset();
            setShowCurrentPass(false);
            setShowNewPass(false);
            setShowConfirmPass(false);
        }
    });

    const onUpdatePassword = (data) => {
        updatePasswordMutation.mutate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl"
        >
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-2 flex items-center gap-2">
                        <Lock size={14} /> 02. Secure Protocol
                    </h3>
                    <p className="text-neutral-500 text-sm font-medium">Reset your vault access credentials.</p>
                </div>
                {updatePasswordMutation.isSuccess && (
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-fade-in">
                        PROTOCOL RESET SUCCESS
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onUpdatePassword)} className="space-y-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Current Credential</label>
                    <div className="relative">
                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700" size={18} />
                        <input
                            {...register('currentPassword', { required: true })}
                            type={showCurrentPass ? "text" : "password"}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                            placeholder="••••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                        >
                            {showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">New Access Key</label>
                        <div className="relative">
                            <input
                                {...register('newPassword', {
                                    required: true,
                                    minLength: 8
                                })}
                                type={showNewPass ? "text" : "password"}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 pr-14 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                            >
                                {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Confirm Key</label>
                        <div className="relative">
                            <input
                                {...register('confirmNewPassword', {
                                    required: true,
                                    validate: (val) => watch('newPassword') === val
                                })}
                                type={showConfirmPass ? "text" : "password"}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 pr-14 outline-none focus:border-emerald-500/30 transition-all font-black text-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                            >
                                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={updatePasswordMutation.isPending}
                        className="flex items-center gap-3 px-10 py-5 bg-neutral-900 border border-white/10 text-white text-xs font-black rounded-2xl hover:bg-neutral-800 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                    >
                        {updatePasswordMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                        {updatePasswordMutation.isPending ? "ENCRYPTING..." : "UPDATE ACCESS KEY"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import Alert from '@/components/Alert';



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
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="text-neutral-500" size={20} /> Security
                </h3>
                <p className="text-neutral-500 text-sm mt-1">Change your password.</p>
            </div>

            <Alert
                type="success"
                message={updatePasswordMutation.isSuccess ? 'Password updated successfully.' : null}
                onClose={() => updatePasswordMutation.reset()}
            />

            <Alert
                type="error"
                message={updatePasswordMutation.isError ? (updatePasswordMutation.error?.response?.data?.message || "Failed to update password.") : null}
                onClose={() => updatePasswordMutation.reset()}
            />

            <form onSubmit={handleSubmit(onUpdatePassword)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400 block">Current Password</label>
                    <div className="relative">
                        <input
                            {...register('currentPassword', { required: 'Current password is required' })}
                            type={showCurrentPass ? "text" : "password"}
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 pr-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                        >
                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">New Password</label>
                        <div className="relative">
                            <input
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'Must be at least 8 characters' }
                                })}
                                type={showNewPass ? "text" : "password"}
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 pr-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                            >
                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400 block">Confirm New Password</label>
                        <div className="relative">
                            <input
                                {...register('confirmNewPassword', {
                                    required: 'Please confirm your new password',
                                    validate: (val) => {
                                        if (watch('newPassword') != val) {
                                            return "Passwords do not match";
                                        }
                                    }
                                })}
                                type={showConfirmPass ? "text" : "password"}
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 pr-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                            >
                                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={updatePasswordMutation.isPending}
                        className="px-6 py-2.5 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {updatePasswordMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Update Password
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

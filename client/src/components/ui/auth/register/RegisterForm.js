'use client';

import { signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Mail, Lock, Calendar, ArrowRight, User, Phone, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import '@/lib/amplify-config';

export default function RegisterForm() {
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            birthdate: '',
            phoneNumber: ''
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (data) => {
            return await signUp({
                username: data.email,
                password: data.password,
                options: {
                    userAttributes: {
                        email: data.email,
                        given_name: data.firstName,
                        family_name: data.lastName,
                        birthdate: data.birthdate,
                        phone_number: `+1${data.phoneNumber.replace(/\D/g, '')}`,
                        'custom:role': 'CLIENT'
                    }
                }
            });
        },
        onSuccess: (_, variables) => {
            router.push(`/auth/verify?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (error) => {
            console.error('Signup error:', error);
        }
    });

    const onSubmit = (data) => {
        if (data.password !== data.confirmPassword) return;
        registerMutation.mutate(data);
    };

    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 z-10 relative overflow-y-auto no-scrollbar bg-[#050505] border-r border-white/5">
            {/* Background Decorative Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full mx-auto relative z-10"
            >
                <Link href="/" className="mb-12 inline-block group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            DIGITAL<span className="text-white/20">VAULT</span>
                        </h1>
                    </div>
                </Link>

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-[1px] w-6 bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Inventory Setup</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none text-white">
                        NEW <span className="text-white/20 italic">OPERATOR</span>
                    </h2>
                    <p className="text-neutral-500 font-medium">Create your credentials for the global digital architecture.</p>
                </div>

                {registerMutation.isError && (
                    <div className="mb-8 p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        {registerMutation.error.message || 'Vault Registration Rejected'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">First Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                <input
                                    {...register('firstName', { required: 'Required' })}
                                    type="text" placeholder="LEGACY"
                                    className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.firstName ? 'border-rose-500/30' : ''}`}
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Last Name</label>
                            <input
                                {...register('lastName', { required: 'Required' })}
                                type="text" placeholder="UNIT"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.lastName ? 'border-rose-500/30' : ''}`}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Vault Identifier (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                {...register('email', { required: 'Identifer required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } })}
                                type="email" placeholder="operator@vault.io"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.email ? 'border-rose-500/30' : ''}`}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Sync Phone</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black text-[10px]">+1</span>
                                <input
                                    type="tel" placeholder="000 000 0000"
                                    className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.phoneNumber ? 'border-rose-500/30' : ''}`}
                                    value={formatPhoneNumber(watch('phoneNumber'))}
                                    onChange={(e) => setValue('phoneNumber', e.target.value.replace(/\D/g, ''))}
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Creation Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700" size={16} />
                                <input
                                    {...register('birthdate', { required: 'Required' })}
                                    type="date"
                                    className="w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm"
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Access Key (Password)</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                {...register('password', { required: 'Key required', minLength: 8 })}
                                type="password" placeholder="••••••••"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.password ? 'border-rose-500/30' : ''}`}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Confirm Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={16} />
                            <input
                                {...register('confirmPassword', { required: 'Confirm mismatch', validate: (val) => watch('password') === val })}
                                type="password" placeholder="••••••••"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 font-black text-sm ${errors.confirmPassword ? 'border-rose-500/30' : ''}`}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-white hover:bg-emerald-400 text-black py-6 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4 shadow-2xl shadow-white/5 hover:-translate-y-1 active:scale-[0.98] group"
                    >
                        {registerMutation.isPending ? (
                            <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                        ) : (
                            <>
                                Initialize Vault
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-10 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
                    ALREADY REGISTERED?{' '}
                    <Link href="/auth/login" className="text-white hover:text-emerald-400 transition-colors">
                        SIGN_IN_PROTOCOL
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

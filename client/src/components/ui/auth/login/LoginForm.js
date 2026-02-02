'use client';

import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import '@/lib/amplify-config';

export default function LoginForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            return await signIn({ username: email, password });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push('/');
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10 relative overflow-hidden bg-[#050505] border-r border-white/5">
            {/* Background Decorative Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full mx-auto relative z-10"
            >
                <Link href="/" className="mb-16 inline-block group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            DIGITAL<span className="text-white/20">VAULT</span>
                        </h1>
                    </div>
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-[1px] w-6 bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Security Access</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none text-white">
                        WELCOME <span className="text-white/20 italic">BACK</span>
                    </h2>
                    <p className="text-neutral-500 font-medium">Verify your credentials to access the vault architecture.</p>
                </div>

                {loginMutation.isError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                    >
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        {loginMutation.error.message || 'Invalid Access Key or Identifier'}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 pl-2">Vault Identifier (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email"
                                    }
                                })}
                                type="email"
                                placeholder="name@vault.io"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all font-black ${errors.email ? 'border-rose-500/30' : ''}`}
                                disabled={loginMutation.isPending}
                            />
                        </div>
                        {errors.email && <p className="text-[10px] font-black text-rose-500 mt-1 uppercase tracking-widest pl-2">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Access Secret</label>
                            <Link href="/auth/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">
                                Lost Secret?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                placeholder="••••••••••••"
                                className={`w-full bg-neutral-900/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-neutral-800 outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all font-black ${errors.password ? 'border-rose-500/30' : ''}`}
                                disabled={loginMutation.isPending}
                            />
                        </div>
                        {errors.password && <p className="text-[10px] font-black text-rose-500 mt-1 uppercase tracking-widest pl-2">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-white hover:bg-emerald-400 text-black py-6 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4 shadow-2xl shadow-white/5 hover:-translate-y-1 active:scale-[0.98] group"
                    >
                        {loginMutation.isPending ? (
                            <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                        ) : (
                            <>
                                Grant Access
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-12 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
                    NEW OPERATOR?{' '}
                    <Link href="/auth/register" className="text-white hover:text-emerald-400 transition-colors">
                        INITIATE REGISTRATION
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

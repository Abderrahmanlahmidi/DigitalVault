'use client';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import '@/lib/amplify-config';

export default function LoginPage() {
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
    <div className="min-h-screen flex bg-black text-white font-sans">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10 border-r border-neutral-800">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <Link href="/" className="mb-12 inline-block">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              DIGITAL<span className="text-neutral-500">VAULT</span>
            </h1>
          </Link>

          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-neutral-400 mb-8">Please enter your details to sign in.</p>

          {loginMutation.isError && (
            <div className="mb-6 p-4 border border-red-900/50 bg-red-900/10 rounded-lg text-red-500 text-sm flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {loginMutation.error.message || 'Invalid email or password'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide">Email</label>
              <div className="relative">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all ${errors.email ? 'border-red-900/50' : ''}`}
                  disabled={loginMutation.isPending}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide">Password</label>
                <Link href="/auth/forgot-password" size="sm" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all ${errors.password ? 'border-red-900/50' : ''}`}
                  disabled={loginMutation.isPending}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-white hover:bg-neutral-200 text-black p-4 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 mt-4"
            >
              {loginMutation.isPending ? 'Signing In...' : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-white hover:underline font-medium">
              Join DigitalVault
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Billboard Image - Unsplash */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80"
          alt="Secure Login"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h3 className="text-2xl font-bold mb-2 text-white">Enterprise Security</h3>
          <p className="text-neutral-400 max-w-md">Access your digital infrastructure with peace of mind. End-to-end encryption standard.</p>
        </div>
      </div>
    </div>
  );
}

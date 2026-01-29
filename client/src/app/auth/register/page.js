'use client';
import { signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Mail, Lock, Calendar, ArrowRight, User } from 'lucide-react';
import '@/lib/amplify-config';

export default function RegisterPage() {
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
    if (data.password !== data.confirmPassword) {
      return;
    }
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
    <div className="min-h-screen bg-black text-white font-sans">
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Side: Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 z-10 overflow-y-auto border-r border-neutral-800">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md w-full mx-auto"
            >
              <Link href="/" className="mb-10 inline-block">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  DIGITAL<span className="text-neutral-500">VAULT</span>
                </h1>
              </Link>

              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-neutral-400 mb-8">Start your journey with institutional-grade security.</p>

              {registerMutation.isError && (
                <div className="mb-6 p-4 border border-red-900/50 bg-red-900/20 rounded-lg text-red-300 text-sm flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-300 rounded-full" />
                  {registerMutation.error.message || 'An error occurred during sign up'}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-400">First Name</label>
                    <div className="relative">
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        type="text"
                        placeholder="John"
                        className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.firstName ? 'border-red-500' : ''}`}
                        disabled={registerMutation.isPending}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-400">Last Name</label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      placeholder="Doe"
                      className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.lastName ? 'border-red-500' : ''}`}
                      disabled={registerMutation.isPending}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-400">Email</label>
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
                      className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.email ? 'border-red-500' : ''}`}
                      disabled={registerMutation.isPending}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-400">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-sm">+1</span>
                    <input
                      type="tel"
                      placeholder="555-123-4567"
                      className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.phoneNumber ? 'border-red-500' : ''}`}
                      value={formatPhoneNumber(watch('phoneNumber'))}
                      onChange={(e) => setValue('phoneNumber', e.target.value.replace(/\D/g, ''))}
                      disabled={registerMutation.isPending}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-400">Birth Date</label>
                  <div className="relative">
                    <input
                      {...register('birthdate', { required: 'Birth date is required' })}
                      type="date"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                      disabled={registerMutation.isPending}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                  {errors.birthdate && (
                    <p className="text-red-400 text-sm mt-1">{errors.birthdate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-400">Password</label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters' }
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.password ? 'border-red-500' : ''}`}
                      disabled={registerMutation.isPending}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-400">Confirm Password</label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val) => {
                          if (watch('password') != val) {
                            return "Your passwords do not match";
                          }
                        }
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      disabled={registerMutation.isPending}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-white text-black border border-white hover:bg-neutral-200 p-4 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 mt-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {registerMutation.isPending ? 'Creating Account...' : (
                      <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </span>
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-white hover:underline font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Right Side: Billboard Image */}
          <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
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
              <h3 className="text-3xl font-bold mb-4 text-white leading-tight">Join the Network</h3>
              <p className="text-neutral-400 max-w-md leading-relaxed">
                Collaborate with entrepreneurs and builders worldwide in our ultra-secure ecosystem designed for growth.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
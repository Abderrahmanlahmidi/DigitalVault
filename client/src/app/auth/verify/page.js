'use client';

import { confirmSignUp } from 'aws-amplify/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      router.push('/auth/login?verified=true');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg px-10 py-16 text-center bg-neutral-900/40 border border-white/5 rounded-[3rem] backdrop-blur-3xl relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-2xl">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[1px] w-6 bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Identity Verification</span>
            <div className="h-[1px] w-6 bg-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none">
            VERIFY <span className="text-white/20 uppercase italic">Vault Access</span>
          </h1>
          <p className="text-neutral-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">
            We've transmitted a 6-digit synchronization key to <br />
            <span className="text-white/80 font-black italic">{email}</span>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleVerify} className="space-y-10 group">
          <div className="relative">
            <input
              type="text"
              placeholder="000 000"
              className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl text-center text-5xl font-black tracking-[0.4em] text-white focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-neutral-900 selection:bg-emerald-500/20"
              onChange={e => setCode(e.target.value.replace(/\s/g, ''))}
              required
              maxLength={6}
            />
            <div className="absolute inset-x-0 bottom-[-10px] flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
              <div className="h-[2px] w-20 bg-emerald-500 blur-[1px]" />
            </div>
          </div>

          <button
            disabled={isLoading || code.length !== 6}
            className="w-full bg-white hover:bg-emerald-400 text-black py-6 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-white/5 hover:-translate-y-1 active:scale-[0.98] group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} strokeWidth={3} />
            ) : (
              <>
                SECURE ACCOUNT
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
            HAVEN'T RECEIVED THE CODE?{' '}
            <button type="button" className="text-white hover:text-emerald-400 transition-colors">
              RE-TRANSMIT
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
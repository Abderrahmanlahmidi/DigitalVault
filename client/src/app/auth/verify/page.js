'use client';
import { confirmSignUp } from 'aws-amplify/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      router.push('/auth/login?verified=true');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans">
      <div className="w-full max-w-md px-8 py-12 text-center bg-neutral-900 border border-neutral-800 rounded-xl">
        <h1 className="text-3xl font-bold mb-2 text-white">Verify Your Email</h1>
        <p className="text-neutral-400 mb-8 text-sm">We've sent a 6-digit verification code to <span className="text-white font-medium">{email}</span></p>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            placeholder="000000"
            className="w-full bg-black border border-neutral-800 p-4 rounded-lg text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-neutral-800"
            onChange={e => setCode(e.target.value)}
            required
            maxLength={6}
          />
          <button
            disabled={isLoading}
            className="w-full bg-white text-black p-4 rounded-lg font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Confirm Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Camera, Loader2, ShieldCheck, Mail } from 'lucide-react';

export default function ProfileCard({ userId }) {
    const queryClient = useQueryClient();
    const [uploadError, setUploadError] = useState('');

    const { data: profile } = useQuery({
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

    const uploadImageMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-image`, formData, {
                headers: {
                    'user-id': userId,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            setUploadError('');
            queryClient.invalidateQueries(['profile']);
        },
        onError: (err) => {
            setUploadError("Database communication error.");
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && userId) uploadImageMutation.mutate(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-32 lg:col-span-1"
        >
            <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative mb-10">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-2 border-white/5 bg-black flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-105">
                            {uploadImageMutation.isPending ? (
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                            ) : profile?.profileImageUrl ? (
                                <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                                <User className="text-neutral-800" size={64} />
                            )}
                        </div>

                        <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-400 transition-all shadow-2xl active:scale-90">
                            <Camera size={20} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadImageMutation.isPending} />
                        </label>
                    </div>

                    <div className="text-center mb-10 w-full">
                        <h2 className="text-3xl font-black tracking-tight mb-2">
                            {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "LEGACY USER"}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-neutral-500 font-bold text-sm">
                            <Mail size={14} />
                            <span className="truncate max-w-[200px]">{profile?.email || "NOT_STORED@VAULT.IO"}</span>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Authority</span>
                            </div>
                            <span className="text-xs font-black uppercase bg-emerald-500 text-black px-3 py-1 rounded-lg">
                                {profile?.role?.name || "CLIENT"}
                            </span>
                        </div>

                        <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sync Status</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">LIVE_VAULT</span>
                        </div>
                    </div>
                </div>

                {uploadError && (
                    <p className="mt-6 text-center text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        {uploadError}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Camera, Loader2 } from 'lucide-react';



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
            console.error("Image Upload Failed", err);
            setUploadError("Failed to upload image. Make sure the backend endpoint exists.");
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && userId) {
            uploadImageMutation.mutate(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-1"
        >
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center backdrop-blur-sm sticky top-28">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-800 bg-neutral-800 relative shadow-lg">
                        {uploadImageMutation.isPending ? (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                <Loader2 className="animate-spin text-white" />
                            </div>
                        ) : profile?.profileImageUrl ? (
                            <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                <User size={48} />
                            </div>
                        )}
                    </div>

                    <label className={`px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-full cursor-pointer transition-colors flex items-center gap-2 ${uploadImageMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Camera size={14} />
                        {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadImageMutation.isPending} />
                    </label>
                    {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                    {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-sm text-neutral-400 break-all mb-4">
                    {profile?.email}
                </p>

                <div className="w-full h-px bg-neutral-800 my-4" />

                <div className="w-full text-left space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Role</span>
                        <span className="text-white font-medium bg-neutral-800 px-2 py-0.5 rounded text-xs">{profile?.role?.name || "CLIENT"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Status</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

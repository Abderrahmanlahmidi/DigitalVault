'use client';
import { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Camera, Save, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import '@/lib/amplify-config';
import Alert from '@/components/Alert';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [cognitoUser, setCognitoUser] = useState(null);
    const [uploadError, setUploadError] = useState('');

    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    useEffect(() => {
        getCurrentUser()
            .then(user => setCognitoUser(user))
            .catch(err => console.error("Not authenticated", err));
    }, []);

    const { data: profile, isLoading, isError, error } = useQuery({
        queryKey: ['profile', cognitoUser?.userId],
        queryFn: async () => {
            if (!cognitoUser) throw new Error("User not authenticated");

            const response = await axios.get(`${BACKEND_URL}/user/profile`, {
                headers: { 'user-id': cognitoUser.userId }
            });

            return response.data || {};
        },
        enabled: !!cognitoUser,
    });

    const { register: registerInfo, handleSubmit: handleSubmitInfo, setValue, formState: { errors: infoErrors } } = useForm();
    const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm();

    useEffect(() => {
        if (profile) {
            setValue('given_name', profile.firstName);
            setValue('family_name', profile.lastName);
            setValue('email', profile.email);
            setValue('phone_number', profile.phoneNumber);
        }
    }, [profile, setValue]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                firstName: data.given_name,
                lastName: data.family_name,
                phoneNumber: data.phone_number,
            };
            return axios.patch(`${BACKEND_URL}/user/update`, payload, {
                headers: { 'user-id': cognitoUser.userId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            };
            return axios.patch(`${BACKEND_URL}/user/update`, payload, {
                headers: { 'user-id': cognitoUser.userId }
            });
        },
        onSuccess: () => {
            resetPass();
            setShowCurrentPass(false);
            setShowNewPass(false);
            setShowConfirmPass(false);
        }
    });

    const uploadImageMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            return axios.post(`${BACKEND_URL}/user/upload-image`, formData, {
                headers: {
                    'user-id': cognitoUser.userId,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: (response) => {
            setUploadError('');
            // The backend should return the new image URL
            queryClient.invalidateQueries(['profile']);
        },
        onError: (err) => {
            console.error("Image Upload Failed", err);
            setUploadError("Failed to upload image. Make sure the backend endpoint exists.");
        }
    });


    const onUpdateProfile = (data) => {
        updateProfileMutation.mutate(data);
    };

    const onUpdatePassword = (data) => {
        updatePasswordMutation.mutate(data);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && cognitoUser) {
            console.log("the file image:", file);
            uploadImageMutation.mutate(file);
        }
    };


    if (isLoading || !cognitoUser) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-neutral-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
            <main className="container mx-auto px-4 pt-12 pb-20 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                    <p className="text-neutral-400 mb-10">Manage your profile information and security changes.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center backdrop-blur-sm sticky top-28">
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-800 bg-neutral-800 relative shadow-lg">
                                    {/* Optimistic UI or Actual Data */}
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

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <User className="text-neutral-500" size={20} /> Personal Information
                                </h3>
                                <p className="text-neutral-500 text-sm mt-1">Update your personal details here.</p>
                            </div>

                            <Alert
                                type="success"
                                message={updateProfileMutation.isSuccess ? 'Profile updated successfully.' : null}
                                onClose={() => updateProfileMutation.reset()}
                            />

                            <Alert
                                type="error"
                                message={updateProfileMutation.isError ? (updateProfileMutation.error?.response?.data?.message || "Failed to update profile.") : null}
                                onClose={() => updateProfileMutation.reset()}
                            />

                            <form onSubmit={handleSubmitInfo(onUpdateProfile)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">First Name</label>
                                        <input
                                            {...registerInfo('given_name', { required: 'First name is required' })}
                                            type="text"
                                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                            placeholder="Jane"
                                        />
                                        {infoErrors.given_name && <p className="text-red-500 text-xs mt-1">{infoErrors.given_name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">Last Name</label>
                                        <input
                                            {...registerInfo('family_name', { required: 'Last name is required' })}
                                            type="text"
                                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                            placeholder="Doe"
                                        />
                                        {infoErrors.family_name && <p className="text-red-500 text-xs mt-1">{infoErrors.family_name.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">Email Address</label>
                                        <div className="relative">
                                            <input
                                                {...registerInfo('email')}
                                                type="email"
                                                disabled
                                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 pl-10 text-neutral-500 cursor-not-allowed outline-none"
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                                        </div>
                                        <p className="text-[10px] text-neutral-600">Email cannot be changed directly.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">Phone Number</label>
                                        <div className="relative">
                                            <input
                                                {...registerInfo('phone_number')}
                                                type="tel"
                                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 pl-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updateProfileMutation.isPending}
                                        className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {updateProfileMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Password Section */}
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

                            <form onSubmit={handleSubmitPass(onUpdatePassword)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 block">Current Password</label>
                                    <div className="relative">
                                        <input
                                            {...registerPass('currentPassword', { required: 'Current password is required' })}
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
                                    {passErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passErrors.currentPassword.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">New Password</label>
                                        <div className="relative">
                                            <input
                                                {...registerPass('newPassword', {
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
                                        {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400 block">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                {...registerPass('confirmNewPassword', {
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
                                        {passErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmNewPassword.message}</p>}
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
                    </div>
                </div>
            </main>
        </div>
    );
}

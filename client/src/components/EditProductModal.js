'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    X,
    Upload,
    FileText,
    DollarSign,
    Tag,
    Layers,
    Save,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    Shield,
    AlertCircle,
    Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '@/context/ToastContext';

export default function EditProductModal({ product, isOpen, onClose }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewImages, setPreviewImages] = useState([]);

    const selectedFiles = watch('asset');
    const selectedPreviews = watch('previews');

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
            return response.data;
        },
    });

    useEffect(() => {
        if (product) {
            reset({
                title: product.title,
                description: product.description,
                price: product.price,
                categoryId: product.categoryId,
                status: product.status,
            });
            setPreviewImages(product.previewUrls || []);
        }
    }, [product, reset]);

    const updateMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${product.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product updated successfully!");
            queryClient.invalidateQueries(['my-products']);
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        },
        onSettled: () => {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    });

    const handlePreviewChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewImages(urls);
            setValue('previews', files);
        }
    };

    const onSubmit = (data) => {
        setIsSubmitting(true);
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('categoryId', data.categoryId);
        formData.append('status', data.status);

        if (data.previews && data.previews.length > 0) {
            Array.from(data.previews).forEach(file => {
                formData.append('previews', file);
            });
        }

        if (data.asset && data.asset[0]) {
            formData.append('asset', data.asset[0]);
        }

        updateMutation.mutate(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                                        <Edit2 size={20} className="text-emerald-500" />
                                    </div>
                                    Edit Product Details
                                </h2>
                                <p className="text-neutral-400 text-sm mt-1">Update your listing and synchronize with S3 storage.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="flex-grow overflow-y-auto px-8 py-8 custom-scrollbar">
                            <form id="edit-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left side: Assets & Media */}
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-neutral-500 flex items-center gap-2">
                                                <ImageIcon size={14} /> Media & Previews
                                            </h3>

                                            <div className="group relative aspect-video bg-black rounded-2xl border-2 border-dashed border-neutral-800 hover:border-emerald-500/50 transition-all overflow-hidden cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handlePreviewChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                {previewImages.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2 p-4 h-full">
                                                        {previewImages.slice(0, 3).map((img, i) => (
                                                            <img key={i} src={img} className="w-full h-full object-cover rounded-lg border border-white/10" alt="" />
                                                        ))}
                                                        {previewImages.length > 3 && (
                                                            <div className="flex items-center justify-center bg-neutral-800 rounded-lg text-xs font-bold">
                                                                +{previewImages.length - 3} MORE
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-500 group-hover:text-emerald-500 transition-colors">
                                                        <Upload size={32} />
                                                        <span className="font-bold text-sm">Upload New Previews</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-[10px] text-neutral-500 italic">Replacing previews will delete old files from S3 permanently.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-neutral-500 flex items-center gap-2">
                                                <FileText size={14} /> Digital Asset (Private)
                                            </h3>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    {...register('asset')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="p-4 bg-neutral-800/50 border border-neutral-800 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/50 transition-all">
                                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 group-hover:bg-indigo-500/20 transition-colors">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-bold text-white truncate">
                                                            {selectedFiles?.[0]?.name || "Keep existing file"}
                                                        </p>
                                                        <p className="text-[10px] text-neutral-500">ZIP, PDF, OR BINARY ASSET</p>
                                                    </div>
                                                    <Upload size={18} className="text-neutral-600 group-hover:text-indigo-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side: Information */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Title</label>
                                            <div className="relative">
                                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                <input
                                                    {...register('title', { required: true })}
                                                    className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                                                    placeholder="Amazing UI Kit"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Price ($)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                    <input
                                                        type="number" step="0.01"
                                                        {...register('price', { required: true })}
                                                        className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                    <select
                                                        {...register('categoryId', { required: true })}
                                                        className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                            <textarea
                                                rows={4}
                                                {...register('description', { required: true })}
                                                className="w-full bg-black border border-neutral-800 rounded-xl py-4 px-4 text-sm text-neutral-300 outline-none focus:border-emerald-500/50 transition-all resize-none"
                                                placeholder="Provide a detailed breakdown of your digital product..."
                                            />
                                        </div>

                                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                                            <AlertCircle className="text-emerald-500 flex-shrink-0" size={18} />
                                            <p className="text-[11px] text-emerald-500/80 leading-relaxed font-medium">
                                                Updating files will trigger a background synchronization with AWS S3.
                                                Ensure a stable internet connection for large asset uploads.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-md flex flex-col gap-4">
                            {isSubmitting && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                        <span>Uploading to Secure Vault</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 text-neutral-400 hover:text-white font-bold transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    form="edit-product-form"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isSubmitting ? "Updating S3..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

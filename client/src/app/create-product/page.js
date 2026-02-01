'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Upload, FileText, DollarSign, Tag, Layers, Save, Loader2, Image as ImageIcon, CheckCircle2, X, Eye } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
    const toast = useToast();
    const { user } = useAuth();

    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            status: 'PENDING',
            images: []
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const selectedImages = watch('images') || [];
    const selectedFile = watch('file');

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return response.json();
        },
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);

        const currentImages = watch('images') || [];
        setValue('images', [...currentImages, ...files]);
    };

    const removeImage = (index) => {
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);

        const currentImages = [...watch('images')];
        currentImages.splice(index, 1);
        setValue('images', currentImages);
    };

    const onSubmit = async (data) => {
        if (!user) {
            toast.error("You must be logged in to create a product");
            return;
        }

        setIsSubmitting(true);
        const productData = new FormData();

        // Basic fields
        productData.append('title', data.title);
        productData.append('description', data.description);
        productData.append('price', data.price);
        productData.append('categoryId', data.category);
        productData.append('userId', user.userId);
        productData.append('status', data.status.toUpperCase());

        // Files
        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                productData.append('previews', image);
            });
        }

        if (data.file && data.file[0]) {
            productData.append('asset', data.file[0]);
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            if (response.status === 201) {
                toast.success("Product created successfully!");
                // Clean up object URLs
                imagePreviews.forEach(url => URL.revokeObjectURL(url));
                // router.push('/products');
            }
        } catch (error) {
            console.error("Error creating product:", error);
            const errorMessage = error.response?.data?.message || "Failed to create product";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
                    <p className="text-neutral-400">Add a new item to your digital store.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Media Section */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ImageIcon className="text-emerald-500" size={20} /> Media & Files
                        </h2>

                        <div className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-neutral-400">Product Cover Images</label>

                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="w-full border-2 border-dashed border-neutral-700 rounded-2xl flex flex-col items-center justify-center py-12 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group text-center px-6"
                                    >
                                        <div className="p-4 bg-neutral-800 rounded-full mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                            <Upload className="text-neutral-400 group-hover:text-emerald-500" size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400">Click to upload cover images</h3>
                                        <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">Selected images will be displayed below. You can upload multiple high-quality previews.</p>
                                    </label>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                                            {imagePreviews.map((preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group aspect-square rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl cursor-pointer"
                                                    onClick={() => setActiveImage(preview)}
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] gap-3">
                                                        <div className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0">
                                                            <Eye size={20} />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(index);
                                                            }}
                                                            className="p-3 bg-rose-500/80 hover:bg-rose-600 rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
                            </div>

                            <hr className="border-neutral-800" />

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-400">Product File (Asset)</label>

                                <div className="relative">
                                    <input
                                        {...register('file', { required: 'Product file is required' })}
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                    />

                                    {!selectedFile || selectedFile.length === 0 ? (
                                        <label htmlFor="file-upload" className="border-2 border-dashed border-neutral-700 rounded-xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group text-center block">
                                            <div className="flex flex-col items-center">
                                                <div className="p-3 bg-neutral-800 rounded-full mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                                    <FileText className="text-neutral-400 group-hover:text-indigo-500" size={24} />
                                                </div>
                                                <span className="text-sm font-medium text-neutral-300 group-hover:text-indigo-400">Click to upload asset</span>
                                                <span className="text-xs text-neutral-500 mt-1">ZIP, RAR, PDF up to 2GB</span>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                                                        {selectedFile[0].name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {formatFileSize(selectedFile[0].size)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label htmlFor="file-upload" className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer">
                                                    <Upload size={18} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('file', null)}
                                                    className="p-2 hover:bg-rose-500/20 rounded-lg text-neutral-400 hover:text-rose-500 transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Layers className="text-indigo-500" size={20} /> Basic Information
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-400">Product Title</label>
                                <input
                                    {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
                                    type="text"
                                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                    placeholder="e.g., Modern Portfolio Template"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-400">Description</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows={5}
                                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none resize-none"
                                    placeholder="Describe your product clearly..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-neutral-400">Price ($)</label>
                                    <div className="relative">
                                        <input
                                            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                                            placeholder="0.00"
                                        />
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-neutral-400">Category</label>
                                    <div className="relative">
                                        <select
                                            {...register('category', { required: 'Category is required' })}
                                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 pl-10 text-white focus:border-white focus:ring-1 focus:ring-white transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                                            disabled={isLoadingCategories}
                                        >
                                            <option value="">
                                                {isLoadingCategories ? 'Loading categories...' : 'Select Category'}
                                            </option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                    </div>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-400">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="PENDING" {...register('status')} className="accent-white" />
                                        <span className="text-sm text-neutral-300">Pending</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="APPROVED" {...register('status')} className="accent-emerald-500" />
                                        <span className="text-sm text-neutral-300">Approved</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="REJECTED" {...register('status')} className="accent-rose-500" />
                                        <span className="text-sm text-neutral-300">Rejected</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isSubmitting && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400 font-medium">Uploading Asset & Previews...</span>
                                    <span className="text-emerald-500 font-bold">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end gap-4">
                            <Link href="/products" className="px-6 py-3 rounded-lg text-neutral-400 hover:text-white font-medium transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isSubmitting ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>

            {/* Full Image Lightbox Modal */}
            <AnimatePresence>
                {activeImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
                        onClick={() => setActiveImage(null)}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
                            onClick={() => setActiveImage(null)}
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={activeImage}
                            alt="Full Preview"
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

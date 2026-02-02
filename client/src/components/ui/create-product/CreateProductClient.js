'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import ImageUpload from './ImageUpload';
import FileUpload from './FileUpload';
import ProductFormFields from './ProductFormFields';

export default function CreateProductClient() {
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
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('categoryId', data.category);
        formData.append('userId', user.userId);
        formData.append('status', data.status.toUpperCase());

        if (data.images && data.images.length > 0) {
            data.images.forEach(image => formData.append('previews', image));
        }

        if (data.file && data.file[0]) {
            formData.append('asset', data.file[0]);
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)),
            });
            toast.success("Safe storage completed. Asset is live!");
            imagePreviews.forEach(URL.revokeObjectURL);
            router.push('/my-products');
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Vault Error");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-32">
            <div className="mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-4"
                >
                    <div className="h-[1px] w-8 bg-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Inventory System</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-6"
                >
                    SECURE <span className="text-white/20 uppercase">A New Asset</span>
                </motion.h1>
                <p className="text-neutral-500 font-medium text-lg max-w-2xl">
                    Fill in the technical specifications and upload your digital masterpiece to the vault.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Media & Assets */}
                <div className="lg:col-span-7 space-y-12">
                    <ImageUpload
                        imagePreviews={imagePreviews}
                        handleImageChange={handleImageChange}
                        removeImage={removeImage}
                        setActiveImage={setActiveImage}
                    />

                    <FileUpload
                        selectedFile={selectedFile}
                        register={register}
                        setValue={setValue}
                        formatFileSize={formatFileSize}
                    />
                </div>

                {/* Right Column: Specification */}
                <div className="lg:col-span-5 space-y-12">
                    <ProductFormFields
                        register={register}
                        categories={categories}
                        isSubmitting={isSubmitting}
                        uploadProgress={uploadProgress}
                    />
                </div>
            </form>

            {/* Lightbox */}
            <AnimatePresence>
                {activeImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-10 cursor-pointer"
                        onClick={() => setActiveImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            src={activeImage} className="max-w-full max-h-full object-contain rounded-3xl" alt=""
                        />
                        <div className="absolute top-10 right-10 text-neutral-500"><X size={32} /></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

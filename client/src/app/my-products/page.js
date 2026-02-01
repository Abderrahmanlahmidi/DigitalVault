'use client';

import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Plus,
    Package,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import EditProductModal from '@/components/EditProductModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Trash2 as TrashIcon } from 'lucide-react';

export default function MyProductsPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const queryClient = useQueryClient();
    const toast = useToast();

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['my-products', user?.userId],
        queryFn: async () => {
            if (!user?.userId) return [];
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/user/${user.userId}`);
            return res.data;
        },
        enabled: !!user?.userId,
    });

    const deleteMutation = useMutation({
        mutationFn: async (productId) => {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-products', user?.userId]);
            toast.success('Product deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    });

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            deleteMutation.mutate(productToDelete.id);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'REJECTED': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={14} />;
            case 'PENDING': return <Clock size={14} />;
            case 'REJECTED': return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">My Products</h1>
                        <p className="text-neutral-400">Manage and track your digital assets performance.</p>
                    </div>

                    <Link
                        href="/create-product"
                        className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-all active:scale-95 w-full md:w-auto"
                    >
                        <Plus size={20} />
                        Add New Product
                    </Link>
                </div>

                {/* Stats / Overview (Mock for UI feel) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Products', value: products.length, icon: <Package className="text-neutral-400" /> },
                        { label: 'Active Listings', value: products.filter(p => p.status === 'APPROVED').length, icon: <CheckCircle2 className="text-emerald-500" /> },
                        { label: 'Pending Review', value: products.filter(p => p.status === 'PENDING').length, icon: <Clock className="text-amber-500" /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search your products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-white/20 transition-all text-lg"
                    />
                </div>

                {/* Products List/Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                        <p className="text-neutral-400 animate-pulse">Loading your catalog...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-neutral-900/40 hover:bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 p-4 rounded-2xl transition-all flex flex-col md:flex-row items-center gap-6"
                                >
                                    {/* Preview Image */}
                                    <div className="w-full md:w-32 aspect-square rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                        {product.previewUrls?.[0] ? (
                                            <img
                                                src={product.previewUrls[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600 font-bold">
                                                NO IMG
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow text-center md:text-left min-w-0">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                            <h3 className="text-xl font-bold truncate transition-colors group-hover:text-emerald-400">
                                                {product.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getStatusColor(product.status)}`}>
                                                {getStatusIcon(product.status)}
                                                {product.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-neutral-500">
                                            <span className="flex items-center gap-1">
                                                <Store size={14} /> {product.category?.name || 'Uncategorized'}
                                            </span>
                                            <span className="font-bold text-white">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-neutral-400 text-sm mt-3 line-clamp-1 max-w-2xl">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            disabled={deleteMutation.isPending && deleteMutation.variables === product.id}
                                            className="p-3 bg-neutral-800 hover:bg-rose-500/20 rounded-xl text-neutral-300 hover:text-rose-500 transition-all disabled:opacity-50"
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables === product.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="p-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-all active:scale-90"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-3xl"
                    >
                        <div className="p-6 bg-neutral-800 rounded-full mb-6">
                            <Store className="text-neutral-500" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No products found</h2>
                        <p className="text-neutral-400 mb-8 max-w-sm text-center">
                            You haven't added any products yet or your search query matches nothing.
                        </p>
                        <Link
                            href="/create-product"
                            className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-all"
                        >
                            Start Selling
                        </Link>
                    </motion.div>
                )}
            </div>

            <EditProductModal
                isOpen={isEditModalOpen}
                product={selectedProduct}
                onClose={() => setIsEditModalOpen(false)}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.title}"? This action will permanently remove it from the vault and S3 storage.`}
                confirmText="Delete Product"
                cancelText="Keep Product"
                isDanger={true}
                Icon={TrashIcon}
            />
        </div>
    );
}

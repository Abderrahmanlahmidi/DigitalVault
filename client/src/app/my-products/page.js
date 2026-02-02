'use client';

import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Plus,
    Package,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Store,
    LayoutDashboard,
    ArrowUpRight,
    SearchX
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

    const { data: products = [], isLoading } = useQuery({
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
            case 'APPROVED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'REJECTED': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <LayoutDashboard size={16} className="text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Creator Dashboard</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-4"
                        >
                            MY <span className="text-white/20">PRODUCTS</span>
                        </motion.h1>
                        <p className="text-neutral-500 font-medium text-lg">Manage your digital vault and monitor asset status.</p>
                    </div>

                    <Link
                        href="/create-product"
                        className="group flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-white/5"
                    >
                        <Plus size={18} />
                        Add New Asset
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { label: 'Vault Inventory', value: products.length, icon: Package, color: 'text-white' },
                        { label: 'Active Marketplace', value: products.filter(p => p.status === 'APPROVED').length, icon: CheckCircle2, color: 'text-emerald-400' },
                        { label: 'Pending Audit', value: products.filter(p => p.status === 'PENDING').length, icon: Clock, color: 'text-amber-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl group hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <ArrowUpRight size={20} className="text-neutral-700 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                            <div className="text-4xl font-black">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Search Bar - Unified Design */}
                <div className="relative mb-12 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-emerald-500 transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search your collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/20 border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:border-emerald-500/30 transition-all text-lg font-bold placeholder:text-neutral-800"
                    />
                </div>

                {/* Products Table/List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="animate-spin text-emerald-500" size={48} strokeWidth={1} />
                        <p className="text-neutral-600 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Syncing Database</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group relative bg-neutral-900/30 hover:bg-neutral-900/60 border border-white/5 hover:border-emerald-500/30 p-5 rounded-[2.5rem] transition-all flex flex-col lg:flex-row items-center gap-8"
                                >
                                    {/* Preview Image */}
                                    <div className="w-full lg:w-40 aspect-[4/3] rounded-[1.8rem] overflow-hidden bg-neutral-800 flex-shrink-0 relative">
                                        {product.previewUrls?.[0] ? (
                                            <img
                                                src={product.previewUrls[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-700 font-black italic text-xl">
                                                EMPTY
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-grow min-w-0 py-2 text-center lg:text-left w-full">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                                            <h3 className="text-2xl font-black tracking-tight group-hover:text-emerald-400 transition-colors">
                                                {product.title}
                                            </h3>
                                            <span className={`inline-flex self-center lg:self-auto px-3 py-1 rounded-xl text-[10px] font-black tracking-widest border uppercase ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-bold text-neutral-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Store size={16} className="text-neutral-700" />
                                                {product.category?.name || 'ASSET'}
                                            </div>
                                            <div className="h-4 w-[1px] bg-white/10 hidden lg:block" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                                                <span className="text-white">${parseFloat(product.price).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-1 max-w-3xl font-medium">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Actions UI */}
                                    <div className="flex items-center gap-3 p-2 bg-black/40 rounded-[2rem] border border-white/5">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="w-14 h-14 flex items-center justify-center bg-neutral-800/50 hover:bg-emerald-500 text-neutral-400 hover:text-black rounded-2xl transition-all"
                                            title="Edit Asset"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            disabled={deleteMutation.isPending && deleteMutation.variables === product.id}
                                            className="w-14 h-14 flex items-center justify-center bg-neutral-800/50 hover:bg-rose-500 text-neutral-400 hover:text-white rounded-2xl transition-all disabled:opacity-50"
                                            title="Delete Asset"
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables === product.id ? (
                                                <Loader2 size={18} className="animate-spin text-white" />
                                            ) : (
                                                <Trash2 size={20} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="w-14 h-14 flex items-center justify-center bg-white text-black hover:bg-emerald-400 rounded-2xl transition-all active:scale-90"
                                            title="View Live"
                                        >
                                            <ExternalLink size={20} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-40 bg-neutral-900/10 border border-dashed border-white/5 rounded-[4rem] text-center px-6"
                    >
                        <div className="w-24 h-24 bg-neutral-900 border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden">
                            <SearchX size={40} className="text-neutral-700" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tighter">VAULT IS EMPTY</h2>
                        <p className="text-neutral-500 max-w-sm font-medium leading-relaxed mb-10">
                            Looks like you haven't secured any digital assets yet. Start your journey by creating your first listing.
                        </p>
                        <Link
                            href="/create-product"
                            className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-white/5"
                        >
                            CREATE FIRST ASSET
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

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, Sparkles, LayoutGrid, Target, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

export default function ProductsClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Fetch Products
    const { data: products = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
            return res.data;
        },
    });

    // Fetch Categories
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
            return res.data;
        },
    });

    // Filtering Logic
    const filteredProducts = products
        .filter(product => {
            const matchesSearch =
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
            const isApproved = product.status === 'APPROVED';

            return matchesSearch && matchesCategory && isApproved;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

    return (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
            {/* Modern Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-[1px] w-8 bg-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">The Collection</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9]"
                    >
                        PREMIUM <br />
                        <span className="text-white/20">DIGITAL ASSETS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed"
                    >
                        Unlock high-quality assets designed for professionals.
                        From sleek templates to powerful snippets.
                    </motion.p>
                </div>
            </div>

            {/* Filters & Search */}
            <ProductFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
            />

            {/* Content Grid */}
            {isLoadingProducts ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative">
                        <Loader2 className="animate-spin text-emerald-500" size={64} strokeWidth={1} />
                        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
                    </div>
                    <p className="text-neutral-500 font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">Loading Catalog</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-40 bg-neutral-900/20 border border-white/5 rounded-[4rem] text-center px-6"
                >
                    <div className="w-24 h-24 bg-neutral-900 border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden text-neutral-700">
                        <Sparkles size={40} className="relative z-10" />
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tighter">THE VAULT IS QUIET</h2>
                    <p className="text-neutral-500 max-w-sm font-medium leading-relaxed mb-10">
                        We couldn't find any products matching your specific artistic requirements.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                        }}
                        className="group flex items-center gap-3 px-10 py-5 bg-white text-black text-xs font-black rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-white/5"
                    >
                        CLEAR FILTERS
                        <LayoutGrid size={16} />
                    </button>
                </motion.div>
            )}
        </div>
    );
}

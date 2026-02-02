'use client';

import { Search, Tag, ArrowUpDown, ChevronDown } from 'lucide-react';

export default function ProductFilters({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories
}) {
    return (
        <div className="sticky top-24 z-30 mb-16">
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-4 flex flex-col lg:flex-row gap-4 items-center shadow-2xl">
                <div className="relative flex-grow w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, tags or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm font-semibold placeholder:text-neutral-700"
                    />
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto h-full">
                    {/* Category Selector */}
                    <div className="relative group flex-grow lg:flex-grow-0 min-w-[180px]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full appearance-none bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:border-emerald-500/30 transition-all hover:bg-neutral-800/50"
                        >
                            <option value="all">Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" size={14} />
                    </div>

                    {/* Sort Selector */}
                    <div className="relative group flex-grow lg:flex-grow-0 min-w-[180px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:border-emerald-500/30 transition-all hover:bg-neutral-800/50"
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="price-low">Price: Low</option>
                            <option value="price-high">Price: High</option>
                        </select>
                        <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ui/products/ProductDetailClient';
import ProductLoading from '@/components/ui/products/ProductLoading';
import ProductNotFound from '@/components/ui/products/ProductNotFound';


export default function ProductDetailPage() {
    const { id } = useParams();
    const [activeImage, setActiveImage] = useState(0);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <ProductLoading />;
    if (!product) return <ProductNotFound />;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-400">
            <Navbar />

            <ProductDetailClient
                product={product}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
            />

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #202020;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

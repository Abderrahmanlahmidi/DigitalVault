import Navbar from '@/components/Navbar';
import ProductsClient from '@/components/ui/products/ProductsClient';

export const metadata = {
    title: 'DigitalVault | Premium Marketplace',
    description: 'Discover high-quality 3D assets, code snippets, and templates.',
};

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden">
            <Navbar />
            
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-500/5 blur-[80px] rounded-full" />
            </div>

            <ProductsClient />

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #050505;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #202020;
                    border-radius: 10px;
                }
            `}} />
        </div>
    );
}

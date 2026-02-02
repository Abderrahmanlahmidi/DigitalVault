import Navbar from '@/components/Navbar';
import CreateProductClient from '@/components/ui/create-product/CreateProductClient';

export const metadata = {
    title: 'DigitalVault | Secure New Asset',
    description: 'Add your digital masterpiece to our premium vault.',
};

export default function CreateProductPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[160px] rounded-full" />
            </div>

            <CreateProductClient />
        </div>
    );
}

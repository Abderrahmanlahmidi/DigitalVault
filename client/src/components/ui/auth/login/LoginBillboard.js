'use client';

export default function LoginBillboard() {
    return (
        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
            <img
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1920&q=80"
                alt="Secure Login"
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-2xl font-bold mb-2 text-white">Digital Assets Vault</h3>
                <p className="text-neutral-400 max-w-md">Access your premium 3D models, code snippets, and templates. Secure access and temporary download links ensured.</p>
            </div>
        </div>
    );
}

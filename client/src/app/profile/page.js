import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { runWithAmplifyServerContext } from '@/utils/amplify-server-utils';
import { getCurrentUser } from 'aws-amplify/auth/server';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import ProfileCard from '@/components/ui/profile/ProfileCard';
import PersonalInfoForm from '@/components/ui/profile/PersonalInfoForm';
import SellerOnboarding from '@/components/ui/profile/SellerOnboarding';
import SecurityForm from '@/components/ui/profile/SecurityForm';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'DigitalVault | Profile Settings',
    description: 'Manage your digital identity and security settings.',
};

export default async function ProfilePage() {
    const cognitoUser = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => getCurrentUser(contextSpec)
    }).catch(err => null);

    if (!cognitoUser) {
        redirect('/auth/login');
    }

    const userId = cognitoUser.userId;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
                <ProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <ProfileCard userId={userId} />
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                        <PersonalInfoForm userId={userId} />
                        <SellerOnboarding userId={userId} />
                        <SecurityForm userId={userId} />
                    </div>
                </div>
            </main>
        </div>
    );
}

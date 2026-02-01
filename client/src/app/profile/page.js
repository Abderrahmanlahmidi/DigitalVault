import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { runWithAmplifyServerContext } from '@/utils/amplify-server-utils';
import { getCurrentUser } from 'aws-amplify/auth/server';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import ProfileCard from '@/components/ui/profile/ProfileCard';
import PersonalInfoForm from '@/components/ui/profile/PersonalInfoForm';
import SellerOnboarding from '@/components/ui/profile/SellerOnboarding';
import SecurityForm from '@/components/ui/profile/SecurityForm';

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
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
            <main className="container mx-auto px-4 pt-12 pb-20 max-w-5xl">
                <ProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ProfileCard userId={userId} />

                    <div className="lg:col-span-2 space-y-8">
                        <PersonalInfoForm userId={userId} />

                        <SellerOnboarding userId={userId} />
                        <SecurityForm userId={userId} />
                    </div>
                </div>
            </main>
        </div>
    );
}

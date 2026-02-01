'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import '@/lib/amplify-config';

const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const fetchUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        const listener = Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signedIn') fetchUser();
            if (payload.event === 'signedOut') {
                setUser(null);
                queryClient.clear();
            }
        });
        return listener;
    }, [queryClient]);

    const { data: profile } = useQuery({
        queryKey: ['profile', user?.userId],
        queryFn: async () => {
            if (!user) return null;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
                headers: { 'user-id': user.userId }
            });
            const data = res.data;
            if (data?.role) {
                const roleName = typeof data.role === 'object' ? data.role.name : data.role;
                document.cookie = `user-role=${roleName}; path=/; max-age=3600; SameSite=Lax`;
            }
            return data;
        },
        enabled: !!user,
        staleTime: Infinity,
    });

    const role = profile?.role?.name || profile?.role || 'CLIENT';

    const hasRole = (targetRole) => {
        if (!role) return false;
        return role.toUpperCase() === targetRole.toUpperCase();
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        queryClient.clear();
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            role,
            hasRole,
            logout,
            isLoading: isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

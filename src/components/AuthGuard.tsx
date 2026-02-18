'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 150);

        return () => clearTimeout(timeout);
    }, []);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isReady) return;

        if (isAuthenticated && token && pathname === '/') {
            router.replace('/dashboard');
        }

        if (!isAuthenticated && !token && pathname !== '/') {
            router.replace('/');
        }
    }, [isAuthenticated, token, pathname, router, isReady]);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="text-4xl">🏗️</div>
                    <div className="h-2 w-24 bg-blue-600 rounded"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
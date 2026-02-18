'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const publicRoutes = ['/', '/register'];
        const isPublicRoute = publicRoutes.includes(pathname);
        if (isAuthenticated && token && isPublicRoute) {
            router.replace('/dashboard');
        }
        if (!isAuthenticated && !token && !isPublicRoute) {
            router.replace('/');
        }
    }, [isAuthenticated, token, pathname, router, isReady]);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center">
                <span className="text-6xl animate-bounce">🏗️</span>
                <p className="mt-4 text-white font-black uppercase tracking-[0.3em] text-xs">SOP-CE</p>
            </div>
        );
    }

    return <>{children}</>;
}
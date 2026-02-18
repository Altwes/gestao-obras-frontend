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
        }, 150);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!isReady) return;
        const publicRoutes = ['/', '/register'];
        const isPublicRoute = publicRoutes.includes(pathname);
        if (isAuthenticated && token && isPublicRoute) {
            router.replace('/dashboard');
            return;
        }
        if (!isAuthenticated && !token && !isPublicRoute) {
            router.replace('/');
        }
    }, [isAuthenticated, token, pathname, router, isReady]);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="text-4xl text-white">🏗️</div>
                    <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SOP-CE</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
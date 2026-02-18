'use client';

import { useEffect, useState } from 'react';
import { HiDownload, HiX } from 'react-icons/hi';

export function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (e: any) => {
        e.preventDefault();
        if (!promptInstall) return;
        promptInstall.prompt();
    };

    if (!supportsPWA) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] animate-bounce-short">
            <div className="bg-blue-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-blue-400">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-2xl">🏗️</div>
                    <div>
                        <p className="font-black text-xs uppercase tracking-tighter">SOP-CE Obras</p>
                        <p className="text-[10px] opacity-90">Instale para usar offline na obra</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClick}
                        className="bg-white text-blue-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-all"
                    >
                        Instalar App
                    </button>
                    <button
                        onClick={() => setSupportsPWA(false)}
                        className="p-2 text-white/50 hover:text-white"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
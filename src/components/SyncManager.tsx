'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { api } from '@/services/api';
import { removerMedicaoSincronizada } from '@/store/slices/dataSlice';

export function SyncManager() {
    const dispatch = useDispatch();
    const { filaMedicoesOffline } = useSelector((state: RootState) => state.data);

    useEffect(() => {
        const sincronizar = async () => {
            if (navigator.onLine && filaMedicoesOffline.length > 0) {
                console.log(`📡 Sincronizando ${filaMedicoesOffline.length} medições...`);

                for (const medicao of filaMedicoesOffline) {
                    try {
                        await api.post('api/medicoes', medicao);

                        dispatch(removerMedicaoSincronizada(medicao.tempId));
                    } catch (error) {
                        console.error("❌ Erro ao sincronizar item específico:", error);
                    }
                }
            }
        };
        window.addEventListener('online', sincronizar);
        sincronizar();

        return () => window.removeEventListener('online', sincronizar);
    }, [filaMedicoesOffline, dispatch]);

    return null;
}
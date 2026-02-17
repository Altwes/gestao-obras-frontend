'use client';

import { HiQuestionMarkCircle, HiX } from 'react-icons/hi';

interface ModalConfirmacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    titulo: string;
    mensagem: string;
}

export function ModalConfirmacao({ isOpen, onClose, onConfirm, titulo, mensagem }: ModalConfirmacaoProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 text-center">
                    <div className="flex justify-center mb-4 text-amber-500">
                        <HiQuestionMarkCircle className="w-16 h-16" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {titulo}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        {mensagem}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
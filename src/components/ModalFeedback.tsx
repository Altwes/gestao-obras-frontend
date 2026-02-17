'use client';

import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

interface ModalFeedbackProps {
	isOpen: boolean;
	onClose: () => void;
	tipo: 'sucesso' | 'erro';
	mensagem: string;
}

export function ModalFeedback({ isOpen, onClose, tipo, mensagem }: ModalFeedbackProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
			<div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

				<div className="p-8 text-center">
					<div className="flex justify-center mb-4">
						{tipo === 'sucesso' ? (
							<HiCheckCircle className="w-16 h-16 text-green-500" />
						) : (
							<HiExclamationCircle className="w-16 h-16 text-red-500" />
						)}
					</div>

					<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
						{tipo === 'sucesso' ? 'Tudo certo!' : 'Ops, algo deu errado'}
					</h3>

					<p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
						{mensagem}
					</p>

					<button
						onClick={onClose}
						className={`w-full py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${tipo === 'sucesso'
							? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
							: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
							}`}
					>
						Entendido
					</button>
				</div>
			</div>
		</div>
	);
}
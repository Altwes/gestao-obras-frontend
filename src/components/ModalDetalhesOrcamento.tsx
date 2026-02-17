'use client';

import { HiX, HiCheckCircle } from 'react-icons/hi';

interface ModalDetalhesProps {
	obra: any;
	onClose: () => void;
}

export function ModalDetalhesOrcamento({ obra, onClose }: ModalDetalhesProps) {
	if (!obra) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
			<div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
				{/* Header do Modal */}
				<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhamento de Itens</h3>
						<p className="text-sm text-blue-600 font-bold uppercase">{obra.numeroProtocolo}</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-all"
					>
						<HiX className="w-6 h-6" />
					</button>
				</div>

				{/* Lista de Itens */}
				<div className="p-6 overflow-y-auto flex-1">
					<div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
						<HiCheckCircle className="text-green-500 w-5 h-5" />
						Planilha Orçamentária
					</div>
					<table className="w-full text-sm text-left">
						<thead className="text-gray-500 border-b dark:border-gray-700">
							<tr>
								<th className="py-2">ID</th>
								<th className="py-2">Descrição dos Itens</th>
								<th className="py-2 text-center">Qtd</th>
								<th className="py-2 text-right">Unitário</th>
								<th className="py-2 text-right">Total</th>
							</tr>
						</thead>
						<tbody className="divide-y dark:divide-gray-700">
							{obra.itens?.map((item: any) => (
								<tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
									<td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.id}</td>
									<td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.descricao}</td>
									<td className="py-3 text-center text-gray-800 dark:text-gray-200">{item.quantidade}</td>
									<td className="py-3 text-right text-gray-800 dark:text-gray-200">
										{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorUnitario)}
									</td>
									<td className="py-3 text-right font-bold text-gray-900 dark:text-white">
										{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorTotal)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Footer do Modal */}
				<div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex justify-between items-center font-sans">
					<span className="text-gray-600 dark:text-gray-400 font-bold">VALOR GLOBAL:</span>
					<span className="text-2xl font-black text-blue-800 dark:text-blue-500">
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obra.valorTotal)}
					</span>
				</div>
			</div>
		</div>
	);
}
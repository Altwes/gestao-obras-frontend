'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { HiX, HiCheckCircle, HiSave, HiHashtag } from 'react-icons/hi';

interface ModalMedicaoProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	obra: any;
	showAlert: (tipo: 'sucesso' | 'erro', msg: string) => void;
	showConfirm: (titulo: string, msg: string, onConfirm: () => void) => void;
}

export function ModalMedicao({ isOpen, onClose, onSuccess, obra, showAlert, showConfirm }: ModalMedicaoProps) {
	const [loading, setLoading] = useState(false);
	const [observacao, setObservacao] = useState('');
	const [proximoNumero, setProximoNumero] = useState<string>('...');
	const [quantidades, setQuantidades] = useState<{ [key: number]: number }>({});

	// Busca o próximo número sequencial baseado no histórico do banco
	useEffect(() => {
		async function carregarProximoNumero() {
			if (isOpen && obra?.id) {
				try {
					const response = await api.get(`api/medicoes/proximo-numero/${obra.id}`);
					// O backend retorna apenas o número (ex: 1, 2, 3)
					setProximoNumero(response.data);
				} catch (err) {
					console.error("Erro ao buscar sequencial:", err);
					setProximoNumero('?');
				}
			}
		}
		carregarProximoNumero();
	}, [isOpen, obra?.id]);

	if (!isOpen || !obra) return null;

	const handleInputChange = (itemId: number, value: string) => {
		setQuantidades({ ...quantidades, [itemId]: Number(value) || 0 });
	};

	const handleSalvarMedicao = async (e: React.FormEvent) => {
		e.preventDefault();

		const itensFormatados = Object.entries(quantidades)
			.filter(([_, qtd]) => qtd > 0)
			.map(([id, qtd]) => ({
				itemId: Number(id),
				quantidadeMedida: Number(qtd)
			}));

		if (itensFormatados.length === 0) {
			showAlert('erro', "Insira a quantidade em pelo menos um item.");
			return;
		}

		const ultrapassouSaldo = obra.itens?.some((item: any) => {
			const saldo = item.quantidade - (item.quantidadeAcumulada || 0);
			return (quantidades[item.id] || 0) > saldo;
		});

		if (ultrapassouSaldo) {
			showAlert('erro', "Um ou mais itens excedem o saldo disponível.");
			return;
		}

		setLoading(true);

		const payload = {
			orcamentoId: Number(obra.id),
			observacao: observacao || "",
			itens: itensFormatados
		};

		try {
			await api.post('api/medicoes', payload);
			showAlert('sucesso', `Medição #${proximoNumero} aberta com sucesso! Lembre-se de validá-la.`);

			setQuantidades({});
			setObservacao('');
			onSuccess();
			onClose();
		} catch (err: any) {
			showAlert('erro', err.response?.data?.mensagem || "Erro ao criar medição.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-gray-900">
			<div className="bg-white dark:bg-gray-800 w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

				{/* Header do Modal */}
				<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
							<HiHashtag className="text-blue-600 w-5 h-5" />
						</div>
						<div>
							<h3 className="text-xl font-bold dark:text-white">Gerar Nova Medição</h3>
							<p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{obra.numeroProtocolo}</p>
						</div>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-all">
						<HiX className="w-6 h-6" />
					</button>
				</div>

				{/* Corpo do Modal */}
				<form onSubmit={handleSalvarMedicao} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

					{/* Card Informativo com o Número da Medição */}
					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-5 rounded-2xl flex items-center gap-4">
						<div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">
							#{proximoNumero}
						</div>
						<div className="flex-1">
							<p className="text-sm text-blue-800 dark:text-blue-300 font-bold">Sequência de Medição Identificada</p>
							<p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-medium">
								Esta será a {proximoNumero}ª medição registrada para este orçamento.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Observações do Período</label>
							<textarea
								placeholder="Ex: Medição referente aos serviços executados na primeira quinzena..."
								className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none h-24"
								value={observacao}
								onChange={e => setObservacao(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex-1">
						<div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
							<HiCheckCircle className="text-green-500 w-5 h-5" />
							Itens do Orçamento
						</div>

						<div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
							<table className="w-full text-sm text-left border-collapse">
								<thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 border-b dark:border-gray-700 uppercase text-[10px] font-black">
									<tr>
										<th className="px-6 py-4">Descrição do Serviço</th>
										<th className="px-4 py-4 text-center">Total Orçado</th>
										<th className="px-4 py-4 text-center">Já Medido</th>
										<th className="px-4 py-4 text-center text-blue-600">A Medir Agora</th>
										<th className="px-6 py-4 text-right">Saldo Restante</th>
									</tr>
								</thead>
								<tbody className="divide-y dark:divide-gray-700">
									{obra.itens?.map((item: any) => {
										const saldo = item.quantidade - (item.quantidadeAcumulada || 0);
										const aMedir = quantidades[item.id] || 0;
										const ultrapassou = aMedir > saldo;

										return (
											<tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
												<td className="px-6 py-4">
													<span className="font-bold text-gray-800 dark:text-gray-200">{item.descricao}</span>
												</td>
												<td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400 font-medium">{item.quantidade}</td>
												<td className="px-4 py-4 text-center text-gray-500 font-medium">{item.quantidadeAcumulada || 0}</td>
												<td className="px-4 py-4 text-center">
													<input
														type="number"
														step="0.01"
														min="0"
														className={`w-28 p-3 text-center font-black border rounded-xl outline-none transition-all ${ultrapassou
															? 'border-red-500 bg-red-50 text-red-600 animate-pulse'
															: 'border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500'
															}`}
														placeholder="0,00"
														value={quantidades[item.id] || ''}
														onChange={e => handleInputChange(item.id, e.target.value)}
													/>
												</td>
												<td className={`px-6 py-4 text-right font-black ${(saldo - aMedir) <= 0 && aMedir > 0 ? 'text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
													{(saldo - aMedir).toFixed(2)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</form>

				<div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex justify-end items-center gap-4">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase text-xs tracking-widest"
					>
						Cancelar
					</button>
					<button
						onClick={handleSalvarMedicao}
						disabled={loading}
						className="flex items-center gap-2 px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
					>
						<HiSave className="w-5 h-5" />
						{loading ? "Processando..." : "Finalizar e Abrir Medição"}
					</button>
				</div>
			</div>
		</div>
	);
}
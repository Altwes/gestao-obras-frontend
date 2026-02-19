'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setOrcamentos } from '@/store/slices/dataSlice';
import { logout } from '@/store/slices/authSlice';
import { api } from '@/services/api';

import { HiLogout, HiPlus, HiPencil } from 'react-icons/hi';
import { ModalMedicao } from '@/components/ModalMedicao';
import { ModalNovoOrcamento } from '@/components/ModalNovoOrcamento';
import { ModalDetalhesOrcamento } from '@/components/ModalDetalhesOrcamento';
import { ModalListarMedicoes } from '@/components/ModalListarMedicoes';
import { ModalFeedback } from '@/components/ModalFeedback';
import { ModalConfirmacao } from '@/components/ModalConfirmacao';

export default function DashboardPage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const orcamentosRedux = useSelector((state: RootState) => state.data.orcamentos);
	const { user, token } = useSelector((state: RootState) => state.auth);

	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState({ open: false, tipo: 'sucesso' as 'sucesso' | 'erro', msg: '' });
	const [confirmacao, setConfirmacao] = useState({ open: false, titulo: '', msg: '', onConfirm: () => { } });

	// Estados de Modais
	const [obraParaMedir, setObraParaMedir] = useState<any>(null);
	const [isModalListaMedicoesOpen, setIsModalListaMedicoesOpen] = useState(false);
	const [obraSelecionada, setObraSelecionada] = useState<any>(null);
	const [obraParaEditar, setObraParaEditar] = useState<any>(null);
	const [isModalNovoOpen, setIsModalNovoOpen] = useState(false);

	const showAlert = (tipo: 'sucesso' | 'erro', msg: string) => {
		setFeedback({ open: true, tipo, msg });
	};

	const showConfirm = (titulo: string, msg: string, onConfirm: () => void) => {
		setConfirmacao({ open: true, titulo, msg, onConfirm });
	};

	async function fetchOrcamentos() {
		if (!token) {
			router.push('/');
			return;
		}
		try {
			setLoading(true);
			const response = await api.get('api/orcamentos');
			dispatch(setOrcamentos(Array.isArray(response.data?.dados) ? response.data.dados : []));
		} catch (err: any) {
			console.log("Modo offline: exibindo dados do cache local.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchOrcamentos();
	}, []);

	const handleLogout = () => {
		dispatch(logout());
		router.push('/');
	};

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative">
			{/* NAVBAR */}
			<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
					<div className="flex items-center gap-3">
						<div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl"><span className="text-2xl">🏗️</span></div>
						<div>
							<h1 className="text-xl font-extrabold text-blue-800 dark:text-blue-500 uppercase tracking-tighter leading-none text-nowrap">SOP-CE</h1>
							<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-nowrap">Gestão de Obras</span>
						</div>
					</div>

					{/* Exibe nome do fiscal mesmo offline */}
					<div className="hidden sm:flex flex-col items-end mr-4">
						<span className="text-xs font-bold dark:text-white uppercase">{user?.nome}</span>
						<span className="text-[8px] text-gray-400 uppercase tracking-widest">Fiscal de Obras</span>
					</div>

					<button onClick={handleLogout} className="p-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
						<HiLogout className="w-5 h-5" />
					</button>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Painel</h2>
						<p className="text-gray-600 dark:text-gray-400 text-sm">Monitoramento em tempo real</p>
					</div>
					<div className="grid grid-cols-1 sm:flex gap-2">
						<button onClick={() => setIsModalListaMedicoesOpen(true)} className="px-6 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:shadow-md transition-all">
							Medições
						</button>
						<button onClick={() => { setObraParaEditar(null); setIsModalNovoOpen(true); }} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-all">
							<HiPlus className="w-5 h-5" /> Novo Orçamento
						</button>
					</div>
				</div>

				{/* TABELA RESPONSIVA USANDO REDUX */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
						<table className="w-full text-left border-collapse min-w-[700px]">
							<thead>
								<tr className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
									<th className="px-6 py-4">Protocolo</th>
									<th className="px-6 py-4">Descrição</th>
									<th className="px-6 py-4">Valor</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4 text-center">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{loading && orcamentosRedux.length === 0 ? (
									<tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Buscando dados...</td></tr>
								) : orcamentosRedux.map((obra: any) => (
									<tr key={obra.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
										<td className="px-6 py-4 font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">{obra.numeroProtocolo}</td>
										<td className="px-6 py-4 text-gray-700 dark:text-gray-300 min-w-[200px]">{obra.tipoOrcamento}</td>
										<td className="px-6 py-4 dark:text-white font-bold whitespace-nowrap">
											{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obra.valorTotal)}
										</td>
										<td className="px-6 py-4">
											<span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 whitespace-nowrap ${obra.status === 'ABERTO'
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
												}`}>
												<div className={`w-1.5 h-1.5 rounded-full ${obra.status === 'ABERTO' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
												{obra.status}
											</span>
										</td>
										<td className="px-6 py-4 flex items-center justify-center gap-2">
											<button onClick={() => setObraSelecionada(obra)} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap">Ver Itens</button>
											{obra.status !== 'FINALIZADO' && (
												<>
													<button onClick={() => setObraParaMedir(obra)} className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg hover:bg-blue-700 hover:text-white transition-all whitespace-nowrap">Medir</button>
													<button onClick={() => { setObraParaEditar(obra); setIsModalNovoOpen(true); }} className="p-2 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"><HiPencil className="w-4 h-4" /></button>
												</>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<ModalFeedback isOpen={feedback.open} tipo={feedback.tipo} mensagem={feedback.msg} onClose={() => setFeedback({ ...feedback, open: false })} />
			<ModalConfirmacao isOpen={confirmacao.open} titulo={confirmacao.titulo} mensagem={confirmacao.msg} onConfirm={confirmacao.onConfirm} onClose={() => setConfirmacao({ ...confirmacao, open: false })} />
			<ModalDetalhesOrcamento obra={obraSelecionada} onClose={() => setObraSelecionada(null)} />
			<ModalNovoOrcamento isOpen={isModalNovoOpen} onClose={() => setIsModalNovoOpen(false)} onSuccess={fetchOrcamentos} obraParaEditar={obraParaEditar} showAlert={showAlert} showConfirm={showConfirm} />
			<ModalMedicao isOpen={!!obraParaMedir} onClose={() => setObraParaMedir(null)} onSuccess={fetchOrcamentos} obra={obraParaMedir} showAlert={showAlert} showConfirm={showConfirm} />
			<ModalListarMedicoes isOpen={isModalListaMedicoesOpen} onClose={() => setIsModalListaMedicoesOpen(false)} onSuccess={fetchOrcamentos} />
		</main>
	);
}
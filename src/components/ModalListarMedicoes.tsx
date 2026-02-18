'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import {
  HiX, HiCheck, HiClock, HiClipboardList,
  HiChevronDown, HiChevronUp, HiPencil, HiTrash, HiSave
} from 'react-icons/hi';
import { ModalFeedback } from './ModalFeedback';
import { ModalConfirmacao } from './ModalConfirmacao';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalListarMedicoes({ isOpen, onClose, onSuccess }: Props) {
  const [medicoes, setMedicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [itemSendoEditado, setItemSendoEditado] = useState<number | null>(null);
  const [novaQuantidade, setNovaQuantidade] = useState<number>(0);

  const [confirmacao, setConfirmacao] = useState({ open: false, id: 0 });
  const [feedback, setFeedback] = useState<{ open: boolean; tipo: 'sucesso' | 'erro'; msg: string }>({
    open: false, tipo: 'sucesso', msg: ''
  });

  async function fetchMedicoes() {
    try {
      setLoading(true);
      const response = await api.get('api/medicoes');
      setMedicoes(response.data?.dados || []);
    } catch (err) {
      console.error("Erro ao buscar medições:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) fetchMedicoes();
  }, [isOpen]);

  const handleSalvarEdicaoItem = async (itemMedicaoId: number) => {
    try {
      setLoading(true);
      await api.put(`api/itens-medicao/${itemMedicaoId}`, {
        quantidadeMedida: novaQuantidade
      });

      setFeedback({ open: true, tipo: 'sucesso', msg: 'Quantidade do item atualizada!' });
      setItemSendoEditado(null);
      await fetchMedicoes();
    } catch (err: any) {
      setFeedback({ open: true, tipo: 'erro', msg: err.response?.data?.mensagem || 'Erro ao atualizar item.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverItem = async (itemMedicaoId: number) => {
    try {
      setLoading(true);
      await api.delete(`api/itens-medicao/${itemMedicaoId}`);
      setFeedback({ open: true, tipo: 'sucesso', msg: 'Item removido da medição.' });
      await fetchMedicoes();
    } catch (err: any) {
      setFeedback({ open: true, tipo: 'erro', msg: 'Erro ao remover item.' });
    } finally {
      setLoading(false);
    }
  };

  const executarValidacao = async (id: number) => {
    try {
      setLoading(true);
      await api.patch(`api/medicoes/${id}/validar`);
      setFeedback({ open: true, tipo: 'sucesso', msg: 'Medição validada! Saldos atualizados.' });
      await fetchMedicoes();
      onSuccess();
    } catch (err: any) {
      setFeedback({ open: true, tipo: 'erro', msg: err.response?.data?.mensagem || 'Erro na validação.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 font-sans text-white">
        <div className="bg-[#1e293b] w-full max-w-6xl max-h-[92vh] rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-700 animate-in fade-in zoom-in duration-300">

          {/* Header Superior - Ajustado para telas pequenas */}
          <div className="p-4 sm:p-8 border-b border-gray-700 flex justify-between items-center bg-[#1e293b]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-600/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                <HiClipboardList className="text-blue-500 w-6 h-6 sm:w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight">Gerenciamento</h3>
                <span className="text-[8px] sm:text-[10px] font-black text-blue-500 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Validação de Planilhas</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 sm:p-3 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-all">
              <HiX className="w-6 h-6 sm:w-8 h-8" />
            </button>
          </div>

          {/* Área de Listagem com Rolagem Lateral */}
          <div className="p-2 sm:p-8 overflow-y-auto flex-1">
            <div className="rounded-xl sm:rounded-[2rem] border border-gray-700 bg-[#0f172a] overflow-hidden shadow-2xl">

              {/* WRAPPER DA TABELA PRINCIPAL */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-[#1e293b] border-b border-gray-700">
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocolo Vinculado</th>
                      <th className="px-4 py-5 text-[10px] font-black text-gray-500 uppercase text-center">Nº Medição</th>
                      <th className="px-4 py-5 text-[10px] font-black text-gray-500 uppercase text-center">Data</th>
                      <th className="px-4 py-5 text-[10px] font-black text-gray-500 uppercase">Valor Medido</th>
                      <th className="px-4 py-5 text-[10px] font-black text-gray-500 uppercase text-center">Status</th>
                      <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-gray-500 uppercase text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {medicoes.map((m) => (
                      <React.Fragment key={m.id}>
                        <tr
                          className={`transition-all cursor-pointer ${expandedId === m.id ? 'bg-blue-600/5' : 'hover:bg-gray-800/40'}`}
                          onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        >
                          <td className="px-8 py-6 font-bold text-blue-400 whitespace-nowrap">{m.orcamento?.numeroProtocolo}</td>
                          <td className="px-6 py-6 text-center font-black text-gray-400">#{m.numeroMedicao}</td>
                          <td className="px-6 py-6 text-center text-gray-500 whitespace-nowrap">{new Date(m.dataMedicao).toLocaleDateString()}</td>
                          <td className="px-6 py-6 font-black text-xl text-white whitespace-nowrap">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.valorMedicao)}
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center justify-center gap-2 ${m.status === 'VALIDADA' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                              }`}>
                              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${m.status === 'VALIDADA' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                              {m.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
                              {m.status === 'ABERTA' ? (
                                <button
                                  onClick={() => setConfirmacao({ open: true, id: m.id })}
                                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                >
                                  Validar
                                </button>
                              ) : (
                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-tighter italic">Processado</span>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* DETALHES EXPANDIDOS COM ROLAGEM PRÓPRIA */}
                        {expandedId === m.id && (
                          <tr className="bg-black/20">
                            <td colSpan={6} className="px-4 sm:px-12 py-4 sm:py-8 animate-in slide-in-from-top-4 duration-300">
                              <div className="bg-[#1e293b] rounded-xl sm:rounded-[1.5rem] border border-gray-700 shadow-3xl overflow-hidden">

                                {/* WRAPPER DA TABELA INTERNA (ITENS) */}
                                <div className="w-full overflow-x-auto">
                                  <table className="w-full text-xs min-w-[600px]">
                                    <thead className="bg-[#0f172a] text-gray-500 font-black uppercase text-[8px] tracking-widest">
                                      <tr>
                                        <th className="px-6 py-4 text-left">Descrição dos Itens</th>
                                        <th className="px-6 py-4 text-center">Quantidade</th>
                                        <th className="px-6 py-4 text-right">Valor Parcial</th>
                                        {m.status === 'ABERTA' && <th className="px-6 py-4 text-center">Gestão</th>}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                      {m.itensMedicao?.map((im: any) => (
                                        <tr key={im.id} className="hover:bg-gray-800/30 transition-colors">
                                          <td className="px-6 py-4 text-gray-300 font-medium">{im.item?.descricao}</td>
                                          <td className="px-6 py-4 text-center">
                                            {itemSendoEditado === im.id ? (
                                              <input
                                                type="number"
                                                autoFocus
                                                className="w-20 p-1 text-center bg-[#0f172a] border border-blue-500/50 rounded-lg font-black text-blue-400 outline-none"
                                                value={novaQuantidade}
                                                onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                                              />
                                            ) : (
                                              <span className="font-black text-white">{im.quantidadeMedida}</span>
                                            )}
                                          </td>
                                          <td className="px-6 py-4 text-right text-gray-400 font-bold whitespace-nowrap">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(im.valorTotalMedido)}
                                          </td>
                                          {m.status === 'ABERTA' && (
                                            <td className="px-6 py-4 text-center">
                                              <div className="flex items-center justify-center gap-3">
                                                {itemSendoEditado === im.id ? (
                                                  <button onClick={() => handleSalvarEdicaoItem(im.id)} className="text-green-500 hover:scale-125 transition-transform"><HiSave className="w-5 h-5" /></button>
                                                ) : (
                                                  <button onClick={() => { setItemSendoEditado(im.id); setNovaQuantidade(im.quantidadeMedida); }} className="text-blue-500 hover:text-white transition-colors"><HiPencil className="w-5 h-5" /></button>
                                                )}
                                                <button onClick={() => handleRemoverItem(im.id)} className="text-red-500/70 hover:text-red-500 transition-colors"><HiTrash className="w-5 h-5" /></button>
                                              </div>
                                            </td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer de Ação */}
          <div className="p-4 sm:p-8 border-t border-gray-700 bg-[#1e293b] flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gray-800 text-gray-400 font-black rounded-xl sm:rounded-2xl hover:bg-gray-700 transition-all text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border border-gray-700 shadow-xl"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      </div>

      <ModalFeedback
        isOpen={feedback.open} tipo={feedback.tipo} mensagem={feedback.msg}
        onClose={() => setFeedback({ ...feedback, open: false })}
      />

      <ModalConfirmacao
        isOpen={confirmacao.open} onClose={() => setConfirmacao({ open: false, id: 0 })}
        onConfirm={() => executarValidacao(confirmacao.id)}
        titulo="Validar Medição?"
        mensagem="Ao validar, os acumulados dos itens no orçamento serão atualizados permanentemente."
      />
    </>
  );
}
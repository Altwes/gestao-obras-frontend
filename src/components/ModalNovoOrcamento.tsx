'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { HiX, HiPlus, HiTrash, HiCheckCircle, HiSave } from 'react-icons/hi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  obraParaEditar?: any;
  // Props de perfumaria centralizadas no Dashboard
  showAlert: (tipo: 'sucesso' | 'erro', msg: string) => void;
  showConfirm: (titulo: string, msg: string, onConfirm: () => void) => void;
}

export function ModalNovoOrcamento({ isOpen, onClose, onSuccess, obraParaEditar, showAlert, showConfirm }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numeroProtocolo: '',
    tipoOrcamento: '',
    status: 'ABERTO',
    itens: [{ descricao: '', quantidade: 1, valorUnitario: 0 }]
  });

  useEffect(() => {
    if (obraParaEditar && isOpen) {
      setForm({
        numeroProtocolo: obraParaEditar.numeroProtocolo,
        tipoOrcamento: obraParaEditar.tipoOrcamento,
        status: obraParaEditar.status || 'ABERTO',
        itens: obraParaEditar.itens.map((i: any) => ({
          descricao: i.descricao,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario
        }))
      });
    } else {
      setForm({
        numeroProtocolo: '',
        tipoOrcamento: '',
        status: 'ABERTO',
        itens: [{ descricao: '', quantidade: 1, valorUnitario: 0 }]
      });
    }
  }, [obraParaEditar, isOpen]);

  const totalGlobal = useMemo(() => {
    return form.itens.reduce((acc, item) => acc + (Number(item.quantidade) * Number(item.valorUnitario) || 0), 0);
  }, [form.itens]);

  // Lógica de envio separada para ser chamada pelo Modal de Confirmação
  const executarSalvamento = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        valorTotal: totalGlobal,
        itens: form.itens.map(item => ({
          ...item,
          valorTotal: Number(item.quantidade) * Number(item.valorUnitario)
        }))
      };

      if (obraParaEditar) {
        await api.put(`api/orcamentos/${obraParaEditar.id}`, payload);
        showAlert('sucesso', "Orçamento atualizado com sucesso!");
      } else {
        await api.post('api/orcamentos', payload);
        showAlert('sucesso', "Novo orçamento registrado no sistema!");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      showAlert('erro', err.response?.data?.mensagem || "Erro ao processar. Verifique se o protocolo é único.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica de itens
    if (form.itens.some(i => i.descricao.trim() === '')) {
      showAlert('erro', "Todos os itens precisam de uma descrição.");
      return;
    }

    // Aciona o Modal de Confirmação customizado
    showConfirm(
      obraParaEditar ? "Confirmar Edição?" : "Confirmar Registro?",
      `Deseja salvar as informações do protocolo ${form.numeroProtocolo}?`,
      executarSalvamento
    );
  };

  const adicionarItem = () => setForm({ ...form, itens: [...form.itens, { descricao: '', quantidade: 1, valorUnitario: 0 }] });
  const removerItem = (index: number) => setForm({ ...form, itens: form.itens.filter((_, i) => i !== index) });

  const handleItemChange = (index: number, field: string, value: any) => {
    const novosItens = [...form.itens];
    novosItens[index] = { ...novosItens[index], [field]: value };
    setForm({ ...form, itens: novosItens });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

        {/* Header - Padrão SOP-CE */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30">
          <div>
            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tighter">
              {obraParaEditar ? `Editar Processo` : 'Novo Registro de Obra'}
            </h3>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Secretaria de Obras Públicas</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-all">
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="p-6 overflow-y-auto flex-1 space-y-6 text-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Status do Fluxo</label>
              <select
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="ABERTO">🟢 ABERTO</option>
                <option value="FINALIZADO">🔴 FINALIZADO</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nº do Protocolo</label>
              <input
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none font-mono focus:ring-2 focus:ring-blue-600"
                value={form.numeroProtocolo}
                onChange={e => setForm({ ...form, numeroProtocolo: e.target.value.replace(/[^\d./-]/g, '') })}
                required
                placeholder="00000.000/0000-00"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nome da Obra / Unidade</label>
              <input
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                value={form.tipoOrcamento}
                onChange={e => setForm({ ...form, tipoOrcamento: e.target.value })}
                required
                placeholder="Ex: Reforma Escola X"
              />
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold dark:text-gray-300 flex items-center gap-2 uppercase text-xs">
                <HiCheckCircle className="text-green-500" /> Planilha de Itens Orçados
              </h4>
              <button
                type="button"
                onClick={adicionarItem}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-blue-700 hover:text-white transition-all"
              >
                + Adicionar Item
              </button>
            </div>

            <div className="space-y-2">
              {form.itens.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl items-start md:items-center border border-transparent hover:border-gray-200 transition-all"
                >
                  {/* Descrição: Ocupa a largura toda no mobile (flex-1) */}
                  <div className="w-full flex-1">
                    <label className="block md:hidden text-[8px] font-black text-gray-400 uppercase mb-1">Descrição do Serviço</label>
                    <input
                      placeholder="Descrição do serviço..."
                      className="w-full p-3 md:p-2 rounded-lg border dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.descricao}
                      onChange={e => handleItemChange(index, 'descricao', e.target.value)}
                      required
                    />
                  </div>

                  {/* Container para os valores e lixeira: Fica embaixo da descrição no mobile */}
                  <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-start gap-4 md:gap-2">

                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Qtd</span>
                      <input
                        type="number"
                        className="w-16 p-2 rounded-lg border dark:bg-gray-800 dark:text-white text-sm text-center"
                        value={item.quantidade}
                        onChange={e => handleItemChange(index, 'quantidade', e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Unitário</span>
                      <input
                        type="number"
                        step="0.01"
                        className="w-24 p-2 rounded-lg border dark:bg-gray-800 dark:text-white text-sm text-right"
                        value={item.valorUnitario}
                        onChange={e => handleItemChange(index, 'valorUnitario', e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Subtotal</span>
                      <span className="font-black text-blue-800 dark:text-blue-400 text-xs whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.quantidade) * Number(item.valorUnitario))}
                      </span>
                    </div>

                    {/* Lixeira: Posicionada estrategicamente no canto no mobile */}
                    <button
                      type="button"
                      onClick={() => removerItem(index)}
                      className="p-3 md:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                      disabled={form.itens.length === 1}
                    >
                      <HiTrash className="w-6 h-6 md:w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t bg-gray-50 dark:bg-gray-700/30 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Investimento Global</span>
            <span className="text-xl font-black text-blue-800 dark:text-blue-400 tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGlobal)}
            </span>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 font-black text-gray-500 uppercase text-xs tracking-widest hover:text-gray-800">Cancelar</button>
            <button
              onClick={handleSalvar}
              className="flex items-center gap-2 px-10 py-4 bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-800 active:scale-95 transition-all uppercase text-xs tracking-widest"
            >
              <HiSave className="w-4 h-4" />
              {loading ? "Processando..." : obraParaEditar ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
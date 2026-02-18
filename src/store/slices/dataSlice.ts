import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: { 
    orcamentos: [] as any[], 
    filaMedicoesOffline: [] as any[] 
  },
  reducers: {
    setOrcamentos: (state, action: PayloadAction<any[]>) => {
      state.orcamentos = action.payload;
    },
    adicionarMedicaoFila: (state, action: PayloadAction<any>) => {
      state.filaMedicoesOffline.push({ ...action.payload, tempId: Date.now() });
    },
    removerMedicaoSincronizada: (state, action: PayloadAction<number>) => {
      state.filaMedicoesOffline = state.filaMedicoesOffline.filter(m => m.tempId !== action.payload);
    },
  },
});
export const { setOrcamentos, adicionarMedicaoFila, removerMedicaoSincronizada } = dataSlice.actions;
export default dataSlice.reducer;
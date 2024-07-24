import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DenunciaState {
  reportDenuncia: string[];
}

const initialState: DenunciaState = {
  reportDenuncia: []
};

const denunciaSlice = createSlice({
  name: 'denuncia',
  initialState,
  reducers: {
    addReportDenuncia(state, action: PayloadAction<string>) {
   
      if (!Array.isArray(state.reportDenuncia)) {
        state.reportDenuncia = [];
      }
      state.reportDenuncia.push(action.payload);
    },
  },
});

export const { addReportDenuncia } = denunciaSlice.actions;
export default denunciaSlice.reducer;


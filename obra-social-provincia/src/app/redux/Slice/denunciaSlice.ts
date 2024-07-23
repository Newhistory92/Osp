import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  reportDenuncia: [] as string[],
};

const denunciaSlice = createSlice({
  name: 'denuncia',
  initialState,
  reducers: {
    addReportDenuncia(state, action: PayloadAction<string>) {
      console.log('Estado antes del push:', state.reportDenuncia);
      if (Array.isArray(state.reportDenuncia)) {
        state.reportDenuncia.push(action.payload);
        console.log('denuncia id cargada dispatch:', action.payload);
      } else {
        console.error('reportDenuncia no es un array:', state.reportDenuncia);
      }
    },
  },
});

export const { addReportDenuncia } = denunciaSlice.actions;
export default denunciaSlice.reducer;

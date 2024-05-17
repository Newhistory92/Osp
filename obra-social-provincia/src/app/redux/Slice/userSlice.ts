import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserInfo, PartialUserInfo } from '@/app/interfaces/interfaces';

const initialState: UserState = {
  currentUser: null,
  loading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserInfo>) {
      state.currentUser = action.payload;
    },
    setPartialCurrentUser(state, action: PayloadAction<PartialUserInfo>) {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
        // Asegúrate de que las propiedades obligatorias están presentes
        operador: state.currentUser?.operador ?? '',
        email: state.currentUser?.email ?? '',
        checkedphone: state.currentUser?.checkedphone ?? false,
        phone: state.currentUser?.phone ?? '',
        imageUrl: state.currentUser?.imageUrl ?? '',
        role: state.currentUser?.role ?? '',
        address: state.currentUser?.address ?? '',
        prestador: state.currentUser?.prestador ?? '',
        tipo: state.currentUser?.tipo ?? '',
        descripcion: state.currentUser?.descripcion ?? '',
      };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export const { setCurrentUser, setPartialCurrentUser, setLoading, setErrorMessage } = userSlice.actions;

export default userSlice.reducer;

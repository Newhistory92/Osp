import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserInfo, PartialUserInfo } from '@/app/interfaces/interfaces';

const initialState: UserState = {
  currentUser: null,
  errorMessage: null,
  successMessage: null,
 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserInfo>) {
      // console.log("setCurrentUser action dispatched with payload:", action.payload);
      state.currentUser = action.payload;
    },
    setPartialCurrentUser(state, action: PayloadAction<PartialUserInfo>) {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
        email: state.currentUser?.email ?? '',
        checkedPhone: state.currentUser?.checkedPhone ?? false,
        phone:  action.payload.phone ?? state.currentUser?.phone ?? null,
        imageUrl: state.currentUser?.imageUrl ?? '',
        role: state.currentUser?.role ?? '',
        address: action.payload.address ?? state.currentUser?.address ?? null,
        prestador: state.currentUser?.prestador ?? '',
        tipo: action.payload.tipo ?? state.currentUser?.tipo ?? null,
        descripcion: state.currentUser?.descripcion ?? '',
        grupFamiliar: state.currentUser?.grupFamiliar ?? [],
        
      };
    },
    addGrupFamiliarMember(state, action: PayloadAction<string>) {
      if (state.currentUser) {
        if (!Array.isArray(state.currentUser.grupFamiliar)) {
          state.currentUser.grupFamiliar = [];
        }
        state.currentUser.grupFamiliar.push(action.payload);
      }
    },
    
    setErrorMessage(state, action: PayloadAction<string | null>) {
      // console.log("setErrorMessage action dispatched with payload:", action.payload);
      state.errorMessage = action.payload;
    },
    setSuccessMessage(state, action: PayloadAction<string | null>) {
      // console.log("setSuccessMessage action dispatched with payload:", action.payload);
      state.successMessage = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, setPartialCurrentUser, setErrorMessage, setSuccessMessage,  clearCurrentUser,addGrupFamiliarMember } = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  currentUser: UserInfo | null;
  loading: boolean;
  errorMessage: string | null;
}

export interface UserInfo {
  operador: any;
  splice(arg0: number[]): unknown;
  
  id: string;
  name: string;
  apellido?: string;
  email: string;
  checkedphone:boolean;
  phone: string;
  phoneopc?: string;
  imageUrl: string;
  matricula?: string;
  dni?: string;
  numeroOperador?: string;
  role: string;
  address: string;
  prestador:string
  especialidad?: string;
  especialidad2?:string;
  especialidad3?:string;
  dependencia?: string;
  tipo:string
  descripcion:string
}



const initialState: UserState = {
  currentUser: null,
  loading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserInfo | null>) {
      console.log("setCurrentUser action dispatched with payload:", action.payload);
      state.currentUser = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      console.log("setLoading action dispatched with payload:", action.payload);
      state.loading = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      console.log("setErrorMessage action dispatched with payload:", action.payload);
      state.errorMessage = action.payload;
    },
  },
});

export const { setCurrentUser, setLoading, setErrorMessage } = userSlice.actions;
export default userSlice.reducer;

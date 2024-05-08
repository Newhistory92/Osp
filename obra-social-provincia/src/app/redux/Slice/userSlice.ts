import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState,UserInfo } from '@/app/interfaces/interfaces';



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

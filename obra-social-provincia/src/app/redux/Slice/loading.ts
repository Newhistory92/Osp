import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState = {
  loading: false,

 
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
  
    setLoading(state, action: PayloadAction<boolean>) {
      // console.log("setLoading action dispatched with payload:", action.payload);
      state.loading = action.payload;
    },
   
  },
});

export const { setLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
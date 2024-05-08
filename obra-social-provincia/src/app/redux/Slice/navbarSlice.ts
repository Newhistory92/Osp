import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Publicacion,NavbarState } from '@/app/interfaces/interfaces';





const initialNavbarState: NavbarState = {
  showPrestadores: false,
  selectedContent: null, 
  showWelcome: false,
  publicaciones: [],
};


const navbarSlice = createSlice({
  name: 'navbar',
  initialState: initialNavbarState,
  reducers: {
    setShowPrestadores(state, action: PayloadAction<boolean>) {
      state.showPrestadores = action.payload;
      console.log('showPrestadores dispatch:', action.payload)
    },
    setSelectedContent(state, action: PayloadAction<string | null>) {
      state.selectedContent = action.payload; 
      console.log('selectedContent dispatch:', action.payload)
    },
    setShowWelcome(state, action: PayloadAction<boolean>) {
      state.showWelcome = action.payload;
      console.log('showWelcome dispatch:', action.payload)
    },
    setPublicaciones(state, action: PayloadAction<Publicacion[]>) { 
      state.publicaciones = action.payload;
      console.log('publicidad dispatch:', action.payload);
    },
  },
});

// Exporta los actions y el reducer para navbar
export const { setShowPrestadores, setSelectedContent, setShowWelcome,setPublicaciones} = navbarSlice.actions;
export default navbarSlice.reducer;
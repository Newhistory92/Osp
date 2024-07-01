
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NavbarStateVertical} from '@/app/interfaces/interfaces';

const initialState: NavbarStateVertical = {
    open: false,
    profileOpen: false,
    settingOpen:false,
    familyGroupOpen: false,
    ordenes: false,
    publicacionOpen: false,
    publicacionedit:false,
    denunciaOpen: false,
    notificadorOpen: false,
    auditorOpen: false,
    prestadoresOpen: false,
    internadosOpen:false,
    autorizacionesOpen:false,
    odontologicoOpen:false,
    bioquimicosOpen:false,
    facturacionOpen:false,
    dialisisOpen:false


  };

const navbarSlice = createSlice({
  name: 'navbarvertical',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction< keyof NavbarStateVertical>) {
      state[action.payload] = !state[action.payload];
     
    },
    closeAll: (state) => {
        Object.keys(state).forEach(key => {
          state[key as keyof NavbarStateVertical] = false;
        });
      },
    },
  });

export const { toggle, closeAll } = navbarSlice.actions;

export default navbarSlice.reducer;

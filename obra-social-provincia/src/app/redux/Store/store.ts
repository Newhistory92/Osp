import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../Slice/userSlice';
import navbarReducer from '../Slice/navbarSlice';
import navbarVerticalReducer from '../Slice/navbarVerticalSlice';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import loadingReducer from "../Slice/loading"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'




const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['navbar','navbarvertical,loading'],
};

const rootReducer = combineReducers({
  user: userReducer,
  navbar: navbarReducer,
  navbarvertical:navbarVerticalReducer,
  loading:loadingReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




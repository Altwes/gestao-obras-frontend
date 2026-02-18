import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';

const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null); },
  setItem(_key: any, value: any) { return Promise.resolve(value); },
  removeItem() { return Promise.resolve(); },
});

const storage = typeof window !== 'undefined'
  ? require('redux-persist/lib/storage').default
  : createNoopStorage();

const rootReducer = combineReducers({ auth: authReducer, data: dataReducer });

const persistConfig = {
  key: 'sop-ce-v2',
  storage,
  whitelist: ['auth', 'data'],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
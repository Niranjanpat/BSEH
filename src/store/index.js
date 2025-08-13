import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices/rootReducer';

export default function configureAppStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
}
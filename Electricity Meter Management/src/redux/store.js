import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import loginSlice from './slices/loginSlice';
import adminSlice from './slices/admin/adminSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import loginSlice

// Persist config for appSlice
const persistConfig = {
    key: "root",
    storage,
};

// Apply persist only to the appSlice (since you're using persistedReducer for appSlice)
const persistedAppReducer = persistReducer(persistConfig, appSlice);

export const store = configureStore({
    reducer: {
        app: persistedAppReducer, // Persisted app slice
        login: loginSlice,         // Regular login slice
        admin: adminSlice,         // Regular admin slice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import loginSlice from './slices/loginSlice';
import adminSlice from './slices/admin/adminSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
};

const persistedAppReducer = persistReducer(persistConfig, appSlice);

export const store = configureStore({
    reducer: {
        app: persistedAppReducer, 
        login: loginSlice,         
        admin: adminSlice,         
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

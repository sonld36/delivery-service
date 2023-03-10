import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toastReducer from "@Features/toast/toastSlice";
import userReducer from "@Features/user/userSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
  key: "root",
  storage: storage, //add file path node_modules in file tsconfig.ts
  blacklist: ["toast"],
};

export const rootReducers = combineReducers({
  toast: toastReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

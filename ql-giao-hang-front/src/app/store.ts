import orderReducer from "@Features/order/orderSlice";
import toastReducer from "@Features/toast/toastSlice";
import userReducer from "@Features/user/userSlice";
import logReducer from "@Features/log/logSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage: storage, //add file path node_modules in file tsconfig.ts
  blacklist: ["toast", "order", "log"],
};

export const rootReducers = combineReducers({
  toast: toastReducer,
  user: userReducer,
  order: orderReducer,
  log: logReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: thunk,
      },
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

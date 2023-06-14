import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import auth from "./reducer/auth";
import post from "./reducer/post";

//COMBINE ALL REDUCERS
const reducers = combineReducers({
  auth,
  post,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth", "post"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;

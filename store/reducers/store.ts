import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerReducer from "./auth/RegisterSlice";
import loginReducer from "./auth/LoginSlice";

const rootReducer = combineReducers({
  registerReducer,
  loginReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

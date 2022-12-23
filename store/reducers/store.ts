import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerReducer from "./auth/RegisterSlice";
import loginReducer from "./auth/LoginSlice";
import uploadImageReducer from "./item/UploadImageSlice";
import getCategoriesReducer from "./item/GetCategoriesSlice";
import getBrandsReducer from "./item/GetBrandsSlice";
import getStylesReducer from "./item/GetStylesSlice";
import getColoursReducer from "./item/GetColoursSlice";
import addItemReducer from "./item/AddItemSlice";
import getItemsReducer from "./item/GetItemsSlice";
import { createWrapper } from "next-redux-wrapper";
import getItemByIdReducer from "./item/GetItemByIdSlice";
import getUserByIdReducer from "./user/GetUserById";
import profileReducer from "./user/ProfileSlice";
import editProfileReducer from "./user/EditProfileSlice";

const rootReducer = combineReducers({
  registerReducer,
  loginReducer,
  uploadImageReducer,
  getCategoriesReducer,
  getBrandsReducer,
  getStylesReducer,
  getColoursReducer,
  addItemReducer,
  getItemsReducer,
  getUserByIdReducer,
  getItemByIdReducer,
  profileReducer,
  editProfileReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper(setupStore, { debug: true });

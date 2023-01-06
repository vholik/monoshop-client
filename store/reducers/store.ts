import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import registerReducer from "./auth/RegisterSlice";
import loginReducer from "./auth/LoginSlice";
import uploadImageReducer from "./item/UploadImageSlice";
import getCategoriesReducer from "./item/GetCategoriesSlice";
import getBrandsReducer from "./brand/GetBrandsSlice";
import getStylesReducer from "./style/GetStylesSlice";
import getColoursReducer from "./item/GetColoursSlice";
import addItemReducer from "./item/AddItemSlice";
import getItemsReducer from "./item/GetItemsSlice";
import getItemByIdReducer from "./item/GetItemByIdSlice";
import getUserByIdReducer from "./user/GetUserById";
import profileReducer from "./user/ProfileSlice";
import editProfileReducer from "./user/EditProfileSlice";
import filterReducer from "./filter/FilterSlice";
import getUserItemsReducer from "./item/GetUserItemsSlice";
import editItemReducer from "./item/EditItemSlice";
import getSubcategoriesReducer from "./item/GetSubcategoriesSlice";
import deleteItemReducer from "./item/DeleteItemSlice";
import checkIsFavoriteReducer from "./favorite/CheckIsFavoriteSlice";
import toggleFavoriteReducer from "./favorite/ToggleFavoriteSlice";
import getFavoriteReducer from "./favorite/GetFavoriteSlice";

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const combinedReducer = combineReducers({
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
  filterReducer,
  getUserItemsReducer,
  editItemReducer,
  deleteItemReducer,
  getSubcategoriesReducer,
  checkIsFavoriteReducer,
  toggleFavoriteReducer,
  getFavoriteReducer,
});

const reducer: typeof combinedReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

type Store = ReturnType<typeof makeStore>;

export const wrapper = createWrapper(makeStore, { debug: true });

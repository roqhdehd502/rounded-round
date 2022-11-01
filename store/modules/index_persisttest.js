import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

import counter from './counter';
import toast from './toast';
import userInfo from "./userInfo";


const persistConfig = {
    key: 'root',
    storage: storageSession,
    whitelist: ["userInfo"],
    //blacklist // 제외 할 데이터
};
 
export const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
      return {
          ...state,
          ...action.payload
      };
  }
  return combineReducers({
      counter,
      toast,
      userInfo,
  })(state, action);
}
 
export const persistedReducer = persistReducer(persistConfig, rootReducer);
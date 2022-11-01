import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

import counter from './counter';
import toast from './toast';
import userInfo from "./userInfo";

 
const reducer = (state, action) => {
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

export default reducer;
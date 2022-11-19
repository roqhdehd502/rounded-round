import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

import customerInfo from "./customerInfo";
import customerCommunitiesInfo from "./customerCommunitiesInfo";
import customerContentsInfo from "./customerContentsInfo";
import albumsInfo from "./albumsInfo";
import songsInfo from "./songsInfo";

 
const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload
        };
    }
    return combineReducers({
        customerInfo,
        customerCommunitiesInfo,
        customerContentsInfo,
        albumsInfo,
        songsInfo,
    })(state, action);
}


export default reducer;
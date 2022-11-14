import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

import Counter from './Counter';
import Toast from './Toast';
import UserInfo from "./UserInfo";
import UserCommunity from "./UserCommunity";
import userContents from "./UserContents";
import Album from "./Album";
import Song from "./Song";

 
const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload
        };
    }
    return combineReducers({
        Counter,
        Toast,
        UserInfo,
        UserCommunity,
        userContents,
        Album,
        Song,
    })(state, action);
}


export default reducer;
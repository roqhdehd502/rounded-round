import { createSlice } from '@reduxjs/toolkit';

import { getSong, getSongs } from '../../service';


const initialState = { 
    songObj: null,
    songs: [],

    loading: false,
    error: null,
};

const songsInfoSlice = createSlice({
    name: 'songsInfo',

    initialState,

    reducers: {
        getSongObj(state, action) {
            const res = getSong(action.payload);
            state.songObj = res ? res : null;
        },
        getSongs(state, action) {
            const res = getSongs()
            state.songs = res ? res : [];
        },
    },
});


export const { 
    songObj,
    songs,
} = songsInfoSlice.actions;


export default songsInfoSlice.reducer;
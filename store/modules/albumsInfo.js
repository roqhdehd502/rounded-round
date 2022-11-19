import { createSlice } from '@reduxjs/toolkit';

import { getAlbum, getAlbums, getSongsInAlbum } from '../../service';


const initialState = { 
    albumObj: null,
    albums: [],
    albumInSongs: [],

    loading: false,
    error: null,
};

const albumsInfoSlice = createSlice({
    name: 'albumsInfo',

    initialState,

    reducers: {
        getAlbumObj(state, action) {
            const res = getAlbum(action.payload);
            state.albumObj = res ? res : null;
        },
        getAlbums(state, action) {
            const res = getAlbums();
            state.albums = res ? res : [];
        },
        getAlbumInSongs(state, action) {
            const res = getSongsInAlbum(action.payload);
            state.albumInSongs = res ? res : [];
        },
    },
});


export const { 
    albumObj,
    albums,
    albumInSongs,
} = albumsInfoSlice.actions;


export default albumsInfoSlice.reducer;
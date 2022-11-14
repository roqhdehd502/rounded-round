import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAlbum, getAlbums, getSongsInAlbum } from '../../service';


const initialState = { 
    albumObj: null,
    albums: [],
    albumInSongs: [],

    loading: false,
    error: null,
};

export const getUserInfoObjThunk = createAsyncThunk(
    "Album/getUserInfoObjThunk",
    // async (uid, thunkAPI) => {
    //     try {
    //         const docRef = doc(firestore, "userInfo", uid);
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             return docSnap.data();
    //         } else {
    //             return null;
    //         }      
    //     } catch (error) {
    //         return thunkAPI.rejectWithValue(error);
    //     }
    // }
);


const AlbumSlice = createSlice({
    name: 'Album',

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

    extraReducers: {
        [getUserInfoObjThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getUserInfoObjThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userInfoObj = action.payload;
        },
        [getUserInfoObjThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },  
    },
});


export const { 
    albumObj,
    albums,
    albumInSongs,
} = AlbumSlice.actions;


export default AlbumSlice.reducer;
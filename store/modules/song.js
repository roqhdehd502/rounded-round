import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getSong, getSongs } from '../../service';


const initialState = { 
    songObj: null,
    songs: [],

    loading: false,
    error: null,
};

export const getUserInfoObjThunk = createAsyncThunk(
    "userInfo/getUserInfoObjThunk",
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


const songSlice = createSlice({
    name: 'song',

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
    songObj,
    songs,
} = songSlice.actions;


export default songSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { 
    getAuth,
    updateProfile,
} from "firebase/auth";

import { 
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    addDoc,
    //setDoc,
    updateDoc,
    deleteDoc, 
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';


const initialState = {
    userContent: null, 
    userContents: [],

    loading: false,
    error: null,
};


export const getUserContentThunk = createAsyncThunk(
    "UserContents/getUserContentThunk",
    async (uid, thunkAPI) => {
        try {
            const docRef = doc(firestore, "userContents", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }      
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getUserContentsThunk = createAsyncThunk(
    "UserContents/getUserContentsThunk",
    async (uid, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "userContents"),
            where("uid", "==", uid),
            orderBy("uploadDate", "desc")
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.docId = doc.id;
                datas.push(data);
            });
            return datas;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const createUserContentThunk = createAsyncThunk(
    "UserContents/createUserContentThunk",
    async (payload, thunkAPI) => {
        try {
            await addDoc(collection(firestore, "userContents"), payload)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const patchUserContentThunk = createAsyncThunk(
    "UserContents/patchUserContentThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "userContents", payload.docId);
        try {
            await updateDoc(docRef, {
                thumbnail: payload.thumbnail,
                contents: payload.contents,
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteUserContentThunk = createAsyncThunk(
  "UserContents/deleteUserContentThunk",
  async (payload, thunkAPI) => {
      const docRef = doc(firestore, "userContents", payload);
      try {
          await deleteDoc(docRef);
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);


const UserContentsSlice = createSlice({
    name: 'UserContents',

    initialState,

    reducers: {
        patchUserObj(state, action) { 
            updateProfile(getAuth().currentUser, {
                displayName: action.payload.updateUserObj.displayName,
                photoURL: action.payload.photoURL,
            }).then(() => {
                console.log("UPDATE SUCCESS!");
            }).catch((error) => {
                console.log(error);
            });
        },
    },

    extraReducers: {
        [getUserContentThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getUserContentThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunity = action.payload;
        },
        [getUserContentThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [getUserContentsThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getUserContentsThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunities = action.payload;
        },
        [getUserContentsThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [createUserContentThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [createUserContentThunk.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("CREATE SUCCESS.", action.payload);
        },
        [createUserContentThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [patchUserContentThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUserContentThunk.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [patchUserContentThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [deleteUserContentThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteUserContentThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunities = [];
        },
        [deleteUserContentThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
    },
});

export const { 
    patchUserObj,
} = UserContentsSlice.actions;

export default UserContentsSlice.reducer;
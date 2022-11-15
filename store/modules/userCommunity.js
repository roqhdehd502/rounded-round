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
    userCommunity: null, 
    userCommunities: [],

    loading: false,
    error: null,
};


export const getUserCommunityThunk = createAsyncThunk(
    "UserCommunity/getUserCommunityThunk",
    async (docId, thunkAPI) => {
        try {
            const docRef = doc(firestore, "userCommunity", docId);
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

export const getUserCommunitiesThunk = createAsyncThunk(
    "UserCommunity/getUserCommunitiesThunk",
    async (uid, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "userCommunity"),
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

export const createUserCommunityThunk = createAsyncThunk(
    "UserCommunity/createUserCommunityThunk",
    async (payload, thunkAPI) => {
        try {
            await addDoc(collection(firestore, "userCommunity"), payload)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const patchUserCommunityThunk = createAsyncThunk(
    "UserCommunity/patchUserCommunityThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "userCommunity", payload.docId);
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

export const deleteUserCommunityThunk = createAsyncThunk(
  "UserCommunity/deleteUserCommunityThunk",
  async (payload, thunkAPI) => {
      const docRef = doc(firestore, "userCommunity", payload);
      try {
          await deleteDoc(docRef);
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);


const UserCommunitySlice = createSlice({
    name: 'UserCommunity',

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
        [getUserCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getUserCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunity = action.payload;
        },
        [getUserCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [getUserCommunitiesThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getUserCommunitiesThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunities = action.payload;
        },
        [getUserCommunitiesThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [createUserCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [createUserCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("CREATE SUCCESS.", action.payload);
        },
        [createUserCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [patchUserCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUserCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [patchUserCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [deleteUserCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteUserCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.userCommunities = [];
        },
        [deleteUserCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
    },
});

export const { 
    patchUserObj,
} = UserCommunitySlice.actions;

export default UserCommunitySlice.reducer;
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
    updateDoc,
    deleteDoc, 
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';


const initialState = {
    customerCommunityObj: null, 
    customerCommunities: [],

    loading: false,
    error: null,
};


export const getCustomerCommunityThunk = createAsyncThunk(
    "customerCommunitiesInfo/getCustomerCommunityThunk",
    async (docId, thunkAPI) => {
        try {
            const docRef = doc(firestore, "customerCommunity", docId);
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

export const getCustomerCommunitiesThunk = createAsyncThunk(
    "customerCommunitiesInfo/getCustomerCommunitiesThunk",
    async (uid, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "customerCommunity"),
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

export const createCustomerCommunityThunk = createAsyncThunk(
    "customerCommunitiesInfo/createCustomerCommunityThunk",
    async (payload, thunkAPI) => {
        try {
            await addDoc(collection(firestore, "customerCommunity"), payload)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const patchCustomerCommunityThunk = createAsyncThunk(
    "customerCommunitiesInfo/patchCustomerCommunityThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "customerCommunity", payload.docId);
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

export const deleteCustomerCommunityThunk = createAsyncThunk(
  "customerCommunitiesInfo/deleteCustomerCommunityThunk",
  async (payload, thunkAPI) => {
      const docRef = doc(firestore, "customerCommunity", payload);
      try {
          await deleteDoc(docRef);
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);


const customerCommunitiesInfoSlice = createSlice({
    name: 'customerCommunitiesInfo',

    initialState,

    reducers: {
        patchCustomerObj(state, action) { 
            updateProfile(getAuth().currentUser, {
                displayName: action.payload.updateCustomerObj.displayName,
                photoURL: action.payload.customerPhotoURL,
            }).then(() => {
                console.log("UPDATE SUCCESS!");
            }).catch((error) => {
                console.log(error);
            });
        },
    },

    extraReducers: {
        [getCustomerCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getCustomerCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.customerCommunityObj = action.payload;
        },
        [getCustomerCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [getCustomerCommunitiesThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [getCustomerCommunitiesThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.customerCommunities = action.payload;
        },
        [getCustomerCommunitiesThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [createCustomerCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [createCustomerCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("CREATE SUCCESS.", action.payload);
        },
        [createCustomerCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [patchCustomerCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [patchCustomerCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [patchCustomerCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        [deleteCustomerCommunityThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteCustomerCommunityThunk.fulfilled]: (state, action) => {
            state.loading = false;
            state.customerCommunities = [];
        },
        [deleteCustomerCommunityThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
    },
});

export const { 
    patchCustomerObj,
} = customerCommunitiesInfoSlice.actions;

export default customerCommunitiesInfoSlice.reducer;
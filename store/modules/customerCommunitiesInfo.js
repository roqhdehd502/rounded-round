import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
            return docSnap.exists() ? docSnap.data() : null;     
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
              .then(async (docRef) => {
                  const docChildRef = doc(firestore, "customerCommunity", docRef.id);
                  const docSnap = await getDoc(docChildRef);
                  return docSnap.exists() ? docSnap.data() : null; 
              }).catch((error) => { 
                  console.log(error); 
              });
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
        dummyCustomerCommunityObj(state, action) { 
            console.log("dummy")
        },
    },

    extraReducers: (builder) => {
        builder
          .addCase(getCustomerCommunityThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerCommunityThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerCommunityObj = action.payload;
          })
          .addCase(getCustomerCommunityThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getCustomerCommunitiesThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerCommunitiesThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerCommunities = action.payload;
          })
          .addCase(getCustomerCommunitiesThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(createCustomerCommunityThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(createCustomerCommunityThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerCommunities.push(action.payload);
          })
          .addCase(createCustomerCommunityThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(patchCustomerCommunityThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(patchCustomerCommunityThunk.fulfilled, (state, action) => {
              state.loading = false;
          })
          .addCase(patchCustomerCommunityThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(deleteCustomerCommunityThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(deleteCustomerCommunityThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerCommunities = [];
          })
          .addCase(deleteCustomerCommunityThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })
    }, 
});

export const { 
    dummyCustomerCommunityObj,
} = customerCommunitiesInfoSlice.actions;

export default customerCommunitiesInfoSlice.reducer;
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
    deleteDoc, 
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';


const initialState = {
    customerSubscribeObj: null, 
    customerSubscribes: [],

    loading: false,
    error: null,
};


export const getCustomerSubscribeThunk = createAsyncThunk(
    "customerSubscribesInfo/getCustomerSubscribeThunk",
    async (uid, thunkAPI) => {
        try {
            const docRef = doc(firestore, "customerSubscribes", uid);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getCustomerSubscribesThunk = createAsyncThunk(
    "customerSubscribesInfo/getCustomerSubscribesThunk",
    async (payload, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "customerSubscribes"),
            where("subscriberUid", "==", payload.subscriberUid),
            where("subscribedUid", "==", payload.subscribedUid),
            orderBy("subscribeDate", "desc")
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

export const createCustomerSubscribeThunk = createAsyncThunk(
    "customerSubscribesInfo/createCustomerSubscribeThunk",
    async (payload, thunkAPI) => {
        try {
            payload.subscribeDate = Date.now();
            await addDoc(collection(firestore, "customerSubscribes"), payload)
              .then(async (docRef) => {
                  const docChildRef = doc(firestore, "customerSubscribes", docRef.id);
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

export const deleteCustomerSubscribeThunk = createAsyncThunk(
  "customerSubscribesInfo/deleteCustomerSubscribeThunk",
  async (payload, thunkAPI) => {
      const docRef = doc(firestore, "customerSubscribes", payload);
      try {
          await deleteDoc(docRef);
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);


const customerSubscribesInfoSlice = createSlice({
    name: 'customerSubscribesInfo',

    initialState,

    reducers: {
        dummyCustomerSubscribesObj(state, action) { 
            console.log("dummy")
        },
    },

    extraReducers: (builder) => {
        builder
          .addCase(getCustomerSubscribeThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerSubscribeThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerSubscribeObj = action.payload;
          })
          .addCase(getCustomerSubscribeThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getCustomerSubscribesThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerSubscribesThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerSubscribes = action.payload;
          })
          .addCase(getCustomerSubscribesThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(createCustomerSubscribeThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(createCustomerSubscribeThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerSubscribes.push(action.payload);
          })
          .addCase(createCustomerSubscribeThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(deleteCustomerSubscribeThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(deleteCustomerSubscribeThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerSubscribeObj = null;
              state.customerSubscribes = [];
          })
          .addCase(deleteCustomerSubscribeThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })
    },
});

export const { 
    dummyCustomerSubscribesObj,
} = customerSubscribesInfoSlice.actions;

export default customerSubscribesInfoSlice.reducer;
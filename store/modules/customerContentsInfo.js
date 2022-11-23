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
    customerContentObj: null, 
    customerContents: [],

    loading: false,
    error: null,
};


export const getCustomerContentThunk = createAsyncThunk(
    "customerContentsInfo/getCustomerContentThunk",
    async (uid, thunkAPI) => {
        try {
            const docRef = doc(firestore, "customerContents", uid);
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

export const getCustomerContentsThunk = createAsyncThunk(
    "customerContentsInfo/getCustomerContentsThunk",
    async (uid, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "customerContents"),
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

export const createCustomerContentThunk = createAsyncThunk(
    "customerContentsInfo/createCustomerContentThunk",
    async (payload, thunkAPI) => {
        try {
            await addDoc(collection(firestore, "customerContents"), payload)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const patchCustomerContentThunk = createAsyncThunk(
    "customerContentsInfo/patchCustomerContentThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "customerContents", payload.docId);
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

export const deleteCustomerContentThunk = createAsyncThunk(
  "customerContentsInfo/deleteCustomerContentThunk",
  async (payload, thunkAPI) => {
      const docRef = doc(firestore, "customerContents", payload);
      try {
          await deleteDoc(docRef);
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);


const customerContentsInfoSlice = createSlice({
    name: 'customerContentsInfo',

    initialState,

    reducers: {
        dummyCustomerContentsObj(state, action) { 
            console.log("dummy")
        },
    },

    extraReducers: (builder) => {
        builder
          .addCase(getCustomerContentThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerContentThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerContentObj = action.payload;
          })
          .addCase(getCustomerContentThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getCustomerContentsThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerContentsThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerContents = action.payload;
          })
          .addCase(getCustomerContentsThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(createCustomerContentThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(createCustomerContentThunk.fulfilled, (state, action) => {
              state.loading = false;
              console.log("CREATE SUCCESS.", action.payload);
          })
          .addCase(createCustomerContentThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(patchCustomerContentThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(patchCustomerContentThunk.fulfilled, (state, action) => {
              state.loading = false;
          })
          .addCase(patchCustomerContentThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(deleteCustomerContentThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(deleteCustomerContentThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerContents = [];
          })
          .addCase(deleteCustomerContentThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })
    },
});

export const { 
    dummyCustomerContentsObj,
} = customerContentsInfoSlice.actions;

export default customerContentsInfoSlice.reducer;
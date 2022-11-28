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
    cartObj: null,
    carts: [], 
    buyObj: null,
    buys: [], 
    buyHistoryObj: null,
    buyHistories: [],
    customerBuyHistories: [], 

    loading: false,
    error: null,
};


export const getBuyHistoryThunk = createAsyncThunk(
    "purchaseInfoSlice/getBuyHistoryThunk",
    async (docId, thunkAPI) => {
        try {
            const docRef = doc(firestore, "buyHistory", docId);
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

export const getBuyHistoriesThunk = createAsyncThunk(
    "purchaseInfoSlice/getBuyHistoriesThunk",
    async (payId, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "buyHistory"),
            where("payId", "==", payId),
            orderBy("payDate", "desc")
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

export const getCustomerBuyHistoriesThunk = createAsyncThunk(
    "purchaseInfoSlice/getCustomerBuyHistoriesThunk",
    async (uid, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "buyHistory"),
            where("uid", "==", uid),
            orderBy("payDate", "desc")
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

export const createBuyHistoryThunk = createAsyncThunk(
    "purchaseInfoSlice/createBuyHistoryThunk",
    async (payload, thunkAPI) => {
        try {
            await addDoc(collection(firestore, "buyHistory"), payload)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteBuyHistoryThunk = createAsyncThunk(
    "purchaseInfoSlice/deleteBuyHistoryThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "buyHistory", payload);
        try {
            await deleteDoc(docRef);
            return payload;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const purchaseInfoSlice = createSlice({
    name: 'purchaseInfoSlice',

    initialState,

    reducers: {
        dummyPurchaseInfoObj(state, action) { 
            console.log("dummy")
        },
    },

    extraReducers: (builder) => {
        builder
          .addCase(getBuyHistoryThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getBuyHistoryThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.buyHistoryObj = action.payload;
          })
          .addCase(getBuyHistoryThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getBuyHistoriesThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getBuyHistoriesThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.buyHistories = action.payload;
          })
          .addCase(getBuyHistoriesThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getCustomerBuyHistoriesThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerBuyHistoriesThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerBuyHistories = action.payload;
          })
          .addCase(getCustomerBuyHistoriesThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(createBuyHistoryThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(createBuyHistoryThunk.fulfilled, (state, action) => {
              state.loading = false;
              console.log("CREATE SUCCESS.", action.payload);
          })
          .addCase(createBuyHistoryThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(deleteBuyHistoryThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(deleteBuyHistoryThunk.fulfilled, (state, action) => {
              state.loading = false;
              for(let i = 0; i<state.customerBuyHistories.length; i++){ 
                  if (state.customerBuyHistories[i].docId === action.payload) { 
                      state.customerBuyHistories.splice(i, 1); 
                      i--; 
                  }
              }
          })
          .addCase(deleteBuyHistoryThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })
    }, 
});

export const { 
    dummyPurchaseInfoObj,
} = purchaseInfoSlice.actions;

export default purchaseInfoSlice.reducer;
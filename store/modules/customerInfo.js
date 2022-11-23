import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    deleteUser,
} from "firebase/auth";

import { 
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    setDoc,
    updateDoc, 
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';


const initialState = { 
    customerObj: null,
    customerInfoObj: null,
    isDuplicatedEmailResult: null,
    loginAccess: false,

    loading: false,
    error: null,
};

export const checkDuplicatedEmailThunk = createAsyncThunk(
    "customerInfo/checkDuplicatedEmailThunk",
    async (confirmEmailAddress, thunkAPI) => {
        let datas = [];
        let q = query(
            collection(firestore, "customerInfo"),
            where("customerEmail", "==", confirmEmailAddress),
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.docId = doc.id;
                datas.push(data);
            });
            return datas.length;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const createCustomerObjThunk = createAsyncThunk(
    "customerInfo/createCustomerObjThunk",
    async (customerObj, thunkAPI) => {
        try {
            await setDoc(doc(firestore, "customerInfo", customerObj.uid), customerObj)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getCustomerInfoObjThunk = createAsyncThunk(
    "customerInfo/getCustomerInfoObjThunk",
    async (uid, thunkAPI) => {
        try {
            const docRef = doc(firestore, "customerInfo", uid);
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

export const patchCustomerInfoObjThunk = createAsyncThunk(
    "customerInfo/patchCustomerInfoObjThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "customerInfo", payload.uid);
        try {
            await updateDoc(docRef, {
                displayName: payload.updateCustomerObj.displayName,
                photoURL: payload.photoURL,
                bio: payload.updateCustomerObj.bio,
                infoDetail: payload.updateCustomerObj.infoDetail,
                link: payload.updateCustomerObj.link,
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const customerInfoSlice = createSlice({
    name: 'customerInfo',

    initialState,

    reducers: {
        getCustomerObj(state, action) {
            state.customerObj = action.payload ? action.payload : null;
            state.loginAccess = state.customerObj ? true : false;
        },
        emailLogin(state, action) {
            action.customerObj = action.payload;
            state.loginAccess = true;
            console.log("LOGIN SUCCESS.");
        },
        googleLogin(state, action) {
            action.customerObj = action.payload;
            state.loginAccess = true;
            console.log("GOOGLE LOGIN SUCCESS.");
        },
        logout(state) {
            signOut(getAuth())
              .then(() => { console.log("LOGOUT SUCCESS."); })
              .catch((error) => { console.log("LOGOUT FAILED!", error); });
            state.customerObj = null;
            state.loginAccess = false;   
        },
        signUp(state, action) {
            createUserWithEmailAndPassword(getAuth(), action.payload.customerEmail, action.payload.customerPassword)
              .then(() => { console.log("SIGN UP SUCCESS.") })
              .catch((error) => { console.log("SIGN UP FAILED!", error) });
            state.customerObj = null;
        },
        patchCustomerObj(state, action) { 
            updateProfile(getAuth().currentUser, {
                displayName: action.payload.updateCustomerObj.displayName,
                photoURL: action.payload.photoURL,
            }).then((result) => {
                console.log("UPDATE SUCCESS!", result);
            }).catch((error) => {
                console.log(error);
            });
        },
        patchCustomerPassword(state, action) {
            getAuth().languageCode = 'ko';
            sendPasswordResetEmail(getAuth(), action.payload)
              .then(() => { console.log("UPDATE CUSTOMER PASSWORD SEND SUCCESS.") })
              .catch((err) => { console.log("UPDATE CUSTOMER PASSWORD SEND FAILD.", err) });
        },      
        sendCustomerEmailVerification(state) {
            getAuth().languageCode = 'ko';
            sendEmailVerification(getAuth().currentUser)
              .then(() => { console.log("EMAIL VERIFICATION SEND SUCCESS.") })
              .catch(() => { console.log("EMAIL VERIFICATION SEND FAILD.") });
        },
        removeCustomerInfo(state) {
            deleteUser(getAuth().currentUser)
              .then(() => { console.log("DELETE CUSTOMER SUCCESS.") })
              .catch(() => { console.log("DELETE CUSTOMER FAILED!") });
        },
    },

    extraReducers: (builder) => {
        builder
          .addCase(checkDuplicatedEmailThunk.pending, (state, action) => {
              state.loading = true;
              console.log("SEARCH...", action.payload);
          })
          .addCase(checkDuplicatedEmailThunk.fulfilled, (state, action) => {
              state.loading = false;
              if (action.payload >= 1) {
                  state.isDuplicatedEmailResult = 'Y';
              } else {
                  state.isDuplicatedEmailResult = 'N';
              }
          })
          .addCase(checkDuplicatedEmailThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(createCustomerObjThunk.pending, (state, action) => {
              state.loading = true;
              console.log("SIGN UP...", action.payload);
          })
          .addCase(createCustomerObjThunk.fulfilled, (state, action) => {
              state.loading = false;
              console.log("SIGN UP SUCCESS.", action.payload);
          })
          .addCase(createCustomerObjThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(getCustomerInfoObjThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(getCustomerInfoObjThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerInfoObj = action.payload;
          })
          .addCase(getCustomerInfoObjThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })

          .addCase(patchCustomerInfoObjThunk.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(patchCustomerInfoObjThunk.fulfilled, (state, action) => {
              state.loading = false;
              state.customerObj = null;
              state.customerInfoObj = null;
          })
          .addCase(patchCustomerInfoObjThunk.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error;
          })
    },
});

export const { 
    getCustomerObj,
    emailLogin,
    googleLogin,
    logout,
    signUp,
    patchCustomerObj,
    patchCustomerPassword,
    sendCustomerEmailVerification,
    removeCustomerInfo,
} = customerInfoSlice.actions;

export default customerInfoSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { 
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    getRedirectResult,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    deleteUser,
} from "firebase/auth";

import { 
    collection,
    getDocs,
    query,
    where,
    addDoc,
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';

import * as firebaseStorage from "firebase/storage";


const initialState = { 
    userObj: null,
    isDuplicatedUserEmailResult: null,
    loginAccess: false,
    loading: false,
    error: null,
};

export const checkDuplicatedEmailThunk = createAsyncThunk(
    "userInfo/checkDuplicatedEmailThunk",
    async (confirmEmailAddress, thunkAPI) => {
        let users = [];
        let q = query(
            collection(firestore, "userInfo"),
            where("userEmail", "==", confirmEmailAddress),
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.docId = doc.id;
                users.push(data);
            });
            return users.length;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const createUserEmailThunk = createAsyncThunk(
  "userInfo/createUserEmailThunk",
  async (userEmail, thunkAPI) => {
      try {
          await addDoc(collection(firestore, "userInfo"), userEmail)
            .then(res => { return res; })
            .catch(error => console.log(error));
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);

const userInfoSlice = createSlice({
    name: 'userInfo',

    initialState,

    reducers: {
        getUserObj(state, action) {
            state.userObj = action.payload ? action.payload : null;
            state.loginAccess = state.userObj ? true : false;
            console.log("UserObj", state.userObj, state.loginAccess);
        },
        userLogin(state, action) {
            action.userObj = action.payload;
            state.loginAccess = true;
            console.log("LOGIN SUCCESS.");
        },
        userGoogleLogin(state, action) {
            action.userObj = action.payload;
            state.loginAccess = true;
            console.log("GOOGLE LOGIN SUCCESS.");
        },
        userLogout(state) {
            signOut(getAuth())
              .then(() => { console.log("LOGOUT SUCCESS."); })
              .catch((error) => { console.log("LOGOUT FAILED!", error); });
            state.userObj = null;
            state.loginAccess = false;   
        },
        userSignUp(state, action) {
            createUserWithEmailAndPassword(getAuth(), action.payload.userEmail, action.payload.userPassword)
              .then(() => { console.log("SIGN UP SUCCESS.") })
              .catch((error) => { console.log("SIGN UP FAILED!", error) });
            state.userObj = null;
        },
        patchUserObj(state, action) { 
            const storage = firebaseStorage.getStorage();
            const storageRef = firebaseStorage.ref(storage, `userimages/${userObj.uid}`);
            const imageFile = action.payload.imageFile
            let imageURL = null;

            if (imageFile !== undefined) {
                firebaseStorage.uploadBytes(storageRef, imageFile)
                .then((snapshot) => {
                    console.log("upload image: ", snapshot);
                    firebaseStorage.getDownloadURL(storageRef);
                });
            }

            updateProfile(getAuth().currentUser, {
                displayName: action.payload.userObj.displayName,
                photoURL: imageURL === undefined ? action.payload.userObj.photoURL : imageURL
            });
        },
        putUserPassword(state, action) {
            getAuth().languageCode = 'ko';
            sendPasswordResetEmail(getAuth(), action.payload)
              .then(() => { console.log("UPDATE USER PASSWORD SEND SUCCESS.") })
              .catch((err) => { console.log("UPDATE USER PASSWORD SEND FAILD.", err) });
        },      
        sendUserEmailVerification(state) {
            getAuth().languageCode = 'ko';
            sendEmailVerification(getAuth().currentUser)
              .then(() => { console.log("EMAIL VERIFICATION SEND SUCCESS.") })
              .catch(() => { console.log("EMAIL VERIFICATION SEND FAILD.") });
        },
        removeUserInfo(state) {
            deleteUser(getAuth().currentUser)
              .then(() => { console.log("DELETE USER SUCCESS.") })
              .catch(() => { console.log("DELETE USER FAILED!") });
        },
    },

    extraReducers: {
        [checkDuplicatedEmailThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [checkDuplicatedEmailThunk.fulfilled]: (state, action) => {
            state.loading = false;
            if (action.payload >= 1) {
                state.isDuplicatedUserEmailResult = 'Y';
            } else {
                state.isDuplicatedUserEmailResult = 'N';
            }
        },
        [checkDuplicatedEmailThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [createUserEmailThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [createUserEmailThunk.fulfilled]: (state, action) => {
            console.log("users email : ", action.payload);
            state.loading = false;
        },
        [createUserEmailThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
    },
});

export const { 
    getUserObj,
    userLogin,
    userGoogleLogin,
    userLogout,
    userSignUp,
    patchUserObj,
    patchUserPassword,
    sendUserEmailVerification,
    removeUserInfo,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
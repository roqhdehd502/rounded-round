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
    addDoc,
    setDoc,
    updateDoc, 
} from "firebase/firestore";

import { firestore } from '../../firebaseConfiguration';

import * as firebaseStorage from "firebase/storage";


const initialState = { 
    userObj: null,
    userInfoObj: null,
    isDuplicatedUserEmailResult: null,
    loginAccess: false,

    userContents: null,
    userCommunity: null,

    loading: false,
    error: null,
};

export const checkDuplicatedEmailThunk = createAsyncThunk(
    "UserInfo/checkDuplicatedEmailThunk",
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

export const createUserObjThunk = createAsyncThunk(
    "UserInfo/createUserObjThunk",
    async (userObj, thunkAPI) => {
        try {
            await setDoc(doc(firestore, "userInfo", userObj.uid), userObj)
              .then((docRef) => { return docRef })
              .catch((error) => { console.log(error) });
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getUserInfoObjThunk = createAsyncThunk(
    "UserInfo/getUserInfoObjThunk",
    async (uid, thunkAPI) => {
        try {
            const docRef = doc(firestore, "userInfo", uid);
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

export const patchUserInfoObjThunk = createAsyncThunk(
    "UserInfo/patchUserInfoObjThunk",
    async (payload, thunkAPI) => {
        const docRef = doc(firestore, "userInfo", payload.uid);
        console.log("payload.userPhotoURL", payload.userPhotoURL);
        try {
            await updateDoc(docRef, {
                displayName: payload.updateUserObj.displayName,
                photoURL: payload.userPhotoURL,
                bio: payload.updateUserObj.bio,
                infoDetail: payload.updateUserObj.infoDetail,
                link: payload.updateUserObj.link,
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const UserInfoSlice = createSlice({
    name: 'UserInfo',

    initialState,

    reducers: {
        getUserObj(state, action) {
            state.userObj = action.payload ? action.payload : null;
            state.loginAccess = state.userObj ? true : false;
        },
        emailLogin(state, action) {
            action.userObj = action.payload;
            state.loginAccess = true;
            console.log("LOGIN SUCCESS.");
        },
        googleLogin(state, action) {
            action.userObj = action.payload;
            state.loginAccess = true;
            console.log("GOOGLE LOGIN SUCCESS.");
        },
        logout(state) {
            signOut(getAuth())
              .then(() => { console.log("LOGOUT SUCCESS."); })
              .catch((error) => { console.log("LOGOUT FAILED!", error); });
            state.userObj = null;
            state.loginAccess = false;   
        },
        signUp(state, action) {
            createUserWithEmailAndPassword(getAuth(), action.payload.userEmail, action.payload.userPassword)
              .then(() => { console.log("SIGN UP SUCCESS.") })
              .catch((error) => { console.log("SIGN UP FAILED!", error) });
            state.userObj = null;
        },
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
        patchUserPassword(state, action) {
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
            console.log("SEARCH...", action.payload);
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

        [createUserObjThunk.pending]: (state, action) => {
            state.loading = true;
            console.log("SIGN UP...", action.payload);
        },
        [createUserObjThunk.fulfilled]: (state, action) => {
            state.loading = false;
            console.log("SIGN UP SUCCESS.", action.payload);
        },
        [createUserObjThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
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
        [patchUserInfoObjThunk.pending]: (state, action) => {
            state.loading = true;
        },
        [patchUserInfoObjThunk.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [patchUserInfoObjThunk.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },   
    },
});

export const { 
    getUserObj,
    emailLogin,
    googleLogin,
    logout,
    signUp,
    patchUserObj,
    patchUserPassword,
    sendUserEmailVerification,
    removeUserInfo,
} = UserInfoSlice.actions;

export default UserInfoSlice.reducer;
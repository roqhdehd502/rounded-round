import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import * as userInfoActions from '../../store/modules/userInfo';
import { checkDuplicatedEmailThunk, createUserObjThunk } from '../../store/modules/userInfo';


signIn.layout = "L2";
export default function signIn() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = getAuth();

    const isDuplicatedUserEmailResult = useSelector(({ userInfo }) => userInfo.loading);

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        console.log("유저정보 제대로 오나...", userObj);
        if (isDuplicatedUserEmailResult) createGoogleNewUserObj(isDuplicatedUserEmailResult, userObj);
    }, [isDuplicatedUserEmailResult]);    

    const emailLogin = useCallback((payload) => {
        if(!payload.userEmail || !payload.userPassword) {
            alert('올바른 계정이 아닙니다.');
            return;
        } 

        signInWithEmailAndPassword(auth, payload.userEmail, payload.userPassword)
          .then((result) => {
              const payload = result.user;
              dispatch(userInfoActions.userLogin(payload));
              router.replace('/');
          })
          .catch((error) => { 
              console.log("LOGIN FAILED!", error);
          });
    }, [dispatch]);

    const googleLogin = useCallback(() => {
        const provider = new GoogleAuthProvider();
        auth.languageCode = 'ko';
        signInWithPopup(auth, provider)
          .then((payload) => { 
              setUserObj(payload.user);
              dispatch(userInfoActions.userGoogleLogin(payload.user));
              dispatch(checkDuplicatedEmailThunk(payload.user.uid));
          })
          .catch((error) => { 
              console.log("GOOGLE LOGIN FAILED!", error); 
          });
    }, [dispatch]);

    const createGoogleNewUserObj = useCallback((emailExist, userInfo) => {
        switch(emailExist) {
            case 'Y':
                console.log("이미 있지롱", emailExist);
                break;
            case 'N':
                console.log("있지롱", emailExist);
                const user = {
                    displayName: userInfo.displayName,
                    userEmail: userInfo.email,
                    photoURL: userInfo.photoURL,
                    uid: userInfo.uid,
                    createdAt: Date.now(),
                    subscribes: 0,
                    bio: '',
                    infoDetail: '',
                    link: [],
                    enabled: true,
                }
                dispatch(createUserObjThunk(user));
                break;
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-30rem">
                    <h1 className="flex justify-content-center">로그인</h1>
                    <div className="field p-fluid mt-6">
                        <span className="p-float-label">
                            <InputText id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            <label htmlFor="userEmail">이메일</label>
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <span className="p-float-label">
                            <Password id="userPassword" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} feedback={false} toggleMask />
                            <label htmlFor="userPassword">비밀번호</label>
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="이메일 로그인" icon="pi pi-sign-in" className="pr-5" onClick={() => emailLogin({userEmail, userPassword})} />
                    </div>
                    <div className="field p-fluid">
                        <Button label="구글 로그인" icon="pi pi-google" className="pr-5" onClick={() => googleLogin()} />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/auth/signUp">
                            <Button label="회원가입" icon="pi pi-user-plus" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href="/auth/findPassword">
                            <Button label="비밀번호 찾기" icon="pi pi-search" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/">
                            <Button label="메인으로" icon="pi pi-home" className="p-button-info pr-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
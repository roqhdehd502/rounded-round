import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import * as customerInfoActions from '../../store/modules/customerInfo';
import { createCustomerObjThunk } from '../../store/modules/customerInfo';


signIn.layout = "L2";
export default function signIn() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = getAuth();

    const toast = useRef(null);

    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPassword, setCustomerPassword] = useState('');

    const emailLogin = useCallback((payload) => {
        if (!payload.customerEmail || !payload.customerPassword) {
            toast.current.show({
                severity: 'error', 
                summary: '올바른 계정이 아닙니다!', 
                detail: '이메일 혹은 비밀번호를 확인해주세요.', 
                life: 3000
            });
            return;
        } 

        signInWithEmailAndPassword(auth, payload.customerEmail, payload.customerPassword)
          .then((result) => {
              const payload = result.user;
              dispatch(customerInfoActions.emailLogin(payload));
              router.replace(`/`);
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
              let isLoginAccress = false; 
              if (payload.user.metadata.createdAt === payload.user.metadata.lastLoginAt) {
                  dispatch(customerInfoActions.googleLogin(payload.user));
                  createGoogleNewCustomerObj(payload.user);
                  isLoginAccress = true;
              } else {
                  dispatch(customerInfoActions.googleLogin(payload.user));
                  isLoginAccress = true;
              }
          })
          .catch((error) => { 
              console.log("GOOGLE LOGIN FAILED!", error); 
          });
    }, [dispatch]);

    const createGoogleNewCustomerObj = useCallback((customerInfoObj) => {
        const customer = {
            displayName: customerInfoObj.displayName,
            customerEmail: customerInfoObj.email,
            photoURL: customerInfoObj.photoURL,
            uid: customerInfoObj.uid,
            createdAt: Date.now(),
            subscribes: 0,
            bio: '',
            infoDetail: '',
            link: { linkName: '', linkAddress: '' },
            enabled: true,
        }
        dispatch(createCustomerObjThunk(customer));
    }, [dispatch]);

    return (
        <>
            <Toast ref={toast} />

            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-30rem">
                    <h1 className="flex justify-content-center">로그인</h1>
                    <div className="field p-fluid mt-6">
                        <span className="p-float-label">
                            <InputText id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                            <label htmlFor="customerEmail">이메일</label>
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <span className="p-float-label">
                            <Password id="customerPassword" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} feedback={false} toggleMask />
                            <label htmlFor="customerPassword">비밀번호</label>
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="이메일 로그인" icon="pi pi-sign-in" className="pr-5" onClick={() => emailLogin({customerEmail, customerPassword})} />
                    </div>
                    <div className="field p-fluid">
                        <Button label="구글 로그인" icon="pi pi-google" className="pr-5" onClick={() => googleLogin()} />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href={`/auth/signUp`}>
                            <Button label="회원가입" icon="pi pi-user-plus" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href={`/auth/findPassword`}>
                            <Button label="비밀번호 찾기" icon="pi pi-search" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href={`/`}>
                            <Button label="메인으로" icon="pi pi-home" className="p-button-info pr-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
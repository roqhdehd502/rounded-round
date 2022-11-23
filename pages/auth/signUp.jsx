import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { checkDuplicatedEmailThunk, createCustomerObjThunk } from '../../store/modules/customerInfo';


signUp.layout = "L2";
export default function signUp() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = getAuth();

    const isDuplicatedEmailResult = useSelector(({ customerInfo }) => customerInfo.isDuplicatedEmailResult);
    const duplicatedCheckLoading = useSelector(({ customerInfo }) => customerInfo.loading);

    const toast = useRef(null);

    const [customerId, setCustomerId] = useState('');
    const [customerEmailAddress, setCustomerEmailAddress] = useState('');
    const [customerPassword, setCustomerPassword] = useState('');
    const [customerPasswordCheck, setCustomerPasswordCheck] = useState('');

    const [isCustomerEmailInputDisabled, setIsCustomerEmailInputDisabled] = useState(false);
    const [invalidCustomerEmail, setInvalidCustomerEmail] = useState('');
    const [invalidCustomerPassword, setInvalidCustomerPassword] = useState('');
    
    const [isCorrectEmail, setIsCorrectEmail] = useState(false);
    const [isCorrectPassword, setIsCorrectPassword] = useState(false);

    useEffect(() => {
        switch(isDuplicatedEmailResult) {
            case 'Y':
                setInvalidCustomerEmail('p-invaild');
                setIsCustomerEmailInputDisabled(false);
                setIsCorrectEmail(false);
                toast.current.show({
                  severity: 'warn', 
                  summary: '이메일 중복!', 
                  detail: '이미 등록된 이메일입니다.', 
                  life: 3000
                });
                break;
            case 'N':
                setInvalidCustomerEmail('');
                setIsCustomerEmailInputDisabled(true);
                setIsCorrectEmail(true);
                toast.current.show({
                  severity: 'success', 
                  summary: '이메일 사용가능.', 
                  detail: '사용하실 수 있는 이메일입니다.', 
                  life: 3000
                });
        }
    }, [isDuplicatedEmailResult]);

    const onCheckDuplicatedEmail = useCallback(async (id, emailAddress) => {
        if(id !== '' || emailAddress !== '') {
            const confirmEmailAddress = `${id}@${emailAddress}`;
            try {
                await dispatch(checkDuplicatedEmailThunk(confirmEmailAddress));
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({
              severity: 'error', 
              summary: '이메일 중복 확인 실패!', 
              detail: '이메일을 입력하세요.', 
              life: 3000
            });
            setInvalidCustomerEmail('p-invalid');
            setIsCorrectEmail(false);
        }
    }, [dispatch]);

    const onPasswordCorrectCheck = (firstPassword, lastPassword) => {
        if (firstPassword === lastPassword) {
            setInvalidCustomerPassword('');
            setIsCorrectPassword(true);
        } else {
            setInvalidCustomerPassword('p-invalid');
            setIsCorrectPassword(false);
        }
    }

    const onHandlePasswordCorrectCheck = (firstPassword, e) => {
        setCustomerPasswordCheck(e.target.value);  
        setTimeout(onPasswordCorrectCheck(firstPassword, e.target.value), 100);
    } 

    const onSignUp = useCallback(async (id, emailAddress, password, isCorrectEmail, isCorrectPassword) => {//
        if (isCorrectEmail && isCorrectPassword) {
            const customerEmail = `${id}@${emailAddress}`;
            const customerPassword = password;
            try {
              confirmDialog({
                header: '회원가입',
                icon: 'pi pi-exclamation-triangle',
                message: '정말 가입하시겠습니까?',
                position: 'top',
                accept: () => {
                  createUserWithEmailAndPassword(auth, customerEmail, customerPassword)
                    .then((userCredential) => {
                        const customerObj = {
                            displayName: userCredential.user.displayName,
                            customerEmail: userCredential.user.email,
                            photoURL: userCredential.user.photoURL,
                            uid: userCredential.user.uid,
                            createdAt: Date.now(),
                            subscribes: 0,
                            bio: '',
                            infoDetail: '',
                            link: {linkName: '', linkAddress: ''},
                            enabled: true,
                        }
                        dispatch(createCustomerObjThunk(customerObj));
                        router.replace(`/`);
                    })
                    .catch((error) => { 
                        console.log("SIGN UP FAILED!", error); 
                    });
                },
                reject: () => { return } 
              });
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({
              severity: 'error', 
              summary: '회원 가입 실패!', 
              detail: '가입 정보를 올바르게 입력하세요.', 
              life: 3000
            });
            setInvalidCustomerEmail('p-invalid');
            setInvalidCustomerPassword('p-invalid');
            setIsCustomerEmailInputDisabled(false);
            setIsCorrectEmail(false);
            setIsCorrectPassword(false);
        }
    }, [dispatch]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-30rem">
                    <h1 className="flex justify-content-center">회원가입</h1>
                    <div className="field p-fluid mt-6">
                        <label>이메일</label>
                        <span className="p-inputgroup">
                            <InputText className={invalidCustomerEmail} value={customerId} onChange={(e) => setCustomerId(e.target.value)} disabled={isCustomerEmailInputDisabled} />
                            <span className="p-inputgroup-addon"><i className="pi pi-at"></i></span>
                            <InputText className={invalidCustomerEmail} value={customerEmailAddress} onChange={(e) => setCustomerEmailAddress(e.target.value)} disabled={isCustomerEmailInputDisabled} />
                            <Button label="중복확인" className="p-button-success" onClick={() => onCheckDuplicatedEmail(customerId, customerEmailAddress)} loading={duplicatedCheckLoading} disabled={isCustomerEmailInputDisabled} />
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호</label>
                        <span className="p-inputgroup">
                          <Password className={invalidCustomerPassword} value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호 확인</label>
                        <span className="p-inputgroup">
                          <Password className={invalidCustomerPassword} value={customerPasswordCheck} onChange={(e) => onHandlePasswordCorrectCheck(customerPassword, e)} feedback={false} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="회원가입" icon="pi pi-user-plus" className="pr-5" onClick={() => onSignUp(customerId, customerEmailAddress, customerPassword, isCorrectEmail, isCorrectPassword)} />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href={`/auth/signIn`}>
                            <Button label="로그인" icon="pi pi-sign-in" className="p-button-info pr-5" />
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
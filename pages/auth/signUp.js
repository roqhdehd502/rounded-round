import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import { checkDuplicatedEmailThunk, createUserObjThunk } from '../../store/modules/UserInfo';


SignUp.layout = "L2";
export default function SignUp() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = getAuth();

    const isDuplicatedUserEmailResult = useSelector(({ UserInfo }) => UserInfo.isDuplicatedUserEmailResult);
    const duplicatedCheckLoading = useSelector(({ UserInfo }) => UserInfo.loading);

    const [userId, setUserId] = useState('');
    const [userEmailAddress, setUserEmailAddress] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordCheck, setUserPasswordCheck] = useState('');

    const [isUserEmailInputDisabled, setIsUserEmailInputDisabled] = useState(false);
    const [invalidUserEmail, setInvalidUserEmail] = useState('');
    const [invalidUserPassword, setInvalidUserPassword] = useState('');
    
    const [isCorrectEmail, setIsCorrectEmail] = useState(false);
    const [isCorrectPassword, setIsCorrectPassword] = useState(false);

    useEffect(() => {
        switch(isDuplicatedUserEmailResult) {
            case 'Y':
                setInvalidUserEmail('p-invaild');
                setIsUserEmailInputDisabled(false);
                setIsCorrectEmail(false);
                alert("이미 등록된 이메일입니다.");
                break;
            case 'N':
                setInvalidUserEmail('');
                setIsUserEmailInputDisabled(true);
                setIsCorrectEmail(true);
                alert("사용하실 수 있는 이메일입니다.");
        }
    }, [isDuplicatedUserEmailResult]);

    const onCheckDuplicatedEmail = useCallback(async (id, emailAddress) => {
        if(id !== '' || emailAddress !== '') {
            const confirmEmailAddress = `${id}@${emailAddress}`;
            try {
                await dispatch(checkDuplicatedEmailThunk(confirmEmailAddress));
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("이메일을 입력하세요!");
            setInvalidUserEmail('p-invalid');
            setIsCorrectEmail(false);
        }
    }, [dispatch]);

    const onPasswordCorrectCheck = (firstPassword, lastPassword) => {
        if (firstPassword === lastPassword) {
            setInvalidUserPassword('');
            setIsCorrectPassword(true);
        } else {
            setInvalidUserPassword('p-invalid');
            setIsCorrectPassword(false);
        }
    }

    const onHandlePasswordCorrectCheck = (firstPassword, e) => {
        setUserPasswordCheck(e.target.value);  
        setTimeout(onPasswordCorrectCheck(firstPassword, e.target.value), 100);
    } 

    const onSignUp = useCallback(async (id, emailAddress, password, isCorrectEmail, isCorrectPassword) => {//
        if (isCorrectEmail && isCorrectPassword) {
            const userEmail = `${id}@${emailAddress}`;
            const userPassword = password;
            try {
                if (confirm('정말 가입하시겠습니까?')) {
                    createUserWithEmailAndPassword(auth, userEmail, userPassword)
                      .then((userCredential) => {
                          const userObj = {
                              displayName: userCredential.user.displayName,
                              userEmail: userCredential.user.email,
                              photoURL: userCredential.user.photoURL,
                              uid: userCredential.user.uid,
                              createdAt: Date.now(),
                              subscribes: 0,
                              bio: '',
                              infoDetail: '',
                              link: {linkName: '', linkAddress: ''},
                              enabled: true,
                          }
                          dispatch(createUserObjThunk(userObj));
                          router.replace('/');
                      })
                      .catch((error) => { 
                          console.log("SIGN UP FAILED!", error); 
                      });
                } else {
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('가입 정보를 올바르게 입력하세요!');
            setInvalidUserEmail('p-invalid');
            setInvalidUserPassword('p-invalid');
            setIsUserEmailInputDisabled(false);
            setIsCorrectEmail(false);
            setIsCorrectPassword(false);
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-30rem">
                    <h1 className="flex justify-content-center">회원가입</h1>
                    <div className="field p-fluid mt-6">
                        <label>이메일</label>
                        <span className="p-inputgroup">
                            <InputText className={invalidUserEmail} value={userId} onChange={(e) => setUserId(e.target.value)} disabled={isUserEmailInputDisabled} />
                            <span className="p-inputgroup-addon"><i className="pi pi-at"></i></span>
                            <InputText className={invalidUserEmail} value={userEmailAddress} onChange={(e) => setUserEmailAddress(e.target.value)} disabled={isUserEmailInputDisabled} />
                            <Button label="중복확인" className="p-button-success" onClick={() => onCheckDuplicatedEmail(userId, userEmailAddress)} loading={duplicatedCheckLoading} disabled={isUserEmailInputDisabled} />
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호</label>
                        <span className="p-inputgroup">
                          <Password className={invalidUserPassword} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호 확인</label>
                        <span className="p-inputgroup">
                          <Password className={invalidUserPassword} value={userPasswordCheck} onChange={(e) => onHandlePasswordCorrectCheck(userPassword, e)} feedback={false} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="회원가입" icon="pi pi-user-plus" className="pr-5" onClick={() => onSignUp(userId, userEmailAddress, userPassword, isCorrectEmail, isCorrectPassword)} />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/Auth/SignIn">
                            <Button label="로그인" icon="pi pi-sign-in" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href="/Auth/FindPassword">
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
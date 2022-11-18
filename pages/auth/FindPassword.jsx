import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import * as UserInfoActions from '../../store/modules/UserInfo';


FindPassword.layout = "L2";
export default function FindPassword() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [userEmail, setUserEmail] = useState('');

    const onFindPassword = useCallback((email) => {
        try {
            dispatch(UserInfoActions.patchUserPassword(email));
            alert('가입하신 회원님의 이메일로 비밀번호 변경 요청을 전송하였습니다.');
            router.replace('/');
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-30rem">
                    <h1 className="flex justify-content-center">비밀번호 찾기</h1>
                    <div className="field p-fluid mt-6">
                        <span className="p-float-label">
                            <InputText id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            <label htmlFor="userEmail">이메일</label>
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="비밀번호 찾기" icon="pi pi-search" className="pr-5" onClick={() => onFindPassword(userEmail)} />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/Auth/SignIn">
                            <Button label="로그인" icon="pi pi-sign-in" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href="/Auth/SignUp">
                            <Button label="회원가입" icon="pi pi-user-plus" className="p-button-info pr-5" />
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
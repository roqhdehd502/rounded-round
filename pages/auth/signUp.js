import { useState } from 'react';
import Link from "next/Link";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';


signUp.layout = "L2";
export default function signUp() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordCheck, setUserPasswordCheck] = useState('');

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card w-30rem">
                    <h1 className="flex justify-content-center">회원가입</h1>
                    <div className="field p-fluid mt-6">
                        <label>이메일</label>
                        <span className="p-inputgroup">
                            <InputText value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            <Button label="중복확인" className="p-button-success"/>
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호</label>
                        <span className="p-inputgroup">
                          <Password value={userPassword} onChange={(e) => setUserPassword(e.target.value)} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid">
                        <label>비밀번호 확인</label>
                        <span className="p-inputgroup">
                          <Password value={userPasswordCheck} onChange={(e) => setUserPasswordCheck(e.target.value)} feedback={false} toggleMask />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="회원가입" icon="pi pi-user-plus" className="pr-5" />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/auth/signIn">
                            <Button label="로그인" icon="pi pi-sign-in" className="p-button-info pr-5" />
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
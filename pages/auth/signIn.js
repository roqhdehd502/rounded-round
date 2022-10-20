import { useState } from 'react';
import Link from "next/Link";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';


signIn.layout = "L2";
export default function signIn() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card w-30rem">
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
                        <Button label="이메일 로그인" icon="pi pi-sign-in" className="pr-5" />
                    </div>
                    <div className="field p-fluid">
                        <Button label="구글 로그인" icon="pi pi-google" className="pr-5" />
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
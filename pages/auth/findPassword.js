import { useState } from 'react';
import Link from "next/Link";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


findPassword.layout = "L2";
export default function findPassword() {
    const [userEmail, setUserEmail] = useState('');

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card w-30rem">
                    <h1 className="flex justify-content-center">비밀번호 찾기</h1>
                    <div className="field p-fluid mt-6">
                        <span className="p-float-label">
                            <InputText id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            <label htmlFor="userEmail">이메일</label>
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="비밀번호 찾기" icon="pi pi-search" className="pr-5" />
                    </div>
                    <div className="field p-fluid mt-6">
                        <Link href="/auth/signIn">
                            <Button label="로그인" icon="pi pi-sign-in" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href="/auth/signUp">
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
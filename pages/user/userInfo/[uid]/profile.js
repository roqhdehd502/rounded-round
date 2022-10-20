import { useState } from 'react';
import Link from "next/Link";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


profile.layout = "L2";
export default function profile() {
    const [userObj, setUserObj] = useState({});

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-30rem">
                    <div className="field p-fluid">
                        <img className="border-circle w-15rem h-15rem image-align-center" alt={userObj.userNickName} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRr0YlatAy-hrNCQjzZ7fqDzNiXt7HGmzVaA&usqp=CAU" onError={(e) => e.target.src = '/img/user-logo.png'} />
                    </div>
                    <h1 className="flex justify-content-center">김라운디드</h1>
                </div>
            </div>    

            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-auto">
                    <div class="grid text-center">
                        <div class="col-4 text-500"><h3 className="mb-0">컨텐츠</h3></div>
                        <div class="col-4 text-500"><h3 className="mb-0">구독자 수</h3></div>
                        <div class="col-4 text-500"><h3 className="mb-0">가입일</h3></div>
                        <div class="col-4 text-700"><h3 className="mt-0">1,230개</h3></div>
                        <div class="col-4 text-700"><h3 className="mt-0">20만</h3></div>
                        <div class="col-4 text-700"><h3 className="mt-0">2020/12/07</h3></div>
                    </div>
                    <div className="field text-center p-fluid mt-3 p-1 pl-3 pr-3 surface-100 border-round-3xl">
                        <h3>설명</h3>
                        <p className="white-space-normal">힙합 장르가 좋아 주변인에게 알려주는 걸 시작해 어느새 큐레이터가 되었습니다.</p>
                    </div>
                    <div className="field text-center p-fluid mt-3 p-1 surface-100 border-round-3xl">
                        <h3>세부정보</h3>
                        <h4 className="white-space-normal">Sound Engineering Producer.</h4>
                        <h4 className="white-space-normal">Rounded@gmail.com</h4>
                    </div>
                    <div className="field text-center p-fluid mt-3 p-1 surface-100 border-round-3xl">
                        <h3>링크</h3>
                        <Button label="노션" icon="pi pi-external-link" className="p-button-text pr-5" />
                        <Button label="인스타그램" icon="pi pi-external-link" className="p-button-text pr-5" />
                        <Button label="트위치" icon="pi pi-external-link" className="p-button-text pr-5" />
                    </div>
                </div>
            </div>
        </>
    );
}
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import * as userInfoActions from '../../store/modules/userInfo';


export default function UserHeader(props) {
    const activeUserIndex = props.activeIndex;
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);

    useEffect(() => {

    }, [userObj]);

    const onEmailVerificationSend = useCallback(() => {
        dispatch(userInfoActions.sendUserEmailVerification());
        alert('가입하신 회원님의 이메일로 계정 인증 요청 메일을 전송하였습니다.');
        dispatch(userInfoActions.userLogout());
        router.replace('/');
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-30rem">
                    <div className="field p-fluid">
                        <img className="border-circle w-15rem h-15rem image-align-center" alt={props.userObj.displayName} src={props.userObj.photoURL ? props.userObj.photoURL : '/img/anonymous-user-logo.png'} onError={(e) => e.target.src = '/img/anonymous-user-logo.png'} />
                    </div>
                    <h1 className="flex justify-content-center">
                        {props.userObj.displayName ? props.userObj.displayName : props.userObj.userEmail}
                    </h1>
                </div>
            </div>

            <div className="card w-auto mb-3">
                <div className="flex justify-content-center flex-wrap">
                    <div className="flex align-items-center">
                        {userObj && userObj.uid === props.userObj.uid ? (
                            <>
                                {userObj.emailVerified ? (
                                    <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증됨" disabled />
                                ) : (
                                    <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증하기" onClick={() => onEmailVerificationSend()} />
                                )}
                                <Link 
                                  href={{
                                    pathname: `/user/${userObj.uid}/userProfileUpdate`,
                                    query: { uid: userObj.uid }
                                  }}
                                  as={`/user/${userObj.uid}/userProfileUpdate`}
                                  shallow
                                >
                                    <Button className="ml-4 w-8rem p-button-rounded p-button-warning" icon="pi pi-pencil" label="수정하기" />
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* 구독여부 분기 처리 구현하기 */}
                                {userObj ? (
                                    <>
                                        <Button className={`p-button-rounded p-button-info`} icon="pi pi-plus" label="구독하기" />
                                    </>
                                ) : (
                                    <>
                                        <Button className={`p-button-rounded p-button-info`} icon="pi pi-plus" label="구독하기" />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Divider />

            <div className="card w-auto mb-3">
                <div className="flex justify-content-center flex-wrap">
                    <div className="flex align-items-center">
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userContents`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userContents`}
                          shallow
                        >
                            <Button className={`w-8rem p-button-rounded${activeUserIndex === 0 ? '' : ' p-button-outlined'}`} icon="pi pi-folder" label="컨텐츠" />
                        </Link>
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userCommunity`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userCommunity`}
                          shallow
                        >
                            <Button className={`ml-4 mr-4 w-8rem p-button-rounded${activeUserIndex === 1 ? '' : ' p-button-outlined'}`} icon="pi pi-comments" label="커뮤니티" />
                        </Link>
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userProfile`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userProfile`}
                          shallow
                        >
                            <Button className={`w-8rem p-button-rounded${activeUserIndex === 2 ? '' : ' p-button-outlined'}`} icon="pi pi-user" label="정보" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
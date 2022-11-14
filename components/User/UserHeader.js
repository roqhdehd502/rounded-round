import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import * as userInfoActions from '../../store/modules/userInfo';
import { getUserInfoObjThunk } from '../../store/modules/userInfo';


export default function UserHeader(props) {
    const activeUserIndex = props.activeIndex;
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);
    const userInfoObj = useSelector(({ userInfo }) => userInfo.userInfoObj);
    
    useEffect(() => {
        if (!router.isReady) return; 
        dispatch(getUserInfoObjThunk(router.query.uid));
    }, [router.isReady]);

    const onEmailVerificationSend = useCallback(() => {
        dispatch(userInfoActions.sendUserEmailVerification());
        alert('가입하신 회원님의 이메일로 계정 인증 요청 메일을 전송하였습니다.');
        dispatch(userInfoActions.userLogout());
        router.replace('/');
    }, [dispatch]);

    return (
        <>
            <div className="card surface-0 p-5 border-round-2xl">
                <div className="flex align-content-center align-items-center justify-content-center">
                    <div className="card w-30rem">
                        <div className="field p-fluid">
                            <img className="border-circle w-15rem h-15rem image-align-center" alt={userInfoObj.displayName} src={userInfoObj.photoURL ? userInfoObj.photoURL : '/img/anonymous-user-logo.png'} onError={(e) => e.target.src = '/img/anonymous-user-logo.png'} />
                        </div>
                        <h1 className="flex justify-content-center">
                            {userInfoObj.displayName ? userInfoObj.displayName : userInfoObj.userEmail}
                        </h1>
                    </div>
                </div>

                <div className="card w-auto mb-3">
                    <div className="flex justify-content-center flex-wrap">
                        <div className="flex align-items-center">
                            {userObj && userObj.uid === userInfoObj.uid ? (
                                <>
                                    {userObj.emailVerified ? (
                                        <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증됨" disabled />
                                    ) : (
                                        <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증하기" onClick={() => onEmailVerificationSend()} />
                                    )}
                                    <Link 
                                      href={{
                                        pathname: `/user/${userObj.uid}/userProfileUpdate`,
                                        query: { 
                                          uid: userInfoObj.uid,
                                          displayName: userInfoObj.displayName,
                                          photoURL: userInfoObj.photoURL,
                                          bio: userInfoObj.bio,
                                          infoDetail: userInfoObj.infoDetail,
                                          link: JSON.stringify(userInfoObj.link),
                                        }
                                      }}
                                      as={`/user/${userObj.uid}/userProfileUpdate`}
                                    >
                                        <Button className="ml-4 w-8rem p-button-rounded p-button-warning" icon="pi pi-pencil" label="수정하기" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* 구독여부 분기 처리 구현하기 */}
                                    {userObj ? (
                                        <>
                                            <Button className={`p-button-rounded p-button-info`} icon="pi pi-check" label="구독됨" />
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
                                pathname: `/user/${userInfoObj.uid}/userContents`,
                                query: { ...userInfoObj },
                              }}
                              as={`/user/${userInfoObj.uid}/userContents`}
                            >
                                <Button className={`w-8rem p-button-rounded${activeUserIndex === 0 ? '' : ' p-button-outlined'}`} icon="pi pi-folder" label="컨텐츠" />
                            </Link>
                            <Link 
                              href={{
                                pathname: `/user/${userInfoObj.uid}/userCommunity`,
                                query: { ...userInfoObj },
                              }}
                              as={`/user/${userInfoObj.uid}/userCommunity`}
                            >
                                <Button className={`ml-4 mr-4 w-8rem p-button-rounded${activeUserIndex === 1 ? '' : ' p-button-outlined'}`} icon="pi pi-comments" label="커뮤니티" />
                            </Link>
                            <Link 
                              href={{
                                pathname: `/user/${userInfoObj.uid}/userProfile`,
                                query: { ...userInfoObj },
                              }}
                              as={`/user/${userInfoObj.uid}/userProfile`}
                            >
                                <Button className={`w-8rem p-button-rounded${activeUserIndex === 2 ? '' : ' p-button-outlined'}`} icon="pi pi-user" label="정보" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 mb-4"></div>
        </>
    );
}
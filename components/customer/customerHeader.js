import { useEffect, useCallback, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import ProjectContext from '../../context';

import * as customerInfoActions from '../../store/modules/customerInfo';
import { getCustomerInfoObjThunk } from '../../store/modules/customerInfo';


export default function CustomerHeader(props) {
    const activeCustomerIndex = props.activeIndex;
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();

    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);
    const customerInfoObj = useSelector(({ customerInfo }) => customerInfo.customerInfoObj);

    useEffect(() => {
        if (!router.isReady) return; 
        dispatch(getCustomerInfoObjThunk(router.query.uid));
    }, [router.isReady]);

    const onEmailVerificationSend = useCallback(() => {
        confirmDialog({
          header: '이메일 인증 확인 전송',
          icon: 'pi pi-exclamation-triangle',
          message: '가입하신 이메일 주소로 인증 확인 이메일을 전송하시겠습니까?',
          position: 'top',
          accept: () => {
            dispatch(customerInfoActions.sendCustomerEmailVerification());
            dispatch(customerInfoActions.logout());
            router.replace(`/`);
          },
          reject: () => { return } 
        });
    }, [dispatch]);

    return (
        <>
            <ConfirmDialog />

            <div className="card surface-0 p-5 border-round-2xl">
                <div className="flex align-content-center align-items-center justify-content-center">
                    <div className="card w-30rem">
                        <div className="flex justify-content-center">
                            <Image className="border-circle image-align-center" alt={customerInfoObj.displayName} src={customerInfoObj.photoURL ? customerInfoObj.photoURL : `${prefix}/img/anonymous-user-logo.png`} onError={(e) => e.target.src = `${prefix}/img/anonymous-user-logo.png`} width={240} height={240} quality={100} />
                        </div>
                        <h1 className="flex justify-content-center">
                            {customerInfoObj.displayName ? customerInfoObj.displayName : customerInfoObj.customerEmail}
                        </h1>
                    </div>
                </div>

                <div className="card w-auto mb-3">
                    <div className="flex justify-content-center flex-wrap">
                        <div className="flex align-items-center">
                            {customerObj && customerObj.uid === customerInfoObj.uid ? (
                                <>
                                    {customerObj.emailVerified ? (
                                        <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증됨" disabled />
                                    ) : (
                                        <Button className="mr-4 w-8rem p-button-rounded p-button-info" icon="pi pi-unlock" label="인증하기" onClick={() => onEmailVerificationSend()} />
                                    )}
                                    <Link 
                                      href={{
                                        pathname: `/customer/${customerObj.uid}/customerProfile/update`,
                                        query: { uid: customerInfoObj.uid }
                                      }}
                                      as={`/customer/${customerObj.uid}/customerProfile/update`}
                                    >
                                        <Button className="ml-4 w-8rem p-button-rounded p-button-warning" icon="pi pi-pencil" label="수정하기" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* 구독여부 분기 처리 구현하기 */}
                                    {customerObj ? (
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
                                pathname: `/customer/${customerInfoObj.uid}/customerContents`,
                                query: { ...customerInfoObj },
                              }}
                              as={`/customer/${customerInfoObj.uid}/customerContents`}
                            >
                                <Button className={`w-8rem p-button-rounded${activeCustomerIndex === 0 ? '' : ' p-button-outlined'}`} icon="pi pi-folder" label="컨텐츠" />
                            </Link>
                            <Link 
                              href={{
                                pathname: `/customer/${customerInfoObj.uid}/customerCommunity`,
                                query: { ...customerInfoObj },
                              }}
                              as={`/customer/${customerInfoObj.uid}/customerCommunity`}
                            >
                                <Button className={`ml-4 mr-4 w-8rem p-button-rounded${activeCustomerIndex === 1 ? '' : ' p-button-outlined'}`} icon="pi pi-comments" label="커뮤니티" />
                            </Link>
                            <Link 
                              href={{
                                pathname: `/customer/${customerInfoObj.uid}/customerProfile`,
                                query: { ...customerInfoObj },
                              }}
                              as={`/customer/${customerInfoObj.uid}/customerProfile`}
                            >
                                <Button className={`w-8rem p-button-rounded${activeCustomerIndex === 2 ? '' : ' p-button-outlined'}`} icon="pi pi-user" label="정보" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 mb-4"></div>
        </>
    );
}
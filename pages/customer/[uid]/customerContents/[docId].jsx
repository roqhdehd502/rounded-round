import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';

import { LoadingComponent } from '../../../../components/commons/loadingComponent';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../../commons/functional/filters';

import { getCustomerInfoObjThunk } from '../../../../store/modules/customerInfo';
import { getCustomerContentThunk } from '../../../../store/modules/customerContentsInfo';


customerContent.layout = "L1";
export default function customerContent() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);
    const customerInfoObj = useSelector(({ customerInfo }) => customerInfo.customerInfoObj);
    const customerContentObj = useSelector(({ customerContentsInfo }) => customerContentsInfo.customerContentObj);

    useEffect(() => {
        dispatch(getCustomerInfoObjThunk(router.query.uid));
        dispatch(getCustomerContentThunk(router.query.docId));
    }, [router.query, customerInfoObj?.uid, customerContentObj?.docId]);

    return (
        <>
            {customerContentObj ? (
                <>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <div className="flex justify-content-between align-content-center mb-3">
                            <h2 className="my-0">{ellipsisText(customerContentObj.title, 32)}</h2>
                            {customerContentObj.uid === customerObj.uid ? (
                                <Link 
                                  href={{
                                    pathname: `/customer/${customerObj.uid}/customerContents/update/${router.query.docId}`,
                                    query: { uid: customerObj.uid, docId: router.query.docId },
                                  }}
                                  as={`/customer/${customerObj.uid}/customerContents/update/${router.query.docId}`}
                                >
                                    <Button className="p-button-rounded p-button-info" icon="pi pi-pencil" />
                                </Link>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <div className="flex justify-content-between h-4rem">
                            <div className="flex justify-content-start">
                                <Image className="border-circle py-2" alt={customerInfoObj.displayName} src={customerObj.photoURL ? customerObj.photoURL : `${prefix}/img/anonymous-user-logo.png`} onError={(e) => e.target.src = `${prefix}/img/anonymous-user-logo.png`} width={42} height={35} quality={25} />
                                <div className="pt-2 ml-3">
                                    <h4 className="my-1">{customerInfoObj.displayName}</h4>
                                    <label>구독자 12만명</label>
                                </div>
                            </div>
                            <div className="flex justify-content-end py-3">
                                <Button className="p-button-rounded p-button-outlined" icon="pi pi-thumbs-up" label={formatUnitEachThousand(1267)} />
                                <Button className="p-button-rounded p-button-outlined p-button-danger ml-2" icon="pi pi-bell" label="신고" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <div className="flex">
                            <div className="white-space-normal" dangerouslySetInnerHTML={ {__html: customerContentObj.contents} }></div>
                        </div>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <div className="flex justify-content-center">
                            <h2>현재 댓글 기능은 준비 중 입니다!</h2>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
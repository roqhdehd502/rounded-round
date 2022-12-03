import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { Button } from 'primereact/button';

import CustomerHeader from '../../../../components/customer/customerHeader';
import { LoadingComponent } from '../../../../components/commons/loadingComponent';

import { formatUnitEachThousand, timeFormatting } from '../../../../commons/functional/filters'

import { getCustomerInfoObjThunk } from '../../../../store/modules/customerInfo';


customerProfile.layout = "L1";
export default function customerProfile() {
    const dispatch = useDispatch();
    const router = useRouter();

    const customerInfoObj = useSelector(({ customerInfo }) => customerInfo.customerInfoObj);

    useEffect(() => {
        dispatch(getCustomerInfoObjThunk(router.query.uid));
    }, [router.query, customerInfoObj ? customerInfoObj.uid : null]);

    return (
        <>
            {customerInfoObj ? (
                <>
                    <CustomerHeader
                      activeIndex={2}          
                    />
                                 
                    <div className="flex align-content-center align-items-center justify-content-center">
                        <div className="card surface-0 p-5 border-round-2xl border-round-2xl w-auto">
                            <div className="grid text-center">
                                <div className="col-4 text-500"><h3 className="mb-0">컨텐츠</h3></div>
                                <div className="col-4 text-500"><h3 className="mb-0">구독자 수</h3></div>
                                <div className="col-4 text-500"><h3 className="mb-0">가입일</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{formatUnitEachThousand(1230)}개</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{formatUnitEachThousand(customerInfoObj.subscribes)}명</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{timeFormatting(customerInfoObj.createdAt)}</h3></div>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 pl-3 pr-3 border-round-3xl">
                                <h3>설명</h3>
                                <p className="white-space-normal">
                                    {customerInfoObj.bio ? 
                                        customerInfoObj.bio 
                                    : (
                                        <p className="text-600">
                                            현재 입력된 실명 정보가 없습니다.
                                        </p>
                                    )}
                                </p>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 border-round-3xl">
                                <h3>세부정보</h3>
                                <p className="white-space-normal">
                                    {customerInfoObj.infoDetail ? 
                                        customerInfoObj.infoDetail.split('\\n').map((line, index) => {
                                            return (
                                                <span key={index}>
                                                    {line}<br />
                                                </span>
                                            )
                                        })
                                    : ( 
                                        <p className="text-600">
                                            현재 입력된 세부정보가 없습니다.
                                        </p>
                                    )}
                                </p>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 border-round-3xl">
                                <h3>링크</h3>
                                <div>
                                    {customerInfoObj.link.linkName ? (
                                        <Button 
                                          label={customerInfoObj.link.linkName} 
                                          icon="pi pi-external-link" 
                                          className="p-button-text pr-5"
                                          onClick={() => window.open(customerInfoObj.link.linkAddress)}
                                        />
                                    ) : (
                                        <p className="text-600">
                                            현재 입력된 링크가 없습니다.
                                        </p>
                                    )}
                                </div>
                            </div>
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
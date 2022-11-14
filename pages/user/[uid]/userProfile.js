import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { Button } from 'primereact/button';

import UserHeader from '../../../components/User/UserHeader';

import { formatUnitEachThousand, timeFormatting } from '../../../commons/functional/Filters'

import { getUserInfoObjThunk } from '../../../store/modules/UserInfo';


UserProfile.layout = "L1";
export default function UserProfile() {
    const dispatch = useDispatch();
    const router = useRouter();

    const userInfoObj = useSelector(({ UserInfo }) => UserInfo.userInfoObj);

    useEffect(() => {
        if (!router.isReady) return; 
        dispatch(getUserInfoObjThunk(router.query.uid));
    }, [router.isReady]);

    return (
        <>
            {userInfoObj ? (
                <>
                    <UserHeader
                      activeIndex={2}          
                    />
                                 
                    <div className="flex align-content-center align-items-center justify-content-center">
                        <div className="card surface-0 p-5 border-round-2xl border-round-2xl w-auto">
                            <div className="grid text-center">
                                <div className="col-4 text-500"><h3 className="mb-0">컨텐츠</h3></div>
                                <div className="col-4 text-500"><h3 className="mb-0">구독자 수</h3></div>
                                <div className="col-4 text-500"><h3 className="mb-0">가입일</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{formatUnitEachThousand(1230)}개</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{formatUnitEachThousand(userInfoObj.subscribes)}명</h3></div>
                                <div className="col-4 text-700"><h3 className="mt-0">{timeFormatting(userInfoObj.createdAt)}</h3></div>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 pl-3 pr-3 border-round-3xl">
                                <h3>설명</h3>
                                <p className="white-space-normal">
                                    {userInfoObj.bio}
                                </p>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 border-round-3xl">
                                <h3>세부정보</h3>
                                <p className="white-space-normal">
                                    {userInfoObj.infoDetail.split('\\n').map((line, index) => {
                                        return (
                                            <span key={index}>
                                                {line}<br />
                                            </span>
                                        )
                                    })}
                                </p>
                            </div>
                            <div className="field text-center p-fluid mt-4 p-1 border-round-3xl">
                                <h3>링크</h3>
                                <div>
                                    <Button 
                                      label={userInfoObj.link.linkName} 
                                      icon="pi pi-external-link" 
                                      className="p-button-text pr-5"
                                      onClick={() => window.open(userInfoObj.link.linkAddress)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-content-center align-content-center min-h-screen">
                        <div>
                            <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                        </div>
                    </div>            
                </>
            )}
        </>
    );
}
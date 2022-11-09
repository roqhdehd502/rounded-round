import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import UserHeader from '../../../components/User/UserHeader';

import { timeCounter } from '../../../commons/functional/filters'

import { getUserInfoObjThunk } from '../../../store/modules/userInfo';
import { getUserCommunitiesThunk } from '../../../store/modules/userCommunity';


userCommunity.layout = "L1";
export default function userCommunity() {
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);
    const userInfoObj = useSelector(({ userInfo }) => userInfo.userInfoObj);
    const userCommunities = useSelector(({ userCommunity }) => userCommunity.userCommunities);

    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'popularCount', order: -1 }]);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        if (!router.isReady) return; 
        dispatch(getUserInfoObjThunk(router.query.uid));
        dispatch(getUserCommunitiesThunk(router.query.uid));
        setLoading(false);
    }, [router.isReady]);

    const contentBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex align-content-center align-items-center justify-content-center">
                    <div className="card surface-0 p-5 w-9">
                        <div className="flex justify-content-end mr-3">
                            <div className="mr-3">
                                <Link
                                  href={{
                                    pathname: `/user/${rowData.uid}/userCommunityUpdate`,
                                    query: {
                                      ...rowData
                                    }
                                  }}
                                  as={`/user/${rowData.uid}/userCommunityUpdate`}
                                >
                                    <Button className="p-button-rounded p-button-info" icon="pi pi-pencil" />
                                </Link>
                            </div>
                            <div className="pt-1">
                                {timeCounter(rowData.uploadDate)}에 작성
                            </div>
                        </div>
                        <Divider />
                        <div className="field p-fluid w-full">
                            <div className="text-lg white-space-normal w-full">
                                {rowData.contents.split('\\n').map((line, index) => {
                                    return (
                                        <span key={index}>
                                            {line}<br />
                                        </span>
                                    )
                                })}
                            </div>
                        </div>                    
                        <div className="field p-fluid w-full">
                            {rowData.thumbnail ? (
                                <img className="border-round-2xl w-full" src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                            ) : (
                                <div className="h-16rem"></div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        ); 
    }

    return (
        <>
            {userInfoObj ? (
                <>
                    <UserHeader
                      activeIndex={1}           
                    />    

                    <div className="flex align-content-center align-items-center justify-content-center">
                        <div className="card surface-0 p-5 border-round-2xl w-auto">
                            {userObj && userObj.uid === userInfoObj.uid ? (
                                <div className="flex justify-content-end">
                                    <Link 
                                      href={{
                                        pathname: `/user/${userObj.uid}/userCommunityCreate`,
                                        query: { uid: userObj.uid },
                                      }}
                                      as={`/user/${userObj.uid}/userCommunityCreate`}
                                    >
                                        <Button className="ml-4 w-9rem p-button-rounded p-button-info" icon="pi pi-plus" label="새 커뮤니티" />
                                    </Link>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            
                            <DataTable 
                              value={userCommunities} className="p-datatable-customers" rows={10}
                              dataKey="id" rowHover
                              paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                              currentPageReportTemplate="{first} / {last} of {totalRecords}"
                              sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={(e) => setMultiSortMeta(e.multiSortMeta)}               
                              loading={loading} responsiveLayout="scroll"
                            >
                                <Column field="thumbnail" body={contentBodyTemplate} bodyStyle={{ width: 'auto'}} />
                            </DataTable>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex align-items-baseline">
                        <i className="flex align-items-center justify-content-center pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                    </div>                
                </>
            )}
        </>
    );
}
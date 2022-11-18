import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import ProjectContext from '../../../../context';

import UserHeader from '../../../../components/user/userHeader';

import { timeCounter } from '../../../../commons/functional/Filters'

import { getUserInfoObjThunk } from '../../../../store/modules/UserInfo';
import { getUserCommunitiesThunk } from '../../../../store/modules/UserCommunity';


UserCommunity.layout = "L1";
export default function UserCommunity() {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ UserInfo }) => UserInfo.userObj);
    const userInfoObj = useSelector(({ UserInfo }) => UserInfo.userInfoObj);
    const userCommunities = useSelector(({ UserCommunity }) => UserCommunity.userCommunities);

    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'popularCount', order: -1 }]);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        dispatch(getUserInfoObjThunk(router.query.uid));
        dispatch(getUserCommunitiesThunk(router.query.uid));
        setLoading(false);
    }, [router.query, userObj ? userObj.uid : null, , userInfoObj ? userInfoObj.uid : null]);

    const contentBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex align-content-center align-items-center justify-content-center">
                    <div className="card surface-0 p-5 w-9">
                        <div className="flex justify-content-end mr-3">
                            <div className="mr-3">
                                <Link
                                  href={{
                                    pathname: `/User/${rowData.uid}/UserCommunity/Update/${rowData.docId}`,
                                    query: {
                                      uid: rowData.uid,
                                      docId: rowData.docId,
                                    }
                                  }}
                                  as={`/User/${rowData.uid}/UserCommunity/Update/${rowData.docId}`}
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
                                <Image className="border-round-2xl" src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={500} height={500} quality={100} />
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
                                        pathname: `/User/${userObj.uid}/UserCommunity/Create`,
                                        query: { uid: userObj.uid },
                                      }}
                                      as={`/User/${userObj.uid}/UserCommunity/Create`}
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
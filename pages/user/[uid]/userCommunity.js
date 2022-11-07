import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';

import UserHeader from '../../../components/User/UserHeader';

import { timeCounter } from '../../../commons/functional/filters'

import { getCommunityData } from '../../../service';

import { getUserInfoObjThunk } from '../../../store/modules/userInfo';


userCommunity.layout = "L1";
export default function userCommunity() {
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userInfoObj);

    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'popularCount', order: -1 }]);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        dispatch(getUserInfoObjThunk(router.query.uid));
        const data = getCommunityData();
        setCustomers(getCustomers(data).filter((d) => {
            return d.uid === router.query.uid;
        })); 
        setLoading(false);
    }, [router.query]);

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.uploadDate = new Date(d.uploadDate);
            return d;
        });
    }

    const contentBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex align-content-center align-items-center justify-content-center">
                    <div className="card surface-0 p-5 w-9">
                        <div className="field p-fluid w-full text-right">
                            {timeCounter(rowData.uploadDate)}에 작성
                        </div>
                        <Divider />
                        <div className="field p-fluid w-full">
                            <p className="text-lg white-space-normal w-full">
                                {rowData.contents.split('\\n').map((line, index) => {
                                    return (
                                        <span key={index}>{line}<br /></span>
                                    )
                                })}
                            </p>
                        </div>                    
                        <div className="field p-fluid w-full">
                            <img className="border-round-2xl w-full" src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                        </div>
                    </div>
                </div>
            </>
        ); 
    }

    return (
        <>
            {userObj ? (
                <>
                    <UserHeader
                      activeIndex={1}
                      userObj={userObj}             
                    />    

                    <div className="flex align-content-center align-items-center justify-content-center">
                        <div className="card surface-0 p-5 border-round-2xl w-auto">
                            <DataTable 
                              value={customers} className="p-datatable-customers" rows={10}
                              dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
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
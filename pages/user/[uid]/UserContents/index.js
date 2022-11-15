import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';

import UserHeader from '../../../../components/User/UserHeader';

import { getContents } from '../../../../service';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../../commons/functional/Filters';

import { getUserInfoObjThunk } from '../../../../store/modules/UserInfo';


UserContents.layout = "L1";
export default function UserContents() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const userObj = useSelector(({ UserInfo }) => UserInfo.userObj);
    const userInfoObj = useSelector(({ UserInfo }) => UserInfo.userInfoObj);

    const [customers, setCustomers] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);     

    useEffect(() => {
        dispatch(getUserInfoObjThunk(router.query.uid));
        const data = getContents();
        setCustomers(getCustomers(data).filter((d) => {
            return d.uid === router.query.uid;
        })); 
        setLoading(false);
    }, [router.query, userObj ? userObj.uid : null, , userInfoObj ? userInfoObj.uid : null]);

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.uploadDate = new Date(d.uploadDate);
            return d;
        });
    }

    const renderListItem = (data) => {
        return (
            <>
                <div className="col-12">
                    <div className="product-list-item">
                        <img src={`${data.thumbnail}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                        <div className="product-list-detail">
                            <div className="product-description">{ellipsisText(data.title, 27)}</div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">조회수 {formatUnitEachThousand(data.views)}회 • {timeCounter(data.uploadDate)}</span>
                        </div>
                    </div>
                </div>
            </>
            
        );
    }

    const renderGridItem = (data) => {
        return (
            <>
                <div className="col-12 md:col-4">
                    <div className="product-grid-item card surface-0 border-round-2xl">
                        <div className="product-grid-item-content">
                            <img src={`${data.thumbnail}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                            <div className="product-description">{ellipsisText(data.title, 27)}</div>
                            <span className="product-price">조회수 {formatUnitEachThousand(data.views)}회 • {timeCounter(data.uploadDate)}</span>
                        </div>
                    </div>
                </div>
            </>
            
        );
    }

    const itemTemplate = (product, layout) => {
        if (!product) return;
        switch (layout) {
            case 'list':
                return renderListItem(product);
                break;
            case 'grid':
                return renderGridItem(product);
                break;
        }
    }    
    
    const renderHeader = () => {
        return (
            <>
                <div className="grid grid-nogutter">
                    <div className="col-12" style={{textAlign: 'right'}}>
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>
                </div>
            </>
            
        );
    }

    const header = renderHeader();

    return (
        <>
            {userInfoObj ? (
                <>
                    <UserHeader
                      activeIndex={0}            
                    />   

                    <div className="dataview-demo">
                        <div className="card surface-0 p-5 border-round-2xl">
                            {userObj && userObj.uid === userInfoObj.uid ? (
                                <div className="flex justify-content-end">
                                    {/* <Link 
                                      href={{
                                        pathname: `/User/${userObj.uid}/UserCommunityCreate`,
                                        query: { uid: userObj.uid },
                                      }}
                                      as={`/User/${userObj.uid}/UserCommunityCreate`}
                                    >
                                        <Button className="ml-4 w-9rem p-button-rounded p-button-info" icon="pi pi-plus" label="새 컨텐츠" />
                                    </Link> */}
                                    <Button className="ml-4 w-9rem p-button-rounded p-button-info" icon="pi pi-plus" label="새 컨텐츠" />
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <DataView value={customers} layout={layout} header={header}
                              itemTemplate={itemTemplate} paginator rows={9} loading={loading}
                            /> 
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
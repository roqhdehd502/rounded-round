import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import UserHeader from '../../../components/User/UserHeader';

import { getContents } from '../../../service';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../commons/functional/filters';

import { getUserInfoObjThunk } from '../../../store/modules/userInfo';


userContents.layout = "L1";
export default function userContents() {
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userInfoObj);

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
    }, [router.query]);

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
                            <div className="product-description">{ellipsisText(data.songName, 27)}</div>
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
        if (layout === 'list') {
            return renderListItem(product);
        } else if (layout === 'grid') {
            return renderGridItem(product);
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
            {userObj ? (
                <>
                    <UserHeader
                      activeIndex={0}
                      userObj={userObj}             
                    />   

                    <div className="dataview-demo">
                        <div className="card surface-0 p-5 border-round-2xl">
                            <DataView value={customers} layout={layout} header={header}
                              itemTemplate={itemTemplate} paginator rows={9} loading={loading}
                            /> 
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
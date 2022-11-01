import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import UserHeader from '../../../components/User/UserHeader';

import { SongService } from '../../../service/SongService';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../commons/functional/filters';


userContents.layout = "L1";
export default function userContents() {
    const router = useRouter();

    /** 향후 fbase 적용시 where절에 router.query.uid 조건걸어서 가져오기 */
    const [userObj, setUserObj] = useState(router.query);

    const [customers, setCustomers] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);     

    const songService = new SongService();

    useEffect(() => {
        setUserObj(router.query);

        const data = songService.getCustomersLarge();
        setCustomers(getCustomers(data)); setLoading(false);
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
                    <div className="product-grid-item card">
                        <div className="product-grid-item-content">
                            <img src={`${data.thumbnail}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                            <div className="product-description">{ellipsisText(data.songName, 27)}</div>
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
            <UserHeader
              activeIndex={0}
              userObj={userObj}             
            />   

            <div className="dataview-demo">
                <div className="card">
                    <DataView value={customers} layout={layout} header={header}
                      itemTemplate={itemTemplate} paginator rows={9} loading={loading}
                    /> 
                </div>
            </div>
        </>
    );
}
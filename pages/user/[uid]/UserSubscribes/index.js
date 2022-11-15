import { useState, useEffect } from 'react';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import { getContents } from '../../../../service';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../../commons/functional/Filters';


UserSubscribes.layout = "L1";
export default function UserSubscribes() {

    const [customers, setCustomers] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        const data = getContents();
        setCustomers(getCustomers(data)); 
        setLoading(false);
    }, []);

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
                    <div className="col-6 text-400 pt-3 pl-1" style={{textAlign: 'left'}}>
                        <h4 className="mt-0 mb-0"><i className="pi pi-exclamation-circle mr-2" />회원님이 구독한 유저의 최신 컨텐츠 입니다.</h4>
                    </div>
                    <div className="col-6" style={{textAlign: 'right'}}>
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>
                </div>
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            <div className="dataview-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h1 className="ml-3 mt-0 mb-0">내가 구독한 유저</h1>
                    <DataView value={customers} layout={layout} header={header}
                      itemTemplate={itemTemplate} paginator rows={9} loading={loading}
                    /> 
                </div>
            </div>
        </>
    );
}
import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';

import { LoadingComponent } from '../../../../components/commons/loadingComponent';
import CustomerHeader from '../../../../components/customer/customerHeader';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../../commons/functional/filters';

import { getCustomerInfoObjThunk } from '../../../../store/modules/customerInfo';
import { getCustomerContentsThunk } from '../../../../store/modules/customerContentsInfo';


customerContents.layout = "L1";
export default function customerContents() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);
    const customerInfoObj = useSelector(({ customerInfo }) => customerInfo.customerInfoObj);
    const customerContents = useSelector(({ customerContentsInfo }) => customerContentsInfo.customerContents);

    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);     

    useEffect(() => {
        dispatch(getCustomerInfoObjThunk(router.query.uid));
        dispatch(getCustomerContentsThunk(router.query.uid));

        setLoading(false);
    }, [router.query, customerObj?.uid, customerInfoObj?.uid]);

    const renderListItem = (data) => {
        return (
            <>
                <div className="col-12">
                    <div className="product-list-item">
                        <Link 
                          href={{
                            pathname: `/customer/${customerInfoObj.uid}/customerContents/${data.docId}`,
                            query: { uid: customerInfoObj.uid, docId: data.docId },
                          }}
                          as={`/customer/${customerInfoObj.uid}/customerContents/${data.docId}`}
                        >
                            <Image className="border-round-2xl image-link" src={data.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={100} height={100} quality={50} />
                        </Link>
                        <div className="product-list-detail ml-3">
                            <div className="product-description">
                                <h4>{ellipsisText(data.title, 27)}</h4>
                            </div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">조회수 {formatUnitEachThousand(1000)}회 • {timeCounter(data.uploadDate)}</span>
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
                            <Link 
                              href={{
                                pathname: `/customer/${customerInfoObj.uid}/customerContents/${data.docId}`,
                                query: { uid: customerInfoObj.uid, docId: data.docId },
                              }}
                              as={`/customer/${customerInfoObj.uid}/customerContents/${data.docId}`}
                            >
                                <Image className="border-round-2xl image-link" src={data.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={300} height={300} quality={75} />
                            </Link>
                            <div className="product-description">
                                <h4>{ellipsisText(data.title, 27)}</h4>
                            </div>
                            <span className="product-price">조회수 {formatUnitEachThousand(1000)}회 • {timeCounter(data.uploadDate)}</span>
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
            {customerInfoObj ? (
                <>
                    <CustomerHeader
                      activeIndex={0}            
                    />   

                    <div className="dataview-demo">
                        <div className="card surface-0 p-5 border-round-2xl">
                            {customerObj && customerObj.uid === customerInfoObj.uid ? (
                                <div className="flex justify-content-end">
                                    <Link 
                                      href={{
                                        pathname: `/customer/${customerObj.uid}/customerContents/create`,
                                        query: { uid: customerObj.uid },
                                      }}
                                      as={`/customer/${customerObj.uid}/customerContents/create`}
                                    >
                                        <Button className="ml-4 w-9rem p-button-rounded p-button-info" icon="pi pi-plus" label="새 컨텐츠" />
                                    </Link>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <DataView value={customerContents} layout={layout} header={header}
                              itemTemplate={itemTemplate} paginator rows={9} loading={loading}
                            /> 
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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { TabMenu } from 'primereact/tabmenu';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import { SongService } from '../../../../service/SongService';

import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../../../commons/functional/filters';


userContents.layout = "L1";
export default function userContents() {
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(0);
    const [userObj, setUserObj] = useState({});

    const [customers, setCustomers] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);      

    const userInfoMenuItems = [{
        label: '컨텐츠',
        icon: 'pi pi-fw pi-calendar',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userContents');
        }
      },
      {
        label: '커뮤니티',
        icon: 'pi pi-fw pi-pencil',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userCommunity');
        }
      },
      {
        label: '정보',
        icon: 'pi pi-fw pi-file',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userProfile');
        }
      },
    ];

    const songService = new SongService();

    useEffect(() => {
        const data = songService.getCustomersLarge();
        setCustomers(getCustomers(data)); setLoading(false);
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
            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-30rem">
                    <div className="field p-fluid">
                        <img className="border-circle w-15rem h-15rem image-align-center" alt={userObj.userNickName} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRr0YlatAy-hrNCQjzZ7fqDzNiXt7HGmzVaA&usqp=CAU" onError={(e) => e.target.src = '/img/user-logo.png'} />
                    </div>
                    <h1 className="flex justify-content-center">김라운디드</h1>
                </div>
            </div>
            <div className="flex align-content-center align-items-center justify-content-center mb-3">
                <div className="card w-auto">
                    <TabMenu model={userInfoMenuItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                </div>
            </div>    

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
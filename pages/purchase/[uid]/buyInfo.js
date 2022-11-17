import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { v4 as uuidv4 } from 'uuid';

import { getCarts } from '../../../service';

import { ellipsisText, formatUnitEachThousand } from '../../../commons/functional/Filters';


BuyInfo.layout = "L1";
export default function BuyInfo() {
    const router = useRouter();

    const [customers, setCustomers] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('rounded-round-buylist'));
        setCustomers(data ? data : []);
        setTotalPrice(data ? data.length : 0);
        setLoading(false);
    }, []);

    const onPaySongs = () => {
        if (!customers) {
            alert('구입할 곡 정보에 담긴 곡이 없습니다!');
            return;
        }

        if (confirm(`가격은 총 ${formatUnitEachThousand(totalPrice * 800)}원 입니다.\n정말 결제하시겠습니까?`)) {
            console.log("결제 API 호출 뒤 결과 값 객체에 담기!");
            let payList = JSON.parse(sessionStorage.getItem('rounded-round-buylist'));
            const payId = uuidv4();

            payList.forEach(item => {
                item.payId = payId;
                item.uid = router.query.uid;
                item.payDate = Date.now();
                item.price = 800;
            });

            sessionStorage.setItem('rounded-round-payresult', JSON.stringify(payList));  
            sessionStorage.removeItem('rounded-round-buylist');
            
            router.replace({
              pathname: `/Purchase/${router.query.uid}/PayResult/${payId}`,
              query: { uid: router.query.uid, payId: payId },
            },
            `/Purchase/${router.query.uid}/PayResult/${payId}`,
            );
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button 
                      className="mr-3 p-button-rounded p-button-success"
                      label="결제" 
                      onClick={() => onPaySongs()}
                    />
                </div>
            </div>
        )
    }

    const thumbnailBodyTemplate = (rowData) => {
        return (
            <Image alt={rowData.albumName} src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={50} height={50} quality={50} />
        );
    }

    const songInformationBodyTemplate = (rowData) => {
        return (
            <>
                <h4 className="mt-0 mb-0">{ellipsisText(rowData.songName, 27)}</h4>
                <label>{ellipsisText(rowData.artistName, 27)}</label>
            </>
        );
    }

    const albumNameBodyTemplate = (rowData) => {
        return <label>{ellipsisText(rowData.albumName, 27)}</label>
    }

    const songPriceBodyTemplate = () => {
        return (
            <>
                <h4>{formatUnitEachThousand(800)}원</h4>
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            {customers ? (
                <div className="datatable-doc-demo">
                    <div className="card surface-0 p-5 border-round-2xl">
                        <h1 className="ml-3 mt-0 mb-0">구입할 곡 정보</h1>
                        <Divider className="w-20rem" />
                        <h3 className="ml-3">총 : {formatUnitEachThousand(totalPrice * 800)}원</h3>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <DataTable 
                          value={customers} className="p-datatable-customers" header={header} rows={getCarts().length}
                          dataKey="id" rowHover 
                          emptyMessage="구입할 곡 정보에 담긴 곡이 없습니다."
                          loading={loading} responsiveLayout="scroll"
                        >
                            <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                            <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column field="albumName" header="앨범" body={albumNameBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column header="가격" body={songPriceBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        </DataTable>
                    </div>
                </div>
            ) : (
                <div className="flex justify-content-center align-content-center min-h-screen">
                    <div>
                        <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                    </div>
                </div>
            )}
        </>
    );
}
import { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';

import { v4 as uuidv4 } from 'uuid';

import { LoadingComponent } from '../../../components/commons/loadingComponent';

import { ellipsisText, formatUnitEachThousand } from '../../../commons/functional/filters';
import { getPayInformation } from '../../../commons/functional/payment';

import { getCustomerBuyHistoriesThunk, createBuyHistoryThunk } from '../../../store/modules/purchaseInfo';


buyInfo.layout = "L1";
export default function buyInfo() {
    const dispatch = useDispatch();
    const router = useRouter();

    const toast = useRef(null);

    const [customers, setCustomers] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buyData = JSON.parse(sessionStorage.getItem('rounded-round-buylist'));
        const totalPriceData = sessionStorage.getItem('rounded-round-buyTotalPrice');
        setCustomers(buyData ? buyData : []);
        setTotalPrice(totalPriceData*1);


        setLoading(false);
    }, [router.query]);

    const onPaySongs = () => {
        if (customers.length === 0) {
            toast.current.show({
              severity: 'warn', 
              summary: '결제 실패!', 
              detail: '구입할 곡 정보에 담긴 곡이 없습니다.', 
              life: 3000
            });
            return;
        }

        confirmDialog({
          header: '결제 확인',
          icon: 'pi pi-exclamation-triangle',
          message: `가격은 총 ${formatUnitEachThousand(totalPrice)}원 입니다.\n정말 결제하시겠습니까?`,
          position: 'top',
          accept: () => {
            let payList = JSON.parse(sessionStorage.getItem('rounded-round-buylist'));
            const payId = `ORD-${uuidv4()}`;
            payList.forEach(item => {
                item.payId = payId;
                item.uid = router.query.uid;
                item.payDate = Date.now();
            });

            try {
                const payObj = getPayInformation(payList, totalPrice);
                IMP.init(process.env.NEXT_PUBLIC_IAMPORT_IDENTIFICATION_CODE);
                IMP.request_pay(payObj, (rsp) => {
                    if (rsp.success) {
                        sessionStorage.removeItem('rounded-round-buylist');
                        sessionStorage.setItem('rounded-round-payprice', totalPrice);
                        payList.forEach(item => {
                            dispatch(createBuyHistoryThunk(item));
                        });
                        router.replace({
                            pathname: `/purchase/${router.query.uid}/payResult/${payId}`,
                            query: { uid: router.query.uid, payId: payId },
                        },
                            `/purchase/${router.query.uid}/payResult/${payId}`,
                        );
                    } else {
                        toast.current.show({
                          severity: 'warn', 
                          summary: '결제 실패!', 
                          detail: '결제를 취소 하였습니다.', 
                          life: 3000
                        });
                    }
                });
            } catch (error) {
                console.log("error", error);
                toast.current.show({
                  severity: 'error', 
                  summary: '결제 실패!', 
                  detail: '오류로 인해 결제할 수 없습니다.', 
                  life: 3000
                });
            }
          },
          reject: () => { return } 
        });
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

    const songPriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.price ?
                    (
                        <h4>{formatUnitEachThousand(rowData.price)}원</h4>
                    ) : (
                        <h4 className="text-600">
                            {formatUnitEachThousand(rowData.price)}원
                            <Badge className="ml-1" value="재구입" />
                        </h4>
                    )
                }
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            {customers ? (
                <div className="datatable-doc-demo">
                    <div className="card surface-0 p-5 border-round-2xl">
                        <h1 className="ml-3 mt-0 mb-0">구입할 곡 정보</h1>
                        <Divider className="w-20rem" />
                        <h3 className="ml-3">반영된 총 금액 : {formatUnitEachThousand(totalPrice)}원</h3>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <DataTable 
                          value={customers} className="p-datatable-customers" header={header} rows={customers ? customers.length : 0}
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
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
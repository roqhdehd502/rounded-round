import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { ellipsisText, formatUnitEachThousand } from '../../../commons/functional/filters';


cartList.layout = "L1";
export default function cartList() {
    const router = useRouter();

    const toast = useRef(null);

    const [customers, setCustomers] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const outstandingSongs = sessionStorage.getItem('rounded-round-buylist');
        if (outstandingSongs) {
            confirmDialog({
              header: '장바구니 이동',
              icon: 'pi pi-exclamation-triangle',
              message: `현재 구입 페이지에 결제하지 않은 곡이 있습니다.\n구입 페이지로 이동하시겠습니까?`,
              position: 'top',
              accept: () => {
                router.replace(`/purchase/${router.query.uid}/buyInfo`);
              },
              reject: () => { 
                sessionStorage.removeItem('rounded-round-buylist');
              } 
            });
        }

        const data = JSON.parse(sessionStorage.getItem('rounded-round-cartlist'));
        setCustomers(data ? data : []);
        setSelectedPrice(selectedCustomers ? selectedCustomers.length : 0);
        setLoading(false);
    }, [selectedCustomers]);

    const onRemoveCart = () => {
        if (selectedCustomers.length === 0) {
            toast.current.show({
              severity: 'warn', 
              summary: '장바구니 삭제 실패!', 
              detail: '장바구니에서 삭제 하실 곡을 선택해주십시오.', 
              life: 3000
            });
            return;
        }

        confirmDialog({
          header: '장바구니 이력 삭제',
          icon: 'pi pi-exclamation-triangle',
          acceptClassName: 'p-button-danger',
          message: `정말 삭제 하시겠습니까?`,
          position: 'top',
          accept: () => {
            const map = new Map();
            const beforeCartList = JSON.parse(sessionStorage.getItem('rounded-round-cartlist'));
            const selectedRemoveCartList = selectedCustomers;
            let diffCartList = [];

            for (let i=0; i<beforeCartList.length; i++) {
                for (let j=0; j<selectedRemoveCartList.length; j++) {
                    if (beforeCartList[i].id !== selectedRemoveCartList[j].id) {
                        diffCartList.push(beforeCartList[i]);
                    }
                }
            }
            
            for (const item of diffCartList) {
                map.set(JSON.stringify(item), item);
            }

            const afterCartList = [...map.values()];
            sessionStorage.removeItem('rounded-round-cartlist');
            sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(afterCartList));
            setCustomers(afterCartList);
          },
          reject: () => { return } 
        });
    }

    const onBuySongs = () => {
        if (customers === null) {
            toast.current.show({
              severity: 'warn', 
              summary: '구입 실패!', 
              detail: '장바구니에 담긴 곡이 없습니다.', 
              life: 3000
            });
            return;
        }

        if (selectedCustomers.length === 0) {
            toast.current.show({
              severity: 'warn', 
              summary: '구입 실패!', 
              detail: '구입하실 곡을 선택해주십시오.', 
              life: 3000
            });
            return;
        }

        confirmDialog({
          header: '결제 확인',
          icon: 'pi pi-exclamation-triangle',
          message: `가격은 총 ${formatUnitEachThousand(selectedPrice * 800)}원 입니다.\n정말 구입하시겠습니까?`,
          position: 'top',
          accept: () => {
            const map = new Map();
            const beforeCartList = JSON.parse(sessionStorage.getItem('rounded-round-cartlist'));
            const selectedBuySongsList = selectedCustomers;
            let diffCartList = [];

            for (let i=0; i<beforeCartList.length; i++) {
                for (let j=0; j<selectedBuySongsList.length; j++) {
                    if (beforeCartList[i].id !== selectedBuySongsList[j].id) {
                        diffCartList.push(beforeCartList[i]);
                    }
                }
            }
            
            for (const item of diffCartList) {
                map.set(JSON.stringify(item), item);
            }

            const afterCartList = [...map.values()];
            console.log("afterCartList", afterCartList);
            sessionStorage.removeItem('rounded-round-cartlist');
            sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(afterCartList));
            sessionStorage.setItem('rounded-round-buylist', JSON.stringify(selectedBuySongsList));
            router.replace(`/purchase/${router.query.uid}/buyInfo`); 
          },
          reject: () => { return } 
        });
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button 
                      icon="pi pi-shopping-bag" 
                      label="구입"
                      className="mr-3 p-button-rounded p-button-outlined mr-3 p-button-success"
                      onClick={() => onBuySongs()}
                    />
                    <Button 
                      icon="pi pi-trash" 
                      label="장바구니 삭제"
                      className="p-button-rounded p-button-outlined mr-3 p-button-danger"
                      onClick={() => onRemoveCart()} 
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
            <Toast ref={toast} />
            <ConfirmDialog />

            {selectedCustomers ? (
                <div className="datatable-doc-demo">
                    <div className="card surface-0 p-5 border-round-2xl">
                        <h1 className="ml-3 mt-0 mb-6">장바구니</h1>
                        <h3 className="ml-3">선택된 곡 가격 : {formatUnitEachThousand(selectedPrice * 800)}원</h3>
                        <h3 className="ml-3">할인가 : 0원</h3>
                        <Divider className="w-20rem" />
                        <h3 className="ml-3">총 : {formatUnitEachThousand(selectedPrice * 800)}원</h3>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <DataTable 
                          value={customers} className="p-datatable-customers" header={header} rows={customers ? customers.length : 0}
                          dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                          emptyMessage="장바구니에 담긴 곡이 없습니다."
                          loading={loading} responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" selectionAriaLabel="songName" headerStyle={{ minWidth: '1em' }} />
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
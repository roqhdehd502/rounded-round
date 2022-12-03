import { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { LoadingComponent } from '../../../components/commons/loadingComponent';

import { ellipsisText, timeCounter } from '../../../commons/functional/filters';

import { getCustomerBuyHistoriesThunk, deleteBuyHistoryThunk } from '../../../store/modules/purchaseInfo';


buyHistory.layout = "L1";
export default function buyHistory() {
    const dispatch = useDispatch();
    const router = useRouter();

    const toast = useRef(null);

    const customerBuyHistories = useSelector(({ purchaseInfo }) => purchaseInfo.customerBuyHistories);

    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getCustomerBuyHistoriesThunk(router.query.uid)); 
        setLoading(false);
    }, [router.query]);

    const onRemoveBuyHistory = () => {
        if (!selectedCustomers) {
            toast.current.show({
              severity: 'error', 
              summary: '삭제 실패!', 
              detail: '기록에서 삭제 하실 곡을 선택해주십시오.', 
              life: 3000
            });
            return;
        }

        confirmDialog({
          header: '구입 이력 삭제',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          message: '삭제 후 무료로 재구입이 불가능합니다. 정말 삭제 하시겠습니까?',
          position: 'top',
          accept: () => {
            try {
                selectedCustomers.forEach(item => {
                    dispatch(deleteBuyHistoryThunk(item.docId));
                });
            } catch (error) {
                alert("구입 한 노래를 삭제 할 수 없습니다!");
            }
          },
          reject: () => { return } 
        });
    }

    const onReDownloadSongs = () => {
        if (!customerBuyHistories) {
            toast.current.show({
              severity: 'error', 
              summary: '다운로드 실패!', 
              detail: '회원님이 구입하신 곡이 없습니다.', 
              life: 3000
            });
            return;
        }

        if (!selectedCustomers) {
            toast.current.show({
              severity: 'error', 
              summary: '다운로드 실패!', 
              detail: '다운로드 하실 곡을 선택해주십시오.', 
              life: 3000
            });
            return;
        }

        confirmDialog({
          header: '다운로드',
          icon: 'pi pi-exclamation-triangle',
          message: '다시 다운로드 하시겠습니까?',
          position: 'top',
          accept: () => {
            console.log('재다운로드 정보 세션에 담고 페이지로 이동!');
          },
          reject: () => { return } 
        });
    }    

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button 
                      icon="pi pi-download" 
                      label="재 다운로드" 
                      className="mr-3 p-button-rounded p-button-outlined mr-3 p-button-success"
                      onClick={() => onReDownloadSongs()}
                    />
                    <Button 
                      icon="pi pi-trash" 
                      label="기록 삭제" 
                      className="p-button-rounded p-button-outlined mr-3 p-button-danger"
                      onClick={() => onRemoveBuyHistory()}
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

    const buyDateBodyTemplate = (rowData) => {
        return (
            <>
                <label>{timeCounter(rowData.payDate)}</label>
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            {customerBuyHistories ? (
                <div className="datatable-doc-demo">
                    <div className="card surface-0 p-5 border-round-2xl">
                        <h1 className="ml-3 mt-0 mb-0">내가 구입한 노래</h1>
                        <DataTable 
                          value={customerBuyHistories} className="p-datatable-customers" header={header} rows={customerBuyHistories ? customerBuyHistories.length : 0}
                          dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                          emptyMessage="회원님이 구입한 곡이 없습니다."
                          loading={loading} responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" selectionAriaLabel="songName" headerStyle={{ minWidth: '1em' }} />
                            <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                            <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column field="albumName" header="앨범" body={albumNameBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column header="구입한 날짜" body={buyDateBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
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
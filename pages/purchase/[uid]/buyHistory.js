import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { getCarts } from '../../../service';

import { ellipsisText, timeCounter } from '../../../commons/functional/Filters';


BuyHistory.layout = "L1";
export default function BuyHistory() {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getCarts().sort((a, b) => { return b.uploadDate - a.uploadDate });
        setCustomers(data); 
        setLoading(false);
    }, []);

    const onRemoveBuyHistory = () => {
        if (!selectedCustomers) {
            alert('기록에서 삭제 하실 곡을 선택해주십시오!');
            return;
        }

        if (confirm('정말 삭제 하시겠습니까?')) {
            console.log("엘리먼트 삭제하고 해당 DB 수정!");
        }
    }

    const onReDownloadSongs = () => {
        if (!customers) {
            alert('회원님이 구입하신 곡이 없습니다!');
            return;
        }

        if (!selectedCustomers) {
            alert('다운로드 하실 곡을 선택해주십시오!');
            return;
        }

        if (confirm('다시 다운로드 하시겠습니까?')) {
            console.log('재다운로드 정보 세션에 담고 페이지로 이동!');
        }
    }    

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button 
                      className="mr-3 p-button-rounded p-button-success"
                      label="재 다운로드" 
                      onClick={() => onReDownloadSongs()}
                    />
                    <Button 
                      className="p-button-rounded p-button-danger"
                      label="기록 삭제" 
                      onClick={() => onRemoveBuyHistory()}
                    />  
                </div>
            </div>
        )
    }

    const thumbnailBodyTemplate = (rowData) => {
        return <img alt={rowData.albumName} src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={50} height={50} />;
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
                <label>{timeCounter(rowData.uploadDate)}</label>
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h1 className="ml-3 mt-0 mb-0">내가 구입한 노래</h1>
                    <DataTable 
                      value={customers} className="p-datatable-customers" header={header} rows={getCarts().length}
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
        </>
    );
}
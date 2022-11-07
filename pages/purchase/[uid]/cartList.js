import { useState, useEffect } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { getCarts } from '../../../service';

import { ellipsisText } from '../../../commons/functional/filters';


cartList.layout = "L1";
export default function cartList() {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getCarts();
        setCustomers(getCustomers(data)); 
        setLoading(false);
    }, []);

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.uploadDate = new Date(d.uploadDate);
            return d;
        });
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button 
                      className="mr-3 p-button-rounded p-button-success"
                      label="모두 구입" 
                    />
                    <Button 
                      className="p-button-rounded p-button-danger"
                      label="모두 삭제" 
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

    const buyIndividualBodyTemplate = (rowData) => {
        return (
            <>
                <Button 
                  icon="pi pi-dollar"
                  className="p-button-success"
                />
            </>
        );
    }

    const removeIndividualCartBodyTemplate = (rowData) => {
        return (
            <>
                <Button 
                  icon="pi pi-trash"
                  className="p-button-danger"
                />
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h1 className="ml-3 mt-0 mb-0">장바구니</h1>
                    <DataTable 
                      value={customers} className="p-datatable-customers" header={header} rows={getCarts().length}
                      dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                      emptyMessage="장바구니에 담긴 곡이 없습니다."
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column field="albumName" header="앨범" body={albumNameBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column header="개별구매" body={buyIndividualBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        <Column header="기록삭제" body={removeIndividualCartBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}
import { useState, useEffect } from 'react';

import Image from 'next/image';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { getSongs } from '../../service';

import { DialogCommon } from '../../commons/primereact/DialogCommon';
import { ellipsisText, formatUnitEachThousand, timeCounter } from '../../commons/functional/Filters';


NewList.layout = "L1";
export default function NewList() {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'artistName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'songName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'albumName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);    

    useEffect(() => {
        const data = getSongs();
        setCustomers(getCustomers(data).slice(0,200)); 
        setLoading(false);
    }, []);

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.uploadDate = new Date(d.uploadDate);
            return d;
        });
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div className="text-400">
                    <h6 className="mt-0 mb-0"><i className="pi pi-exclamation-circle mr-2" />최신 음악 페이지에서는 최신 순으로 200곡까지 보실 수 있습니다.</h6>
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText className="w-20rem" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="가수 / 곡 / 앨범 명 검색" />
                </span>
            </div>
        )
    }

    const uploadDateBodyTemplate = (rowData) => {
        return timeCounter(rowData.uploadDate);
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

    const likesBodyTemplate = (rowData) => {
        const formatlikes = formatUnitEachThousand(rowData.likes)
        return (
          <>
              <i className="ml-0 mr-2 pi pi-heart-fill"></i>{formatlikes}
          </>
        );
    }

    const listenBodyTemplate = (rowData) => {
        return (
            <>
                <DialogCommon
                  icon="pi pi-caret-right"
                  header={rowData.songName}
                  youtubeURL={rowData.youtubeURL}
                />
            </>
        );
    }

    const putInBodyTemplate = () => {
        return <Button icon="pi pi pi-plus"></Button>;
    }

    const downloadBodyTemplate = () => {
        return <Button icon="pi pi-download"></Button>;
    }

    const header = renderHeader();

    return (
        <>
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h1 className="ml-3 mt-0 mb-0">최신 음악</h1>
                    <DataTable 
                      value={customers} className="p-datatable-customers" header={header} rows={10}
                      dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                      paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                      currentPageReportTemplate="{first} / {last} of {totalRecords}"
                      filters={filters} filterDisplay="menu" globalFilterFields={['artistName', 'songName', 'albumName']} emptyMessage="검색 결과를 찾을 수 없습니다."
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" selectionAriaLabel="songName" headerStyle={{ minWidth: '1em' }}></Column>
                        <Column field="uploadDate" header="발매" body={uploadDateBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column field="albumName" header="앨범" body={albumNameBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column field="likes" body={likesBodyTemplate} header="추천수" dataType="numeric" headerStyle={{ minWidth: '5rem'}} bodyStyle={{ minWidth: '5rem'}} />
                        <Column header="듣기" body={listenBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        <Column header="담기" body={putInBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        <Column header="다운" body={downloadBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}
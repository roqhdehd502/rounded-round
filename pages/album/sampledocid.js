import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { getSongs } from '../../service';

import { DialogCommon } from '../../commons/primereact/DialogCommon';
import { ellipsisText, formatUnitEachThousand } from '../../commons/functional/filters';


albumDetail.layout = "L1";
export default function albumDetail() {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'cdNumber', order: 1 }, { field: 'albumTrackNumber', order: 1 }]);
    const [loading, setLoading] = useState(true);    

    useEffect(() => {
        const data = getSongs();
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
                      icon="pi pi-plus" 
                      label="담기" 
                      className="p-button-rounded p-button-outlined mr-3"
                    />
                    <Button 
                      icon="pi pi-download" 
                      label="다운" 
                      className="p-button-rounded p-button-outlined"
                    />
                </div>
            </div>
        )
    }

    const cdNumberBodyTemplate = (rowData) => {
        return `${rowData.cdNumber}CD`;
    }

    const albumTrackNumberBodyTemplate = (rowData) => {
        return rowData.albumTrackNumber;
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
        return <Button icon="pi pi-plus" />;
    }

    const downloadBodyTemplate = () => {
        return <Button icon="pi pi-download" />;
    }

    const header = renderHeader();  


    return (
        <>
            <div className="mb-5 card surface-0 p-5 border-round-2xl">
                <h1 className="ml-3 mt-0 mb-3">앨범 정보</h1>
                <div className="grid">
                    <div className="col-4 md:col-4 sm:col-12">
                        <img className="w-auto max-w-20rem" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                    </div>
                    <div className="col-8 md:col-8 sm:col-12">
                        <div className="grid">
                            <div className="col-12">
                                <h3 className="mb-0">Mr. Morale {'&'} The Big Steppers</h3>
                            </div>
                            <div className="col-12">
                                <h3 className="mt-0">Kendrick Lamar</h3>
                            </div>
                            <div className="col-2">
                                <label>발매일</label>
                            </div>
                            <div className="col-10">
                                <label>2022/05/13</label>
                            </div>
                            <div className="col-2">
                                <label>장르</label>
                            </div>
                            <div className="col-10">
                                <label>Hip-Hop</label>
                            </div>
                            <div className="col-2">
                                <label>발매사</label>
                            </div>
                            <div className="col-10">
                                <label>Interscope Records</label>
                            </div>
                            <div className="col-2">
                                <label>기획사</label>
                            </div>
                            <div className="col-10">
                                <label>TDE, pgLang</label>
                            </div>
                            <div className="col-12">
                                <h3><i className="mr-2 pi pi-heart"></i>965</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="mb-1">수록곡</h2>
                    <DataTable 
                      value={customers} className="p-datatable-customers" header={header} rows={10}
                      dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                      sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                      paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                      currentPageReportTemplate="{first} / {last} of {totalRecords}"
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" selectionAriaLabel="songName" headerStyle={{ minWidth: '1em' }} />
                        <Column field="cdNumber" header="CD" body={cdNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="albumTrackNumber" header="트랙" body={albumTrackNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
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
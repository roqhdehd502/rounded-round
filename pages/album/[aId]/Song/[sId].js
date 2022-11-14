import { useState, useEffect } from 'react';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { DialogCommon } from '../../../../commons/primereact/DialogCommon';
import { ellipsisText, formatUnitEachThousand } from '../../../../commons/functional/Filters';

import { getSongsInAlbum, getSong } from '../../../../service';


SongDetail.layout = "L1";
export default function SongDetail() {
    const router = useRouter();

    const [songObj, setSongObj] = useState();
    const [songsInAlbum, setSongsInAlbum] = useState([]);

    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'cdNumber', order: 1 }]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSongObj(getSong(router.query.sId));
        setSongsInAlbum(getSongsInAlbum(router.query.aId));

        setLoading(false);
    }, [router.query, songObj]);

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center"></div>
        )
    }

    const cdNumberBodyTemplate = (rowData) => {
        return `${rowData.cdNumber}CD`;
    }

    const albumTrackNumberBodyTemplate = (rowData) => {
        return rowData.albumTrackNumber;
    }

    const thumbnailBodyTemplate = (rowData) => {
        return <img alt={rowData.albumName} src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}  width={50} height={50} />;
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

    const detailBodyTemplate = (rowData) => {
        return (
            <>
                <Link
                  href={{
                    pathname: `/Album/${router.query.aId}/Song/${rowData.id}`,
                    query: { aId: router.query.aId, sId: rowData.id },
                  }}
                  as={`/Album/${router.query.aId}/Song/${rowData.id}`}
                >
                    <Button icon="pi pi-search" />
                </Link>
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

    const header = renderHeader();    

    return (
        <>
            {songObj ? (
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="mb-3">곡 정보</h2>
                    <div className="grid">
                        <div className="col-4 md:col-4 sm:col-12">
                            <img className="w-auto max-w-20rem" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                        </div>
                        <div className="col-8 md:col-8 sm:col-12">
                            <div className="grid">
                                <div className="col-12">
                                    <h3 className="mb-0">{songObj.songName}</h3>
                                </div>
                                <div className="col-12">
                                    <h3 className="mt-0">{songObj.artistName}</h3>
                                </div>
                                <div className="col-2">
                                    <label>앨범</label>
                                </div>
                                <div className="col-10">
                                    <label>{songObj.albumName}</label>
                                </div>
                                <div className="col-2">
                                    <label>장르</label>
                                </div>
                                <div className="col-10">
                                    <label>{songObj.genre}</label>
                                </div>
                                <div className="col-2">
                                    <label>작사</label>
                                </div>
                                <div className="col-10">
                                    <label>{songObj.lyricistName}</label>
                                </div>
                                <div className="col-2">
                                    <label>작곡</label>
                                </div>
                                <div className="col-10">
                                    <label>{songObj.songwriterName}</label>
                                </div>
                                <div className="col-2">
                                    <label>편곡</label>
                                </div>
                                <div className="col-10">
                                    <label>{songObj.arrangerName}</label>
                                </div>
                                <div className="col-12">
                                    <h3><i className="mr-2 pi pi-heart"></i>{songObj.likes}</h3>
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
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-content-center align-content-center min-h-screen">
                    <div>
                        <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                    </div>
                </div>
            )}

            <div className="mt-4 mb-4"></div>
                        
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="mb-1">이 앨범의 다른 곡</h2>
                    <DataTable 
                      value={songsInAlbum} className="p-datatable-customers" header={header} rows={10}
                      dataKey="id" rowHover
                      sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                      paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                      currentPageReportTemplate="{first} / {last} of {totalRecords}"
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column field="cdNumber" header="CD" body={cdNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="albumTrackNumber" header="트랙" body={albumTrackNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="songName" header="곡정보" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column field="likes" body={likesBodyTemplate} header="추천수" dataType="numeric" headerStyle={{ minWidth: '5rem'}} bodyStyle={{ minWidth: '5rem'}} />
                        <Column header="상세" body={detailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        <Column header="듣기" body={listenBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}  
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { LoadingComponent } from '../../../components/commons/loadingComponent';

import { DialogCommon } from '../../../commons/primereact/DialogCommon';
import { ellipsisText, formatUnitEachThousand, timeFormatting } from '../../../commons/functional/filters';

import { getAlbum, getSongsInAlbum } from '../../../service';

// import * as AlbumActions from '../../store/modules/AlbumsInfo';


albumDetail.layout = "L1";
export default function albumDetail() {
    // const dispatch = useDispatch();
    const router = useRouter();

    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);

    const toast = useRef(null);

    // const albumObj = useSelector(({ AlbumsInfo }) => AlbumsInfo.albumObj);
    // const songsInAlbum = useSelector(({ AlbumsInfo }) => AlbumsInfo.songsInAlbum);
    const [albumObj, setAlbumObj] = useState(null);
    const [songsInAlbum, setSongsInAlbum] = useState([]);

    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'cdNumber', order: 1 }]);
    const [loading, setLoading] = useState(true);    

    useEffect(() => {
        //if (!router.isReady) return; 

        //dispatch(AlbumActions.getAlbumObj(router.query.aId));
        //dispatch(AlbumActions.getSongsInAlbum(router.query.aId));
        setAlbumObj(getAlbum(router.query.aId));
        setSongsInAlbum(getSongsInAlbum(router.query.aId));

        setLoading(false);
    }, [router.query, albumObj]);

    const onPutInCart = () => {
        if (!selectedCustomers || !selectedCustomers.length) {
            toast.current.show({
              severity: 'error', 
              summary: '???????????? ?????? ??????!', 
              detail: '?????? ?????? ???????????????.', 
              life: 3000
            });
            return;
        }
        
        confirmDialog({
          header: '???????????? ??????',
          icon: 'pi pi-exclamation-triangle',
          message: '?????? ??????????????? ??????????????????????',
          position: 'top',
          accept: () => {
            const cartList = [...selectedCustomers];

            if (sessionStorage.getItem('rounded-round-cartlist')) {
                let beforeCartList = JSON.parse(sessionStorage.getItem('rounded-round-cartlist'));
                beforeCartList.push(...cartList);
                const afterCartList = beforeCartList.filter(
                  (arr, index, callback) => index === callback.findIndex(t => t.id === arr.id)
                );
                sessionStorage.removeItem('rounded-round-cartlist');
                sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(afterCartList));
            } else {
                sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(cartList));
            }

            confirmPushToCartList();
          },
          reject: () => { return } 
        });
    }

    const confirmPushToCartList = () => {
        if (confirm('??????????????? ?????? ?????? ??????????????????.\n?????? ???????????? ?????????????????????????')) {
            router.push(`/purchase/${customerObj.uid}/cartList`);
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                {customerObj ? (
                    <div>
                        <Button 
                          icon="pi pi-shopping-cart" 
                          label="??????" 
                          className="p-button-rounded p-button-outlined mr-3"
                          onClick={() => onPutInCart()}
                        />
                        <Button 
                          icon="pi pi-download" 
                          label="??????" 
                          className="p-button-rounded p-button-outlined"
                        />
                    </div>
                ) : (  
                    <Link href={`/auth/signIn`}>
                        <Button 
                          icon="pi pi-unlock"
                          label="????????? ??? ????????????"  
                          className="p-button-rounded p-button-outlined"
                        />
                    </Link>
                )}
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
                    pathname: `/album/${router.query.aId}/song/${rowData.id}`,
                    query: { aId: router.query.aId, sId: rowData.id },
                  }}
                  as={`/album/${router.query.aId}/song/${rowData.id}`}
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
            <Toast ref={toast} />
            <ConfirmDialog />

            {albumObj ? (
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="mb-3">?????? ??????</h2>
                    <div className="grid">
                        <div className="col-4 md:col-4 sm:col-12">
                            <Image alt={albumObj.albumName} src={albumObj.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={320} height={320} quality={100} />
                        </div>
                        <div className="col-8 md:col-8 sm:col-12">
                            <div className="grid">
                                <div className="col-12">
                                    <h3 className="mb-0">{albumObj.albumName}</h3>
                                </div>
                                <div className="col-12">
                                    <h3 className="mt-0">{albumObj.artistName}</h3>
                                </div>
                                <div className="col-2">
                                    <label>?????????</label>
                                </div>
                                <div className="col-10">
                                    <label>{timeFormatting(albumObj.uploadDate)}</label>
                                </div>
                                <div className="col-2">
                                    <label>??????</label>
                                </div>
                                <div className="col-10">
                                    <label>{albumObj.genre}</label>
                                </div>
                                <div className="col-2">
                                    <label>?????????</label>
                                </div>
                                <div className="col-10">
                                    <label>{albumObj.publishingCompany}</label>
                                </div>
                                <div className="col-2">
                                    <label>?????????</label>
                                </div>
                                <div className="col-10">
                                    <label>{albumObj.agency}</label>
                                </div>
                                <div className="col-12">
                                    <h3><i className="mr-2 pi pi-heart"></i>{albumObj.likes}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}

            <div className="mt-4 mb-4"></div>
            
            <div className="datatable-doc-demo">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="mb-1">?????????</h2>
                    <DataTable 
                      value={songsInAlbum} className="p-datatable-customers" header={header} rows={10}
                      dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                      sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                      paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                      currentPageReportTemplate="{first} / {last} of {totalRecords}"
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" selectionAriaLabel="songName" headerStyle={{ minWidth: '1em' }} />
                        <Column field="cdNumber" header="CD" body={cdNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="albumTrackNumber" header="??????" body={albumTrackNumberBodyTemplate} headerStyle={{ minWidth: '1rem', textAlign: 'center'}} bodyStyle={{ minWidth: '1rem'}} sortable />
                        <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                        <Column field="songName" header="?????????" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                        <Column field="likes" body={likesBodyTemplate} header="?????????" dataType="numeric" headerStyle={{ minWidth: '5rem'}} bodyStyle={{ minWidth: '5rem'}} />
                        <Column header="??????" body={detailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                        <Column header="??????" body={listenBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}  
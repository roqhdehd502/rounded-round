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

import { LoadingComponent } from '../../../components/commons/loadingComponent';

import { ellipsisText, formatUnitEachThousand } from '../../../commons/functional/filters';

import { getCustomerBuyHistoriesThunk } from '../../../store/modules/purchaseInfo';


cartList.layout = "L1";
export default function cartList() {
    const dispatch = useDispatch();
    const router = useRouter();

    const customerBuyHistories = useSelector(({ purchaseInfo }) => purchaseInfo.customerBuyHistories);
    /** 할인가 store 기능 구현되면 useSelector로 적용 */
    const songPriceOff = 800;

    const toast = useRef(null);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
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
        dispatch(getCustomerBuyHistoriesThunk(router.query.uid))
          .then((result) => {
              if (result) setCustomers(isBoughtSongInData(data, result.payload)); 
          })
        
        setSelectedPrice(selectedCustomers ? selectedPriceInSong(selectedCustomers) : 0);
        setTotalPrice(selectedCustomers ? selectedTotalPriceInSong(selectedCustomers, songPriceOff) : 0)
        setLoading(false);
    }, [router.query, customers.length ? customers[0].id : [], selectedCustomers]);

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
            let remaincartList = customers;
            const selectedRemoveCartList = selectedCustomers;

            for (let i=0; i<remaincartList.length; i++) {
                for (let j=0; j<selectedRemoveCartList.length; j++) {
                    if (remaincartList[i].id === selectedRemoveCartList[j].id) {
                        remaincartList.splice(i, 1);
                    }
                }
            }
            
            sessionStorage.removeItem('rounded-round-cartlist');
            sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(remaincartList));
            setCustomers(remaincartList ? remaincartList : []);
            setSelectedCustomers([]);
            setSelectedPrice(0);
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
          message: `가격은 총 ${formatUnitEachThousand(totalPrice)}원 입니다.\n정말 구입하시겠습니까?`,
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
            sessionStorage.removeItem('rounded-round-cartlist');
            sessionStorage.setItem('rounded-round-cartlist', JSON.stringify(afterCartList));
            sessionStorage.setItem('rounded-round-buylist', JSON.stringify(selectedBuySongsList));
            sessionStorage.setItem('rounded-round-buyTotalPrice', totalPrice);
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
    };

    const isBoughtSongInData = (cartData, payload) => {
        let result = cartData;
        if (result && payload) {
            result.forEach(songItem => {
              payload.forEach(historySongItem => {
                    if (songItem.id === historySongItem.id) songItem.price = 0;
                });
            });
        }

        return result ? result : [];
    }

    const selectedPriceInSong = (selectedCartData) => {
        let result = 0;
        selectedCartData.forEach(item => {
            result += item.price;
        });

        return result;
    }

    const selectedTotalPriceInSong = (selectedCartData, priceOff) => {
        let result = 0;
        selectedCartData.forEach(item => {
            result += item.price;
        });

        return (result - priceOff) >= 0 ? result - priceOff : 0;
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
                        <h3 className="ml-3">선택된 곡 가격 : {formatUnitEachThousand(selectedPrice)}원</h3>
                        <h3 className="ml-3">할인가 : {formatUnitEachThousand(songPriceOff)}원</h3>
                        <Divider className="w-20rem" />
                        <h3 className="ml-3">총 : {formatUnitEachThousand(totalPrice)}원</h3>
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
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';
import Image from 'next/image';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';

import { LoadingComponent } from '../../../../components/commons/loadingComponent';

import { ellipsisText, formatUnitEachThousand, timeFormatting } from '../../../../commons/functional/filters';

import { getBuyHistoriesThunk } from '../../../../store/modules/purchaseInfo';


payResultInfo.layout = "L1";
export default function payResultInfo() {
    const dispatch = useDispatch();
    const router = useRouter();

    const buyHistories = useSelector(({ purchaseInfo }) => purchaseInfo.buyHistories);

    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const priceData = sessionStorage.getItem('rounded-round-payprice');
        dispatch(getBuyHistoriesThunk(router.query.payId));
        setTotalPrice(priceData*1);
        setLoading(false);
    }, [router.query]);

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <div></div>
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
                        <h4>{formatUnitEachThousand(rowData.price)}???</h4>
                    ) : (
                        <h4 className="text-600">
                            {formatUnitEachThousand(rowData.price)}???
                            <Badge className="ml-1" value="?????????" />
                        </h4>
                    )
                }
            </>
        );
    }

    const header = renderHeader();

    return (
        <>
            {buyHistories ? (
                <div className="datatable-doc-demo min-h-screen">
                    <div className="card surface-0 p-5 border-round-2xl">
                        <h1 className="ml-3 mt-0 mb-0">????????? ??? ??????</h1>
                        <Divider className="w-20rem" />
                        <h3 className="ml-3">????????? ?????? : {router.query.payId}</h3>
                        <h3 className="ml-3">????????? ?????? : {timeFormatting(Date.now())}</h3>
                        <h3 className="ml-3">??? : {formatUnitEachThousand(totalPrice)}???</h3>
                    </div>
                    <div className="mt-4 mb-4"></div>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <DataTable 
                          value={buyHistories} className="p-datatable-customers" header={header} rows={buyHistories.length}
                          dataKey="id" rowHover 
                          emptyMessage="????????? ??? ????????? ?????? ?????? ????????????."
                          loading={loading} responsiveLayout="scroll"
                        >
                            <Column field="thumbnail" body={thumbnailBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ minWidth: '1rem'}} />
                            <Column field="songName" header="?????????" body={songInformationBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column field="albumName" header="??????" body={albumNameBodyTemplate} headerStyle={{ minWidth: '14rem' }} bodyStyle={{ minWidth: '14rem' }} />
                            <Column header="??????" body={songPriceBodyTemplate} headerStyle={{ minWidth: '1rem'}} bodyStyle={{ overflow: 'visible' }} />
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
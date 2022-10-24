import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { TabMenu } from 'primereact/tabmenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { SongService } from '../../../../service/SongService';


userCommunity.layout = "L1";
export default function userCommunity() {
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(1);
    const [userObj, setUserObj] = useState({});

    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'popularCount', order: -1 }]);
    const [loading, setLoading] = useState(true);  

    const userInfoMenuItems = [{
        label: '컨텐츠',
        icon: 'pi pi-fw pi-calendar',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userContents');
        }
      },
      {
        label: '커뮤니티',
        icon: 'pi pi-fw pi-pencil',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userCommunity');
        }
      },
      {
        label: '정보',
        icon: 'pi pi-fw pi-file',
        command:(e) => {
            router.push('/user/userInfo/sampleuid/userProfile');
        }
      },
    ];

    const songService = new SongService();

    useEffect(() => {
        const data = songService.getCustomersLarge();
        setCustomers(getCustomers(data)); setLoading(false);
    }, []);

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.uploadDate = new Date(d.uploadDate);
            return d;
        });
    }

    const contentBodyTemplate = (rowData) => {
        return (
            <>
                <div className="grid align-content-center align-items-center justify-content-center">
                    <div className="col-12">
                        <img className="max-w-30rem image-align-center" src={rowData.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                    </div>
                    <div className="col-12 pl-5 pr-5">
                        <p className="text-xl white-space-normal">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                </div>
            </>
        ); 
    }

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-30rem">
                    <div className="field p-fluid">
                        <img className="border-circle w-15rem h-15rem image-align-center" alt={userObj.userNickName} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRr0YlatAy-hrNCQjzZ7fqDzNiXt7HGmzVaA&usqp=CAU" onError={(e) => e.target.src = '/img/user-logo.png'} />
                    </div>
                    <h1 className="flex justify-content-center">김라운디드</h1>
                </div>
            </div>
            <div className="flex align-content-center align-items-center justify-content-center mb-3">
                <div className="card w-auto">
                    <TabMenu model={userInfoMenuItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                </div>
            </div>    

            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-auto">
                    <DataTable 
                      value={customers} className="p-datatable-customers" rows={10}
                      dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                      paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      currentPageReportTemplate="{first} / {last} of {totalRecords}"
                      sortMode="multiple" removableSort multiSortMeta={multiSortMeta} onSort={(e) => setMultiSortMeta(e.multiSortMeta)}               
                      loading={loading} responsiveLayout="scroll"
                    >
                        <Column field="thumbnail" body={contentBodyTemplate} bodyStyle={{ width: 'auto'}} />
                    </DataTable>
                </div>
            </div>
        </>
    );
}
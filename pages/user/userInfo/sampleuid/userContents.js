import { useState } from 'react';
import Link from "next/Link";
import { useRouter } from 'next/router';

import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';


userContents.layout = "L1";
export default function userContents() {
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState(0);
    const [userObj, setUserObj] = useState({});

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

            <div className="flex align-content-center align-items-center justify-content-evenly">
                <div className="card w-auto">
                    <div class="grid text-700 text-center">
                        <div class="col-12">
                            <img className="w-24rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h3>MBS로 듣는 켄드릭 라마의 의식</h3>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>History Of Compton</h4>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>Good Kidd becomes Good Rapper</h4>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>Hiii Power</h4>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>Hiii Power</h4>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>Hiii Power</h4>
                        </div>
                        <div class="col-4">
                            <img className="w-10rem image-align-center" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                            <h4>Hiii Power</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
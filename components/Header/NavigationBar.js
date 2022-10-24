import { useState } from 'react';
import Link from "next/Link";
import { useRouter } from 'next/router';

import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


export const NavigationBar = () => {
    const router = useRouter();

    const [visibleLeft, setVisibleLeft] = useState(false);

    const customSidebarIcons = (
        <>
            <Link href="/">
                <img className="pt-2 mr-5" src="/img/logo.png" width='180px' />
            </Link>
        </>
    );

    const sideMenuItems = [
        {
            label: '기본메뉴',
            items: [
                {
                    label: '홈',
                    icon: 'pi pi-home',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/');
                    },
                },
                {
                    label: '인기있는 음악',
                    icon: 'pi pi-chart-bar',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/popular/popularList');
                    }
                },
                {
                    label: '최신 음악',
                    icon: 'pi pi-plus',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/new/newList');
                    }                    
                },
                {
                    label: '장르 음악',
                    icon: 'pi pi-users',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/genre/genreList');
                    }                    
                },
            ]
        },
        {
            label: '기록',
            items: [
                {
                    label: '내가 조회한 음악',
                    icon: 'pi pi-clock',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/popular/popularList');
                    } 
                },
                {
                    label: '내가 구독한 유저',
                    icon: 'pi pi-bookmark',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/popular/popularList');
                    }
                }
            ]
        },
        {
            label: '구독 바로가기',
            items: [
                {
                    label: '구독한 유저 1',
                    icon: 'pi pi-user',
                },
                {
                    label: '구독한 유저 2',
                    icon: 'pi pi-user',
                },
            ]
        },
    ];

    const leftContents = (
        <div className="ml-0 mr-0">
            <Sidebar className="sidebar-font" visible={visibleLeft} position="left" onHide={() => setVisibleLeft(false)} icons={customSidebarIcons}>
                <div className="p-inputgroup">
                    <InputText placeholder="검색" />
                    <Button icon="pi pi-search" className="p-button-primary"/>
                </div>  
                <Menu className="border-0 w-auto"  model={sideMenuItems} />
            </Sidebar>
            <Button icon="pi pi-bars" onClick={() => setVisibleLeft(true)} />
            <Link href="/">
                <img className="ml-3" src="/img/logo.png" width='180px' />
            </Link>
        </div>
    );

    const centerContents = (
        <div className='-ml-7 mr-8 w-22rem'>
            <div className="p-inputgroup">
                <InputText placeholder="검색" />
                <Button icon="pi pi-search" className="p-button-primary"/>
            </div>
        </div>
    );
    
    const isLogin = false;
    const rightContents = isLogin ? (
        // <Link href="/profile/[uid]">
            <Button icon="pi pi-user" />
        // </Link>
    ) : (
        <Link href="/auth/signIn">
            <Button label="로그인" icon="pi pi-unlock" />
        </Link>
    );

    return (
        <>
            <div className="layout-topbar">
                { leftContents }
                { centerContents }
                { rightContents }
            </div>
        </>
    );
}
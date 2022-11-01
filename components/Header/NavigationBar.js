import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import * as userInfoActions from '../../store/modules/userInfo';


export const NavigationBar = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [visibleLeft, setVisibleLeft] = useState(false);

    const logout = () => {
        dispatch(userInfoActions.userLogout());
        router.push('/');
    };

    const customSidebarIcons = (
        <>
            <Link href="/">
                <img className="pt-2 mr-5" src="/img/logo.png" width='180px' />
            </Link>
        </>
    );

    const sideMenuItemsSignOut = [
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
    ];

    const sideMenuItemsSignIn = [
        {
            label: '기록',
            items: [
                {
                    label: '내가 조회한 음악',
                    icon: 'pi pi-clock',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push({
                          pathname: `/user/${props.userObj.uid}/history`,
                          query: { ...props.userObj },
                          },
                          `/user/${props.userObj.uid}/history`,
                        );
                    } 
                },
                {
                    label: '내가 구독한 유저',
                    icon: 'pi pi-bookmark',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push({
                          pathname: `/user/${props.userObj.uid}/subscribes`,
                          query: { ...props.userObj },
                          },
                          `/user/${props.userObj.uid}/subscribes`,
                        );
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

    const sideMenuItems = props.userObj ? [...sideMenuItemsSignOut, ...sideMenuItemsSignIn] : [...sideMenuItemsSignOut];

    const leftContents = (
        <div className="ml-0 mr-0">
            <Sidebar className="sidebar-font" visible={visibleLeft} position="left" onHide={() => setVisibleLeft(false)} icons={customSidebarIcons}>
                <div className="p-inputgroup">
                    <InputText placeholder="검색" />
                    <Button icon="pi pi-search" className="p-button-primary"/>
                </div>  
                <Menu className="border-0 w-auto"  model={sideMenuItems} />
            </Sidebar>
            <Button className="mb-1" icon="pi pi-bars" onClick={() => setVisibleLeft(true)} />
            <Link href="/">
                <img className="ml-3" src="/img/logo.png" width='180px' />
            </Link>
        </div>
    );

    const centerContents = (
        <div className="ml-0 mr-8 w-22rem pc-search-input">
            <div className="p-inputgroup">
                <InputText placeholder="검색" />
                <Button icon="pi pi-search" className="p-button-primary"/>
            </div>
        </div>
    );
    
    const rightContents = props.userObj ? (
        <div className="ml-0 mr-0">
            <Link 
              href={{
                pathname: `/user/${props.userObj.uid}/userProfile`,
                query: { ...props.userObj },
              }}
              as={`/user/${props.userObj.uid}/userProfile`}
              shallow
            >
                <img className="mr-3 mt-1 border-circle" width={35} alt={props.userObj.displayName} src={props.userObj.photoURL ? props.userObj.photoURL : '/img/anonymous-user-logo.png'} onError={(e) => e.target.src = '/img/anonymous-user-logo.png'} />
            </Link>
            <Button className="mb-1" label="로그아웃" icon="pi pi-lock" onClick={() => logout()} />
        </div>
    ) : (
        <div className="ml-0 mr-0">
            <Link href="/auth/signIn">
                <Button label="로그인" icon="pi pi-unlock" />
            </Link>
        </div>
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
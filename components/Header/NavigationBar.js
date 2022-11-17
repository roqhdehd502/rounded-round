import { useState, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import ProjectContext from '../../context';

import * as UserInfoActions from '../../store/modules/UserInfo';


export const NavigationBar = (props) => {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();
    
    const UserProfileItem = useRef(null);

    const [visibleLeft, setVisibleLeft] = useState(false);

    const customSidebarIcons = (
        <>
            <Link href="/">
                <img className="pt-2 mr-5 image-link" src={`${prefix}/img/logo.png`} width='180px' />
            </Link>
        </>
    );

    const UserProfileItems = [
        {
              items: [
                  {
                      label: '로그아웃',
                      icon: 'pi pi-lock',
                      command:(e) => {
                          dispatch(UserInfoActions.logout());
                          router.replace('/');
                      },
                  },
              ]
        },
        {
              label: '쇼핑',
              items: [
                  {
                      label: '장바구니',
                      icon: 'pi pi-shopping-cart',
                      command:(e) => {
                          router.push({
                            pathname: `/Purchase/${props.userObj.uid}/CartList`,
                            query: { uid: props.userObj.uid },
                          },
                          `/Purchase/${props.userObj.uid}/CartList`,
                          );
                      },
                  },
                  {
                      label: '내가 구입한 노래',
                      icon: 'pi pi-wallet',
                      command:(e) => {
                          router.push({
                            pathname: `/Purchase/${props.userObj.uid}/BuyHistory`,
                            query: { uid: props.userObj.uid },
                          },
                          `/Purchase/${props.userObj.uid}/BuyHistory`,
                          );
                      },
                  },
              ]
        },
        {
            label: '유저',
            items: [
                {
                    label: '프로필',
                    icon: 'pi pi-user',
                    command:(e) => {
                        router.push({
                          pathname: `/User${props.userObj.uid}/UserProfile`,
                          query: { uid: props.userObj.uid },
                        },
                        `/User/${props.userObj.uid}/UserProfile`,
                        );
                    },
                },
                {
                    label: '커뮤니티',
                    icon: 'pi pi-comments',
                    command:(e) => {
                        router.push({
                          pathname: `/User/${props.userObj.uid}/UserCommunity`,
                          query: { uid: props.userObj.uid },
                        },
                        `/User/${props.userObj.uid}/UserCommunity`,
                        );
                    },
                },
                {
                    label: '콘텐츠',
                    icon: 'pi pi-folder',
                    command:(e) => {
                        router.push({
                          pathname: `/User/${props.userObj.uid}/UserContents`,
                          query: { uid: props.userObj.uid },
                        },
                        `/User/${props.userObj.uid}/UserContents`,
                        );
                    },
                },
            ]
        },       
    ];

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
                        router.push('/Popular/PopularList');
                    }
                },
                {
                    label: '최신 음악',
                    icon: 'pi pi-plus',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/New/NewList');
                    }                    
                },
                {
                    label: '장르 음악',
                    icon: 'pi pi-users',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push('/Genre/GenreList');
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
                          pathname: `/User/${props.userObj.uid}/UserHistory`,
                          query: { uid: props.userObj.uid },
                        },
                        `/User/${props.userObj.uid}/UserHistory`,
                        );
                    } 
                },
                {
                    label: '내가 구독한 유저',
                    icon: 'pi pi-bookmark',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push({
                          pathname: `/User/${props.userObj.uid}/UserSubscribes`,
                          query: { uid: props.userObj.uid },
                        },
                        `/User/${props.userObj.uid}/UserSubscribes`,
                        );
                    }
                }
            ]
        },
        {
            label: '구독 바로가기',
            items: [
                {
                    label: '김라운디드',
                    icon: 'pi pi-user',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push({
                          pathname: `/User/wODlzR5zAjZobEl2vpNkkyihHIj1/UserProfile`,
                          query: { uid: "wODlzR5zAjZobEl2vpNkkyihHIj1" },
                        },
                        `/User/wODlzR5zAjZobEl2vpNkkyihHIj1/UserProfile`,
                        );
                    }
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
                <img className="ml-3 image-link" src={`${prefix}/img/logo.png`} width='180px' />
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
            <Menu model={UserProfileItems} popup ref={UserProfileItem} id="popup_menu" />
            <Button className="p-button-rounded p-button-text" onClick={(event) => UserProfileItem.current.toggle(event)} aria-controls="popup_menu" aria-haspopup>
                <img className="border-circle" width={35} alt={props.userObj.displayName} src={props.userObj.photoURL ? props.userObj.photoURL : `${prefix}/img/anonymous-user-logo.png`} onError={(e) => e.target.src = `${prefix}/img/anonymous-user-logo.png`} />
            </Button>
        </div>
    ) : (
        <div className="ml-0 mr-0">
            <Link href="/Auth/SignIn">
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
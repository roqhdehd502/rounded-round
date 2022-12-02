import { useState, forwardRef, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import ProjectContext from '../../context';

import * as customerInfoActions from '../../store/modules/customerInfo';


const MenuRef = forwardRef((props, ref) => {
    return (
        <Menu 
          id="popup_menu" 
          model={props.model} 
          ref={ref}  
          popup 
        />
    ); 
})


export const NavigationBar = (props) => {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();
    
    const customerProfileItem = useRef(null);

    const [visibleLeft, setVisibleLeft] = useState(false);

    const customSidebarIcons = (
        <>
            <Link href={`/`}>
                <Image className="pt-2 image-link" src={`${prefix}/img/logo.png`} width={180} height={40} quality={100} />
            </Link>
            <span className="mr-5"></span>
        </>
    );

    const customerProfileItems = [
        {
              items: [
                  {
                      label: '로그아웃',
                      icon: 'pi pi-lock',
                      command:(e) => {
                          dispatch(customerInfoActions.logout());
                          router.replace(`/`);
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
                            pathname: `/purchase/${props.customerObj.uid}/cartList`,
                            query: { uid: props.customerObj.uid },
                          },
                          `/purchase/${props.customerObj.uid}/cartList`,
                          );
                      },
                  },
                  {
                      label: '내가 구입한 노래',
                      icon: 'pi pi-wallet',
                      command:(e) => {
                          router.push({
                            pathname: `/purchase/${props.customerObj.uid}/buyHistory`,
                            query: { uid: props.customerObj.uid },
                          },
                          `/purchase/${props.customerObj.uid}/buyHistory`,
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
                          pathname: `/customer/${props.customerObj.uid}/customerProfile`,
                          query: { uid: props.customerObj.uid },
                        },
                        `/customer/${props.customerObj.uid}/customerProfile`,
                        );
                    },
                },
                {
                    label: '커뮤니티',
                    icon: 'pi pi-comments',
                    command:(e) => {
                        router.push({
                          pathname: `/customer/${props.customerObj.uid}/customerCommunity`,
                          query: { uid: props.customerObj.uid },
                        },
                        `/customer/${props.customerObj.uid}/customerCommunity`,
                        );
                    },
                },
                {
                    label: '콘텐츠',
                    icon: 'pi pi-folder',
                    command:(e) => {
                        router.push({
                          pathname: `/customer/${props.customerObj.uid}/customerContents`,
                          query: { uid: props.customerObj.uid },
                        },
                        `/customer/${props.customerObj.uid}/customerContents`,
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
                        router.push(`/`);
                    },
                },
                {
                    label: '인기있는 음악',
                    icon: 'pi pi-chart-bar',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push(`/popular/popularList`);
                    }
                },
                {
                    label: '최신 음악',
                    icon: 'pi pi-plus',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push(`/new/newList`);
                    }                    
                },
                {
                    label: '장르별 음악',
                    icon: 'pi pi-users',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push(`/genre/genreList`);
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
                          pathname: `/customer/${props.customerObj.uid}/customerHistory`,
                          query: { uid: props.customerObj.uid },
                        },
                        `/customer/${props.customerObj.uid}/customerHistory`,
                        );
                    } 
                },
                {
                    label: '내가 구독한 유저',
                    icon: 'pi pi-bookmark',
                    command:(e) => {
                        setVisibleLeft(false);
                        router.push({
                          pathname: `/customer/${props.customerObj.uid}/customerSubscribes`,
                          query: { uid: props.customerObj.uid },
                        },
                        `/customer/${props.customerObj.uid}/customerSubscribes`,
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
                          pathname: `/customer/wODlzR5zAjZobEl2vpNkkyihHIj1/customerProfile`,
                          query: { uid: "wODlzR5zAjZobEl2vpNkkyihHIj1" },
                        },
                        `/customer/wODlzR5zAjZobEl2vpNkkyihHIj1/customerProfile`,
                        );
                    }
                },
            ]
        },
    ];

    const sideMenuItems = props.customerObj ? [...sideMenuItemsSignOut, ...sideMenuItemsSignIn] : [...sideMenuItemsSignOut];

    const leftContents = (
        <div className="ml-0 mr-0">
            <Sidebar className="sidebar-font" visible={visibleLeft} position="left" onHide={() => setVisibleLeft(false)} icons={customSidebarIcons}>
                <div className="p-inputgroup">
                    <InputText placeholder="검색" />
                    <Button icon="pi pi-search" className="p-button-primary"/>
                </div>  
                <Menu className="border-0 w-auto" model={sideMenuItems} />
            </Sidebar>
            <Button className="mb-1" icon="pi pi-bars" onClick={() => setVisibleLeft(true)} />
            <span className="ml-3"></span>
            <Link href={`/`}>
                <Image className="image-link" src={`${prefix}/img/logo.png`} width={180} height={35} quality={100} />
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
    
    const rightContents = props.customerObj ? (
        <div className="ml-0 mr-0">
            <MenuRef model={customerProfileItems} ref={customerProfileItem} />
            <Button className="p-button-rounded p-button-text" onClick={(event) => customerProfileItem.current.toggle(event)} aria-controls="popup_menu" aria-haspopup>
                <Image className="border-circle" alt={props.customerObj.displayName} src={props.customerObj.photoURL ? props.customerObj.photoURL : `${prefix}/img/anonymous-user-logo.png`} onError={(e) => e.target.src = `${prefix}/img/anonymous-user-logo.png`} width={35} height={35} quality={25} />
            </Button>
        </div>
    ) : (
        <div className="ml-0 mr-0">
            <Link href={`/auth/signIn`}>
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
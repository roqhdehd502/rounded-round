import '../styles/globals.scss'

import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { Provider } from 'react-redux';

import Head from 'next/head';
import Script from 'next/script';

import { ProjectProvider } from '../context';

import { prefix } from '../config';

import { wrapper } from "../store";

import { firestore, firebaseStorage } from '../firebaseConfiguration';

import DefaultLayout from '../layouts/defaultLayout';
import EmptyLayout from '../layouts/emptyLayout';
import ErrorLayout from '../layouts/errorLayout';


const layouts = {
    L1: DefaultLayout,
    L2: EmptyLayout,
    L3: ErrorLayout,
};

function MyApp({ Component, ...rest }) {
    const { store, props } = wrapper.useWrappedStore(rest);
    const Layout = layouts[Component.layout] || ((children) => <>{children}</>);

    firestore;
    firebaseStorage;

    return (
        <>
            <ProjectProvider value={{ prefix }}>
                <Provider store={store}>
                    <Head>
                        <title>Rounded Round</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <Script async strategy="beforeInteractive" src="https://code.jquery.com/jquery-1.12.4.min.js" />
                    <Script async strategy="beforeInteractive" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" />
                    
                    <Layout>
                        <Component {...props.pageProps} />
                    </Layout>
                </Provider>
            </ProjectProvider>
        </>
    ); 
}

export default MyApp;
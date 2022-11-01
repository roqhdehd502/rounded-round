import '../styles/globals.scss'

import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Head from 'next/head'

import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { wrapper } from "../store";
import { persistedReducer } from "../store/modules";

import { firestore, firebaseStorage } from '../firebaseConfiguration';

import DefaultLayout from '../layouts/DefaultLayout';
import EmptyLayout from '../layouts/EmptyLayout';


const layouts = {
    L1: DefaultLayout,
    L2: EmptyLayout,
};

function MyApp({ Component, pageProps }) {
    const Layout = layouts[Component.layout] || ((children) => <>{children}</>);

    const store = createStore(persistedReducer);
    const persistor = persistStore(store);

    firestore;
    firebaseStorage;

    return (
        <PersistGate persistor={persistor} loading={<i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>}>
            <>
                <Head>
                    <title>Rounded Round</title>
                    <meta name="referrer" content="no-referrer" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </>
        </PersistGate>
    ); 
}

export default wrapper.withRedux(MyApp)
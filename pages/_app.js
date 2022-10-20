import '../styles/globals.scss'

import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Head from 'next/head'

import { wrapper } from "../store";

import DefaultLayout from '../layouts/DefaultLayout';
import EmptyLayout from '../layouts/EmptyLayout';


const layouts = {
    L1: DefaultLayout,
    L2: EmptyLayout,
};

function MyApp({ Component, pageProps }) {
    const Layout = layouts[Component.layout] || ((children) => <>{children}</>);

    return (
        <>
            <Head>
                <title>Rounded Round</title>
                <meta name="referrer" content="no-referrer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    ) 
}

export default wrapper.withRedux(MyApp)
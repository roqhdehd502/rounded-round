import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { NavigationBar } from '../components/header/navigationBar';
import { Footer } from '../components/footer/footer';
import { LoadingComponent } from '../components/commons/loadingComponent';

import * as customerInfoActions from '../store/modules/customerInfo';


export default function DefaultLayout({ children }) {
    const dispatch = useDispatch();
    const auth = getAuth();

    const [loading, setLoading] = useState(true);

    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const payload = user;
                dispatch(customerInfoActions.getCustomerObj(payload));
            } else {
                dispatch(customerInfoActions.getCustomerObj(null));
            }
        });
        setLoading(true);
    }, [customerObj]);
    
    return (
        <>
            {loading ? (
                <>
                    <NavigationBar customerObj={customerObj} />
                    <div className="h-5rem mb-4"></div>
                    <div className="content-width-padding ">
                        { children }
                    </div>
                    <Footer />
                </>
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
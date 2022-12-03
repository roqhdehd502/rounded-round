import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { LoadingComponent } from '../components/commons/loadingComponent';

import * as customerInfoActions from '../store/modules/customerInfo';


export default function emptyLayout({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
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

    if (customerObj) {
        console.log("YOU ALREADY LOGINED!");
        router.replace(`/`);
    }

    return (
        <>
            {loading ? (
                <>
                    <div className="content-width-padding">
                        { children }
                    </div>
                </>
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
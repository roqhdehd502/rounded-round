import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProjectContext from '../context';

import * as customerInfoActions from '../store/modules/customerInfo';


export default function emptyLayout({ children }) {
    const { prefix } = useContext(ProjectContext);
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
                    <div className="content-width-padding ">
                        { children }
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-content-center align-content-center min-h-screen">
                        <div>
                            <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
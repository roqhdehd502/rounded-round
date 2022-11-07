import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import * as userInfoActions from '../store/modules/userInfo';


export default function EmptyLayout({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = getAuth();

    const [loading, setLoading] = useState(true);

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const payload = user;
                dispatch(userInfoActions.getUserObj(payload));
            } else {
                dispatch(userInfoActions.getUserObj(null));
            }
        });
        setLoading(true);
    }, [userObj]);

    if (userObj) {
        console.log("YOU ALREADY LOGINED!");
        router.replace('/');
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
                    <div className="flex align-items-baseline">
                        <i className="flex align-items-center justify-content-center pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                    </div>
                </>
            )}
        </>
    );
}
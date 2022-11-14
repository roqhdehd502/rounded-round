import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { NavigationBar } from '../components/Header/NavigationBar';
import { Footer } from '../components/Footer/Footer';

import * as UserInfoActions from '../store/modules/UserInfo';


export default function DefaultLayout({ children }) {
    const dispatch = useDispatch();
    const auth = getAuth();

    const [loading, setLoading] = useState(true);

    const userObj = useSelector(({ UserInfo }) => UserInfo.userObj);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const payload = user;
                dispatch(UserInfoActions.getUserObj(payload));
            } else {
                dispatch(UserInfoActions.getUserObj(null));
            }
        });
        setLoading(true);
    }, [userObj]);
    
    return (
        <>
            {loading ? (
                <>
                    <NavigationBar userObj={userObj} />
                    <div className="h-5rem mb-4"></div>
                    <div className="content-width-padding ">
                        { children }
                    </div>
                    <Footer />
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
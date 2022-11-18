import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProjectContext from '../context';

import * as UserInfoActions from '../store/modules/UserInfo';


export default function EmptyLayout({ children }) {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();
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

    if (userObj) {
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
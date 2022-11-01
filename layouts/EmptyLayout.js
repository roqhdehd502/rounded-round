import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';


export default function EmptyLayout({ children }) {
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);

    if (userObj) {
        console.log(userObj, "YOU ALREADY LOGINED!");
        router.push('/');
    }

    return (
        <>
            <div className="content-width-padding ">
                { children }
            </div>
        </>
    );
}
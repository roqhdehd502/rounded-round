import Link from "next/Link";

import { Button } from 'primereact/button';


export default function UserHeader(props) {
    const activeUserIndex = props.activeIndex;

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center">
                <div className="card w-30rem">
                    <div className="field p-fluid">
                        <img className="border-circle w-15rem h-15rem image-align-center" alt={props.userObj.displayName} src={props.userObj.photoURL ? props.userObj.photoURL : '/img/anonymous-user-logo.png'} onError={(e) => e.target.src = '/img/anonymous-user-logo.png'} />
                    </div>
                    <h1 className="flex justify-content-center">{props.userObj.displayName ? props.userObj.displayName : props.userObj.email}</h1>
                </div>
            </div>
            <div className="card w-auto mb-3">
                <div className="flex justify-content-center flex-wrap">
                    <div className="flex align-items-center">
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userContents`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userContents`}
                          shallow
                        >
                            <Button className={`w-8rem p-button-rounded${activeUserIndex === 0 ? '' : ' p-button-outlined'}`} icon="pi pi-folder" label="컨텐츠" />
                        </Link>
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userCommunity`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userCommunity`}
                          shallow
                        >
                            <Button className={`ml-4 mr-4 w-8rem p-button-rounded${activeUserIndex === 1 ? '' : ' p-button-outlined'}`} icon="pi pi-comments" label="커뮤니티" />
                        </Link>
                        <Link 
                          href={{
                            pathname: `/user/${props.userObj.uid}/userProfile`,
                            query: { ...props.userObj },
                          }}
                          as={`/user/${props.userObj.uid}/userProfile`}
                          shallow
                        >
                            <Button className={`w-8rem p-button-rounded${activeUserIndex === 2 ? '' : ' p-button-outlined'}`} icon="pi pi-user" label="정보" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
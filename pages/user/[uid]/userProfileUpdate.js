import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

import * as userInfoActions from '../../../store/modules/userInfo';
import { getUserInfoObjThunk, patchUserInfoObjThunk } from '../../../store/modules/userInfo';


userProfileUpdate.layout = "L1";
export default function userProfileUpdate() {
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ userInfo }) => userInfo.userObj);
    const userInfoObj = useSelector(({ userInfo }) => userInfo.userInfoObj);

    const [displayName, setDisplayName] = useState(userObj.displayName);
    const [bio, setBio] = useState(userInfoObj.bio);
    const [infoDetail, setInfoDetail] = useState(userInfoObj.infoDetail);
    const [link, setLink] = useState(userInfoObj.link);
    const [addLink, setAddLink] = useState([]);

    useEffect(() => {
        dispatch(getUserInfoObjThunk(router.query.uid));
    }, [router.query]);

    const addUserLink = () => {
        return (
            <>
                {addLink.map((item, index) => {
                    return (
                      <div key={index} className="p-inputgroup">
                          <InputText value={item.linkName} onChange={(e) => setLink(e.target.value)} />
                          <InputText value={item.linkAddress} onChange={(e) => setLink(e.target.value)} />
                      </div>
                    )
                })}
            </>
        );
    }

    const updateUser = useCallback(async (userInfo) => {
        try {
            if (confirm('정말 변경하시겠습니까?')) {
                let photoURL = null;
                const uid = userObj.uid;
                const updateUserObj = {
                    displayName:  userInfo.displayName,
                    bio: userInfo.bio,
                    infoDetail: userInfo.infoDetail.replaceAll("<br>", "\\n"), 
                    link: userInfo.link,        
                }
                console.log("infodetail", updateUserObj.infoDetail);

                const photoFile = document.querySelector('#photo-file').files[0];
                const storage = firebaseStorage.getStorage();
                const storageRef = firebaseStorage.ref(storage, `userimages/${uid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(storageRef, photoFile)
                      .then((snapshot) => {
                          console.log("upload image", snapshot);
                          firebaseStorage.getDownloadURL(storageRef)
                            .then((url) => {
                                photoURL = url;
                                dispatch(userInfoActions.patchUserObj({updateUserObj, photoURL}));
                                dispatch(patchUserInfoObjThunk({uid, updateUserObj, photoURL} ));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    photoURL = userObj.photoURL;
                    dispatch(userInfoActions.patchUserObj({updateUserObj, photoURL}));
                    dispatch(patchUserInfoObjThunk({uid, updateUserObj, photoURL} ));
                }

                router.replace(`/user/${userObj.uid}/userProfile`);
            }
        }   catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const updateUserPassword = useCallback(() => {
        try {
            dispatch(userInfoActions.patchUserPassword(userObj.email));
            alert('가입하신 회원님의 이메일로 비밀번호 변경 요청을 전송하였습니다.');
            dispatch(userInfoActions.userLogout());
            router.replace(`/`);
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    const deleteUserObj = useCallback(() => {
        try {
            if(confirm('정말 회원님의 계정을 삭제하시겠습니까?')) {
                console.log("추후 구현할 것");
            }
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <>
            {userInfoObj ? (
                <>
                    <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                        <div className="card surface-0 p-5 border-round-2xl w-8">
                            <h1 className="flex justify-content-center">회원 정보 수정</h1>
                            <div className="field p-fluid mt-6">
                                <label>프로필 사진</label>
                                <span className="p-inputgroup">
                                    <input
                                      id="photo-file"
                                      type="file"
                                      accept="image/*"
                                      placeholder="이미지를 업로드 하세요"
                                    />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>이름</label>
                                <span className="p-inputgroup">
                                    <InputText value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>설명</label>
                                <span className="p-inputgroup">
                                    <InputText value={bio} onChange={(e) => setBio(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>세부정보</label>
                                <span className="p-inputgroup">
                                    <InputTextarea value={infoDetail} onChange={(e) => setInfoDetail(e.target.value)} rows={5} cols={30} autoResize />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>링크</label>
                                {link ? link.map((item, index) => {
                                    return (
                                      <div key={index} className="p-inputgroup">
                                          <InputText value={item.linkName} onChange={(e) => setLink(e.target.value)} />
                                          <InputText value={item.linkAddress} onChange={(e) => setLink(e.target.value)} />
                                      </div>
                                    )
                                }) : (
                                    <div></div>
                                )}
                                {addLink}
                                <Divider align="center">
                                    <Button icon="pi pi-plus" className="ml-2 p-button-rounded" onClick={()=> addUserLink()} />
                                </Divider>
                            </div>
                            <div className="field p-fluid mt-6">
                                <Button label="변경하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateUser({displayName, bio, infoDetail, link})} />
                            </div>
                            <Divider />
                            <div className="field p-fluid">
                                <Link href={`/user/${userObj.uid}/userProfile`}>
                                    <Button label="돌아가기" icon="pi pi-arrow-left" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <div className="field p-fluid">
                                <Link href="/">
                                    <Button label="메인으로" icon="pi pi-home" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <Divider />
                            { userObj.providerData[0].providerId !== 'google.com' ? (
                                <div className="field p-fluid">
                                    <Button label="비밀번호 변경" icon="pi pi-user-edit" className="pr-5 p-button-warning" onClick={()=> updateUserPassword()} />
                                </div>
                            ) : (
                                <div></div>
                            ) }
                            <div className="field p-fluid">
                                <Button label="계정삭제" icon="pi pi-user-minus" className="pr-5 p-button-danger" onClick={()=> deleteUserObj()}  />
                            </div> 
                        </div>
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
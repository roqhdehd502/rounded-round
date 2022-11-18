import { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

import ProjectContext from '../../../../../context';

import { convertNewlineText } from '../../../../../commons/functional/Filters';

import * as UserInfoActions from '../../../../../store/modules/UserInfo';
import { getUserInfoObjThunk, patchUserInfoObjThunk } from '../../../../../store/modules/UserInfo';


UserProfileUpdate.layout = "L1";
export default function UserProfileUpdate() {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();

    const userObj = useSelector(({ UserInfo }) => UserInfo.userObj);
    const userInfoObj = useSelector(({ UserInfo }) => UserInfo.userInfoObj);

    const [newAttachment, setNewAttachment] = useState("");
    const [userDisplayName, setUserDisplayName] = useState('');
    const [userBio, setUserBio] = useState('');
    const [userInfoDetail, setUserInfoDetail] = useState('');
    const [userLink, setUserLink] = useState(null);

    useEffect(() => {
        dispatch(getUserInfoObjThunk(router.query.uid));

        setUserDisplayName(userObj ? userObj.displayName : '');
        setUserBio(userInfoObj ? userInfoObj.bio : '');
        setUserInfoDetail(userInfoObj ? convertNewlineText(userInfoObj.infoDetail) : '');
        setUserLink(userInfoObj ? userInfoObj.link : null);
    }, [router.query, userObj ? userObj.uid : null, userInfoObj ? userInfoObj.uid : null]);

    const onNewFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }} = finishedEvent;
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearNewAttachment = () => setNewAttachment("");

    const updateUser = useCallback(async (userInfo) => {
        try {
            if (confirm('정말 변경하시겠습니까?')) {
                const updateUserObj = {
                    displayName: userInfo.userDisplayName,
                    bio: userInfo.userBio,
                    infoDetail: userInfo.userInfoDetail.replaceAll("\n", "\\n"), 
                    link: userInfo.userLink,        
                }
                console.log("updateUserObj", updateUserObj);
                
                let userPhotoURL = null;
                const photoFile = document.querySelector('#photo-file').files[0];
                const storage = firebaseStorage.getStorage();
                const storageRef = firebaseStorage.ref(storage, `userimages/${router.query.uid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(storageRef, photoFile)
                      .then((snapshot) => {
                          console.log("upload image", snapshot);
                          firebaseStorage.getDownloadURL(storageRef)
                            .then((url) => {
                                userPhotoURL = url;
                                dispatch(UserInfoActions.patchUserObj({updateUserObj, userPhotoURL}));
                                dispatch(patchUserInfoObjThunk({uid: router.query.uid, updateUserObj, userPhotoURL} ));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    userPhotoURL = userObj ? userObj.photoURL : '';
                    dispatch(UserInfoActions.patchUserObj({updateUserObj, userPhotoURL}));
                    dispatch(patchUserInfoObjThunk({uid: router.query.uid, updateUserObj, userPhotoURL} ));
                }

                router.replace(`/User/${router.query.uid}/UserProfile`);
            }
        }   catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const updateUserPassword = useCallback(() => {
        try {
            dispatch(UserInfoActions.patchUserPassword(userEmail));
            alert('가입하신 회원님의 이메일로 비밀번호 변경 요청을 전송하였습니다.');
            dispatch(UserInfoActions.logout());
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
            {userObj ? (
                <>
                    <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                        <div className="card surface-0 p-5 border-round-2xl w-8">
                            <h1 className="flex justify-content-center">회원 정보 수정</h1>
                            <div className="field p-fluid mt-6">
                                <label>프로필 사진</label>
                                <span className="p-inputgroup">
                                    <label htmlFor="photo-file" className="file-label"><i className="pi pi-image pr-2"></i>이미지 파일</label>
                                    <input
                                      id="photo-file"
                                      type="file"
                                      accept="image/*"
                                      onChange={onNewFileChange}
                                      style={{opacity: 0}}
                                    />
                                    {newAttachment && (
                                        <div className="file-newAttachment">
                                            <img
                                              src={newAttachment}
                                              style={{backgroundImage: newAttachment}}
                                            />
                                            <span className="file-clear" onClick={onClearNewAttachment}>
                                                <i className="pi pi-times" style={{'fontSize': '1.5em'}}></i>
                                            </span>
                                        </div>
                                    )}
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>이름</label>
                                <span className="p-inputgroup">
                                    <InputText value={userDisplayName} onChange={(e) => setUserDisplayName(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>설명</label>
                                <span className="p-inputgroup">
                                    <InputText value={userBio} onChange={(e) => setUserBio(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>세부정보</label>
                                <span className="p-inputgroup">
                                    <InputTextarea value={userInfoDetail} onChange={(e) => setUserInfoDetail(e.target.value)} rows={5} cols={30} autoResize />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>링크</label>
                                <div className="p-inputgroup">
                                    <InputText value={userLink ? userLink.linkName : ''} onChange={(e) => setUserLink(e.target.value)} />
                                    <InputText value={userLink ? userLink.linkAddress : ''} onChange={(e) => setUserLink(e.target.value)} />
                                </div>
                            </div>
                            <Divider />
                            <div className="field p-fluid mt-6">
                                <Button label="변경하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateUser({userDisplayName, userBio, userInfoDetail, userLink})} />
                            </div>
                            <Divider />
                            <div className="field p-fluid">
                                <Link href={`/User/${userObj.uid}/UserProfile`}>
                                    <Button label="돌아가기" icon="pi pi-arrow-left" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <div className="field p-fluid">
                                <Link href={`/`}>
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
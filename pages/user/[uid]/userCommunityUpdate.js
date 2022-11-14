import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

import { convertNewlineText } from '../../../commons/functional/Filters';

import { getUserCommunityThunk, patchUserCommunityThunk, deleteUserCommunityThunk } from '../../../store/modules/UserCommunity';


UserCommunityUpdate.layout = "L1";

export const getServerSideProps = async (context) => {
    return {
        props: {
            communityObj: context.query,
        },
    };
}

export default function UserCommunityUpdate({ communityObj }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const [userContents, setUserContents] = useState(convertNewlineText(router.query.contents));

    useEffect(() => {
        dispatch(getUserCommunityThunk(router.query.docId));
    }, [router.query]);

    const updateCommunity = useCallback(async (communityContents) => {
        try {
            if (confirm('정말 수정하시겠습니까?')) {
                const updateCommunityObj = {
                    docId: router.query.docId,
                    contents: communityContents.replaceAll("\n", "\\n"),  
                    thumbnail: router.query.thumbnail, 
                }
                console.log("updateCommunityObj", updateCommunityObj);

                const photoFile = document.querySelector('#photo-file').files[0];
                const storage = firebaseStorage.getStorage();
                const storageRef = firebaseStorage.ref(storage, `usercommunityimages/${router.query.uid}/${router.query.thumbnailUuid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(storageRef, photoFile)
                      .then((snapshot) => {
                          console.log("upload image", snapshot);
                          firebaseStorage.getDownloadURL(storageRef)
                            .then((url) => {
                                updateCommunityObj.thumbnail = url;
                                dispatch(patchUserCommunityThunk(updateCommunityObj));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    dispatch(patchUserCommunityThunk(updateCommunityObj));
                }
                
                router.replace(`/User/${router.query.uid}/UserCommunity`);
            }
        }   catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const deleteCommunity = useCallback(async () => {
        try {
            if (confirm('정말 삭제하시겠습니까?')) {
                if (router.query.thumbnail) {
                    const storage = firebaseStorage.getStorage();
                    const storageRef = firebaseStorage.ref(storage, `usercommunityimages/${router.query.uid}/${router.query.thumbnailUuid}`);

                    firebaseStorage.deleteObject(storageRef).then(() => {
                        dispatch(deleteUserCommunityThunk(router.query.docId));
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    dispatch(deleteUserCommunityThunk(router.query.docId));
                }
                
                router.replace(`/User/${router.query.uid}/UserCommunity`);
            } 
        } catch(error) {
            console.log(error);
        }  
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-8">
                    <h1 className="flex justify-content-center">유저 커뮤니티 수정</h1>
                    <div className="field p-fluid mt-6">
                        <label>썸네일</label>
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
                        <label>내용</label>
                        <span className="p-inputgroup">
                            <InputTextarea value={userContents} onChange={(e) => setUserContents(e.target.value)} rows={5} cols={30} autoResize />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="수정하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateCommunity(userContents)} />
                    </div>
                    <Divider />
                    <div className="field p-fluid">
                        <Link href={`/User/${router.query.uid}/UserCommunity`}>
                            <Button label="돌아가기" icon="pi pi-arrow-left" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <div className="field p-fluid">
                        <Link href="/">
                            <Button label="메인으로" icon="pi pi-home" className="p-button-info pr-5" />
                        </Link>
                    </div>
                    <Divider />
                    <div className="field p-fluid">
                        <Button label="삭제하기" icon="pi pi-trash" className="p-button-danger pr-5" onClick={()=> deleteCommunity()} />
                    </div>
                </div>
            </div>
        </>
    );
}
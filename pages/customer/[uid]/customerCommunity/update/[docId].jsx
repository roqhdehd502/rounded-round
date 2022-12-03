import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { LoadingComponent } from '../../../../../components/commons/loadingComponent';

import { convertNewlineText } from '../../../../../commons/functional/filters';

import { getCustomerCommunityThunk, patchCustomerCommunityThunk, deleteCustomerCommunityThunk } from '../../../../../store/modules/customerCommunitiesInfo';


customerCommunityUpdate.layout = "L1";
export default function customerCommunityUpdate() {
    const dispatch = useDispatch();
    const router = useRouter();

    const customerCommunityObj = useSelector(({ customerCommunitiesInfo }) => customerCommunitiesInfo.customerCommunityObj);
    
    const [communityThumbnail, setCommunityThumbnail] = useState('');
    const [communityThumbnailUuid, setCommunityThumbnailUuid] = useState('');
    const [communityContents, setCommunityContents] = useState(convertNewlineText(''));

    useEffect(() => {
        dispatch(getCustomerCommunityThunk(router.query.docId));

        setCommunityThumbnail(customerCommunityObj ? customerCommunityObj.thumbnail : '');
        setCommunityThumbnailUuid(customerCommunityObj ? customerCommunityObj.thumbnailUuid : '');
        setCommunityContents(customerCommunityObj ? convertNewlineText(customerCommunityObj.contents) : '');
    }, [router.query, customerCommunityObj ? customerCommunityObj.docId : null]);

    const updateCommunity = useCallback(async (communityObj) => {
        try {
            confirmDialog({
              header: '회원 커뮤니티 수정',
              icon: 'pi pi-exclamation-triangle',
              message: '정말 수정하시겠습니까?',
              position: 'top',
              accept: () => {
                const updateCommunityObj = {
                    docId: router.query.docId,
                    thumbnail: communityObj.communityThumbnail, 
                    contents: communityObj.communityContents.replaceAll("\n", "\\n"),  
                }

                const photoFile = document.querySelector('#photo-file').files[0];
                const storage = firebaseStorage.getStorage();
                const storageRef = firebaseStorage.ref(storage, `customercommunityimages/${router.query.uid}/${communityObj.communityThumbnailUuid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(storageRef, photoFile)
                      .then((snapshot) => {
                          console.log("upload image", snapshot);
                          firebaseStorage.getDownloadURL(storageRef)
                            .then((url) => {
                                updateCommunityObj.thumbnail = url;
                                dispatch(patchCustomerCommunityThunk(updateCommunityObj));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    dispatch(patchCustomerCommunityThunk(updateCommunityObj));
                }
                
                router.replace(`/customer/${router.query.uid}/customerCommunity`);
              },
              reject: () => { return } 
            });
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const deleteCommunity = useCallback(async () => {
        try {
            confirmDialog({
              header: '회원 커뮤니티 삭제',
              icon: 'pi pi-exclamation-triangle',
              message: '정말 삭제하시겠습니까?',
              position: 'top',
              accept: () => {
                if (customerCommunityObj.thumbnail) {
                    const storage = firebaseStorage.getStorage();
                    const storageRef = firebaseStorage.ref(storage, `customercommunityimages/${router.query.uid}/${customerCommunityObj.thumbnailUuid}`);

                    firebaseStorage.deleteObject(storageRef).then(() => {
                        dispatch(deleteCustomerCommunityThunk(router.query.docId));
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    dispatch(deleteCustomerCommunityThunk(router.query.docId));
                }
                
                router.replace(`/customer/${router.query.uid}/customerCommunity`);
              },
              reject: () => { return } 
            });
        } catch(error) {
            console.log(error);
        }  
    }, [dispatch]);

    return (
        <>
            <ConfirmDialog />

            {customerCommunityObj ? (
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
                                      placeholder="수정할 이미지를 업로드 하세요"
                                    />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>내용</label>
                                <span className="p-inputgroup">
                                    <InputTextarea value={communityContents} onChange={(e) => setCommunityContents(e.target.value)} rows={5} cols={30} autoResize />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <Button label="수정하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateCommunity({communityThumbnail, communityThumbnailUuid, communityContents})} />
                            </div>
                            <Divider />
                            <div className="field p-fluid">
                                <Link href={`/customer/${router.query.uid}/customerCommunity`}>
                                    <Button label="돌아가기" icon="pi pi-arrow-left" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <div className="field p-fluid">
                                <Link href={`/`}>
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
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}
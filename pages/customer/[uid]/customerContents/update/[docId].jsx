import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { LoadingComponent } from '../../../../../components/commons/loadingComponent';

import { getCustomerContentThunk, patchCustomerContentThunk, deleteCustomerContentThunk } from '../../../../../store/modules/customerContentsInfo';


customerContentsUpdate.layout = "L1";
export default function customerContentsUpdate() {
    const dispatch = useDispatch();
    const router = useRouter();

    const customerContentObj = useSelector(({ customerContentsInfo }) => customerContentsInfo.customerContentObj);

    const [contentThumbnail, setContentThumbnail] = useState('');
    const [contentThumbnailUuid, setContentThumbnailUuid] = useState('');
    const [contentTitle, setContentTitle] = useState('');
    const [contentContents, setContentContents] = useState(customerContentObj?.contents);
    const [beforeContentContents, setBeforeContentContents] = useState('');

    useEffect(() => {
        dispatch(getCustomerContentThunk(router.query.docId));

        setContentThumbnail(customerContentObj ? customerContentObj.thumbnail : '');
        setContentThumbnailUuid(customerContentObj ? customerContentObj.thumbnailUuid : '');
        setContentTitle(customerContentObj ? customerContentObj.title : '');
        setContentContents(customerContentObj ? customerContentObj.contents : '');
        setBeforeContentContents(customerContentObj ? customerContentObj.contents : '');
    }, [router.query, customerContentObj ? customerContentObj.docId : null]);

    const findBase64s = (includeBase64) => {
        const base64Match = Array.from(includeBase64.matchAll(/<img[^>]+src=["']([^'">]+)['"]/gi));
        return base64Match.map(item => item.pop() || '');
    }

    const convertBase64ToFiles = (base64URLs, imageUuid) => {
        let base64ToFiles = [];

        for (let i=0; i<base64URLs.length; i++) {
            const arr = base64URLs[i].split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const fileExtension = mime.substring('image/'.length, mime.length);
            const bstr = atob(arr[1]);
            const n = bstr.length;
            const u8arr = new Uint8Array(n);
    
            while(n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            base64ToFiles.push(new File([u8arr], `${imageUuid}_${i}.${fileExtension}`, {type:mime}));
        }

        return base64ToFiles;
    }

    const uploadContentsImages = async (storage, imageFiles, imageUuid, uid) => {
        for (let i=0; i<imageFiles.length; i++) {
            const contentsStorageRef = firebaseStorage.ref(storage, `customercontentsimages/${uid}/${imageUuid}/${imageUuid}_${i}`);
            await firebaseStorage.uploadBytes(contentsStorageRef, imageFiles[i])
              .then((snapshot) => {
                  console.log(`thumbnail images ${i}`, snapshot);
              }).catch((error) => {
                  console.log("contents image upload error!", error);
              });
        }
    }

    const downloadContentsImages = async (storage, imageFiles, imageUuid, uid) => {
        let downloadURLs = [];
        
        for (let i=0; i<imageFiles.length; i++) {
            const contentsStorageRef = firebaseStorage.ref(storage, `customercontentsimages/${uid}/${imageUuid}/${imageUuid}_${i}`);
            await firebaseStorage.getDownloadURL(contentsStorageRef)
              .then((url) => {
                  downloadURLs.push(url);
              }).catch((error) => {
                  console.log("contents image download error!", error);
              });
        }

        return downloadURLs;
    }

    const updateContent = useCallback((contentObj) => {
        if (contentObj.contentTitle === '' || contentObj.contentContents === '') {
            alert('제목 및 내용을 입력해주세요!');
            return;
        }

        try {
            confirmDialog({
              header: '회원 컨텐츠 수정',
              icon: 'pi pi-exclamation-triangle',
              message: '정말 수정하시겠습니까?',
              position: 'top',
              accept: async () => {
                const storage = firebaseStorage.getStorage();

                const photoFile = document.querySelector('#photo-file').files[0];
                let afterContents = contentObj.contentContents;
                
                if (afterContents !== contentObj.beforeContentContents) {
                    const extractBase64s = findBase64s(contentObj.contentContents);
                    console.log("extractBase64s", extractBase64s, extractBase64s.length);
                    if (extractBase64s) {
                        if (extractBase64s[0].indexOf(';base64,') !== -1) {
                            const base64ToFiles = convertBase64ToFiles(extractBase64s, contentObj.contentThumbnailUuid);
      
                            await uploadContentsImages(storage, base64ToFiles, contentObj.contentThumbnailUuid, router.query.uid);
                            const contentImages = await downloadContentsImages(storage, base64ToFiles, contentObj.contentThumbnailUuid, router.query.uid);
        
                            for (let i=0; i<base64ToFiles.length; i++) {
                                afterContents = afterContents.replaceAll(extractBase64s[i], contentImages[i]);
                            }
                        }
                    }
                }

                const updateContentObj = {
                    docId: router.query.docId,
                    thumbnail: contentObj.contentThumbnail, 
                    title: contentObj.contentTitle,
                    contents: afterContents,  
                }
                
                const thumbnailStorageRef = firebaseStorage.ref(storage, `customercontentsimages/${router.query.uid}/${contentObj.contentThumbnailUuid}/${contentObj.contentThumbnailUuid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(thumbnailStorageRef, photoFile)
                      .then((snapshot) => {
                          console.log("thumbnail image", snapshot);
                          firebaseStorage.getDownloadURL(thumbnailStorageRef)
                            .then((url) => {
                                updateContentObj.thumbnail = url;
                                dispatch(patchCustomerContentThunk(updateContentObj));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    dispatch(patchCustomerContentThunk(updateContentObj));
                }
                
                router.replace(`/customer/${router.query.uid}/customerContents`);
              },
              reject: () => { return } 
            });
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const deleteImageFiles = async () => {
        const storage = firebaseStorage.getStorage();
        const storageRef = firebaseStorage.ref(storage, `customercontentsimages/${router.query.uid}/${customerContentObj.thumbnailUuid}`);

        firebaseStorage.listAll(storageRef)
          .then((res) => {
              res.items.forEach((itemRef) => {
                  const storageChildRef = firebaseStorage.ref(storage, `${storageRef.fullPath}/${itemRef.name}`);

                  firebaseStorage.deleteObject(storageChildRef)
                    .then(() => {
                        console.log("DELETE IMAGE SUCCESS!");
                    }).catch((error) => {
                        console.log(error);
                    });
              });
              dispatch(deleteCustomerContentThunk(router.query.docId));
          }).catch((error) => {
              console.log(error);
              dispatch(deleteCustomerContentThunk(router.query.docId));
          });
    };

    const deleteContent = useCallback(async () => {
        try {
            confirmDialog({
              header: '회원 컨텐츠 삭제',
              icon: 'pi pi-exclamation-triangle',
              message: '정말 삭제하시겠습니까?',
              position: 'top',
              accept: () => {
                deleteImageFiles()
                  .then(() => {
                      router.replace(`/customer/${router.query.uid}/customerContents`);
                  }).catch((error) => {
                      console.log(error);
                  });
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

            {customerContentObj ? (
                <>
                    <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                        <div className="card surface-0 p-5 border-round-2xl w-8">
                            <h1 className="flex justify-content-center">유저 컨텐츠 수정</h1>
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
                                <label>제목</label>
                                <span className="p-inputgroup">
                                    <InputText value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>내용</label>
                                <span className="p-inputgroup">
                                    <Editor className="h-30rem w-full" value={contentContents} onTextChange={(e) => setContentContents(e.htmlValue)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-8">
                                <Button label="수정하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateContent({contentThumbnail, contentThumbnailUuid, contentTitle, contentContents, beforeContentContents})} />
                            </div>
                            <Divider />
                            <div className="field p-fluid">
                                <Link href={`/customer/${router.query.uid}/customerContents`}>
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
                                <Button label="삭제하기" icon="pi pi-trash" className="p-button-danger pr-5" onClick={()=> deleteContent()} />
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
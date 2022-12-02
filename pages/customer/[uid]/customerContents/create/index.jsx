import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Divider } from 'primereact/divider';

import { v4 as uuidv4 } from 'uuid';

import { createCustomerContentThunk } from '../../../../../store/modules/customerContentsInfo';


customerContentsCreate.layout = "L1";
export default function customerContentsCreate() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

    useEffect(() => {

    }, [router.query]);

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

    const createContentLogic = async (contentObj) => {
        const storage = firebaseStorage.getStorage();
        const thumbnailUuid = uuidv4();

        const photoFile = document.querySelector('#photo-file').files[0];
        let afterContents = contentObj.contents;

        const extractBase64s = findBase64s(contentObj.contents);
        if (extractBase64s) {
            const base64ToFiles = convertBase64ToFiles(extractBase64s, thumbnailUuid);

            await uploadContentsImages(storage, base64ToFiles, thumbnailUuid, contentObj.uid);
            const contentImages = await downloadContentsImages(storage, base64ToFiles, thumbnailUuid, contentObj.uid);

            for (let i=0; i<base64ToFiles.length; i++) {
                afterContents = afterContents.replaceAll(extractBase64s[i], contentImages[i]);
            }
        }
      
        const createContentObj = {
            uid: contentObj.uid,
            title: contentObj.title,
            contents: afterContents,
            uploadDate: Date.now(),
            thumbnailUuid,   
        }

        if (photoFile) {
            const thumbnailStorageRef = firebaseStorage.ref(storage, `customercontentsimages/${contentObj.uid}/${thumbnailUuid}/${thumbnailUuid}`);
                firebaseStorage.uploadBytes(thumbnailStorageRef, photoFile)
                  .then((snapshot) => {
                      console.log("thumbnail image", snapshot);
                      firebaseStorage.getDownloadURL(thumbnailStorageRef)
                        .then((url) => {
                            createContentObj.thumbnail = url;
                            dispatch(createCustomerContentThunk(createContentObj));
                            
                        });
                  }).catch((error) => {
                      console.log("thumbnail image upload error!", error);
                  });
        } else {
            createContentObj.thumbnail = '';
            dispatch(createCustomerContentThunk(createContentObj));
        }
    }

    const createContent = useCallback(async (contentObj) => {
        if (contentObj.title === '' || contentObj.contents === '') {
            alert('제목 및 내용을 입력해주세요!');
            return;
        }

        try {
            createContentLogic(contentObj)
              .then(() => {
                  router.replace(`/customer/${contentObj.uid}/customerContents`);
              }).catch((error) => {
                  console.log(error);
              });
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-8">
                    <h1 className="flex justify-content-center">유저 컨텐츠 작성</h1>
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
                        <label>제목</label>
                        <span className="p-inputgroup">
                            <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <label>내용</label>
                        <span className="p-inputgroup">
                            <Editor className="h-30rem w-full" value={contents} onTextChange={(e) => setContents(e.htmlValue)} />
                        </span>
                    </div>
                    <div className="field p-fluid mt-8">
                        <Button label="등록하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> createContent({uid: router.query.uid, title, contents})} />
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
                </div>
            </div>
        </>
    );
}
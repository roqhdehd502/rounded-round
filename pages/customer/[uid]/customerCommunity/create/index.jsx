import { useState, useEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

import { v4 as uuidv4 } from 'uuid';

import ProjectContext from '../../../../../context';

import { getCustomerInfoObjThunk } from '../../../../../store/modules/customerInfo';
import { createCustomerCommunityThunk } from '../../../../../store/modules/customerCommunitiesInfo';


customerCommunityCreate.layout = "L1";
export default function customerCommunityCreate() {
    const { prefix } = useContext(ProjectContext);
    const dispatch = useDispatch();
    const router = useRouter();

    const [contents, setContents] = useState('');

    useEffect(() => {
        console.log(router.query.uid);
    }, [router.query]);

    const createCommunity = useCallback(async (communityObj) => {
        try {
            const thumbnailUuid = uuidv4();
            const createCommunityObj = {
                uid: communityObj.uid,
                contents: communityObj.contents.replaceAll("\n", "\\n"),
                uploadDate: Date.now(),
                thumbnailUuid,      
            }

            const photoFile = document.querySelector('#photo-file').files[0];
            const storage = firebaseStorage.getStorage();
            const storageRef = firebaseStorage.ref(storage, `customercommunityimages/${communityObj.uid}/${thumbnailUuid}`);

            if (photoFile) {
                firebaseStorage.uploadBytes(storageRef, photoFile)
                  .then((snapshot) => {
                      console.log("upload image", snapshot);
                      firebaseStorage.getDownloadURL(storageRef)
                        .then((url) => {
                            createCommunityObj.thumbnail = url;
                            dispatch(createCustomerCommunityThunk(createCommunityObj));
                        });
                  }).catch((error) => {
                      console.log(error);
                  });
            } else {
                createCommunityObj.thumbnail = '';
                dispatch(createCustomerCommunityThunk(createCommunityObj));
            }

            router.replace(`/customer/${communityObj.uid}/customerCommunity`);
        }   catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                <div className="card surface-0 p-5 border-round-2xl w-8">
                    <h1 className="flex justify-content-center">유저 커뮤니티 작성</h1>
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
                            <InputTextarea value={contents} onChange={(e) => setContents(e.target.value)} rows={5} cols={30} autoResize />
                        </span>
                    </div>
                    <div className="field p-fluid mt-6">
                        <Button label="등록하기" icon="pi pi-user-edit" className="pr-5" onClick={()=> createCommunity({uid: router.query.uid, contents})} />
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
                </div>
            </div>
        </>
    );
}
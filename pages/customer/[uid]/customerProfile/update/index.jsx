import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";
import { useRouter } from 'next/router';

import * as firebaseStorage from "firebase/storage";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { LoadingComponent } from '../../../../../components/commons/loadingComponent';

import { convertNewlineText } from '../../../../../commons/functional/filters';

import * as customerInfoActions from '../../../../../store/modules/customerInfo';
import { getCustomerInfoObjThunk, patchCustomerInfoObjThunk } from '../../../../../store/modules/customerInfo';


customerProfileUpdate.layout = "L1";
export default function customerProfileUpdate() {
    const dispatch = useDispatch();
    const router = useRouter();

    const customerObj = useSelector(({ customerInfo }) => customerInfo.customerObj);
    const customerInfoObj = useSelector(({ customerInfo }) => customerInfo.customerInfoObj);

    const [newAttachment, setNewAttachment] = useState('');

    const [customerUid, setCustomerUid] = useState('');    
    const [customerPhotoURL, setCustomerPhotoURL] = useState('');
    const [customerDisplayName, setCustomerDisplayName] = useState('');
    const [customerBio, setCustomerBio] = useState('');
    const [customerInfoDetail, setCustomerInfoDetail] = useState('');
    const [customerLinkName, setCustomerLinkName] = useState('');
    const [customerLinkAddress, setCustomerLinkAddress] = useState('');

    useEffect(() => {
        dispatch(getCustomerInfoObjThunk(router.query.uid));

        setCustomerUid(customerObj ? customerObj.uid : '');
        setCustomerPhotoURL(customerObj ? customerObj.photoURL : '');
        setCustomerDisplayName(customerObj ? customerObj.displayName : '');
        setCustomerBio(customerInfoObj ? customerInfoObj.bio : '');
        setCustomerInfoDetail(customerInfoObj ? convertNewlineText(customerInfoObj.infoDetail) : '');
        setCustomerLinkName(customerInfoObj ? customerInfoObj.link.linkName : '');
        setCustomerLinkAddress(customerInfoObj ? customerInfoObj.link.linkAddress : '');
    }, [router.query, customerObj ? customerObj.uid : null, customerInfoObj ? customerInfoObj.uid : null]);

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

    const updateCustomer = useCallback(async (customerInfo) => {
        try {
            confirmDialog({
              header: '?????? ?????? ??????',
              icon: 'pi pi-exclamation-triangle',
              message: '?????? ?????????????????????????',
              position: 'top',
              accept: () => {
                const updateCustomerObj = {
                    displayName: customerInfo.customerDisplayName,
                    bio: customerInfo.customerBio,
                    infoDetail: customerInfo.customerInfoDetail.replaceAll("\n", "\\n"), 
                    link: {
                        linkName: customerInfo.customerLinkName,
                        linkAddress: customerInfo.customerLinkAddress,
                    },        
                }
                
                let photoURL = null;
                const photoFile = document.querySelector('#photo-file').files[0];
                const storage = firebaseStorage.getStorage();
                const storageRef = firebaseStorage.ref(storage, `customerimages/${router.query.uid}`);

                if (photoFile) {
                    firebaseStorage.uploadBytes(storageRef, photoFile)
                      .then((snapshot) => {
                          console.log("upload image", snapshot);
                          firebaseStorage.getDownloadURL(storageRef)
                            .then((url) => {
                                photoURL = url;
                                dispatch(customerInfoActions.patchCustomerObj({updateCustomerObj, photoURL}));
                                dispatch(patchCustomerInfoObjThunk({uid: customerInfo.customerUid, updateCustomerObj, photoURL} ));
                            });
                      }).catch((error) => {
                          console.log(error);
                      });
                } else {
                    photoURL = customerInfo.customerPhotoURL;
                    dispatch(customerInfoActions.patchCustomerObj({updateCustomerObj, photoURL}));
                    dispatch(patchCustomerInfoObjThunk({uid: customerInfo.customerUid, updateCustomerObj, photoURL} ));
                }

                router.replace(`/customer/${customerInfo.customerUid}/customerProfile`);
              },
              reject: () => { return } 
            });
        } catch(error) {
            console.log(error);
        }
    }, [dispatch]);

    const updateCustomerPassword = useCallback(() => {
        try {
            confirmDialog({
              header: '???????????? ?????? ??????',
              icon: 'pi pi-exclamation-triangle',
              message: '???????????? ????????? ????????? ???????????? ?????? ???????????? ?????????????????????????',
              position: 'top',
              accept: () => {
                dispatch(customerInfoActions.patchCustomerPassword(customerEmail));
                dispatch(customerInfoActions.logout());
                router.replace(`/`);
              },
              reject: () => { return } 
            });
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    const deletecustomerObj = useCallback(() => {
        try {
            confirmDialog({
              header: '?????? ?????? ??????',
              icon: 'pi pi-info-circle',
              acceptClassName: 'p-button-danger',
              message: '?????? ???????????? ????????? ?????????????????????????',
              position: 'top',
              accept: () => {
                console.log("?????? ????????? ???");
              },
              reject: () => { return } 
            });
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <>
            <ConfirmDialog />

            {customerObj ? (
                <>
                    <div className="flex align-content-center align-items-center justify-content-center form-vertical-align-center">
                        <div className="card surface-0 p-5 border-round-2xl w-8">
                            <h1 className="flex justify-content-center">?????? ?????? ??????</h1>
                            <div className="field p-fluid mt-6">
                                <label>????????? ??????</label>
                                <span className="p-inputgroup">
                                    <label htmlFor="photo-file" className="file-label"><i className="pi pi-image pr-2"></i>????????? ??????</label>
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
                                <label>??????</label>
                                <span className="p-inputgroup">
                                    <InputText value={customerDisplayName} onChange={(e) => setCustomerDisplayName(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>??????</label>
                                <span className="p-inputgroup">
                                    <InputText value={customerBio} onChange={(e) => setCustomerBio(e.target.value)} />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>????????????</label>
                                <span className="p-inputgroup">
                                    <InputTextarea value={customerInfoDetail} onChange={(e) => setCustomerInfoDetail(e.target.value)} rows={5} cols={30} autoResize />
                                </span>
                            </div>
                            <div className="field p-fluid mt-6">
                                <label>??????</label>
                                <div className="p-inputgroup">
                                    <InputText value={customerLinkName} onChange={(e) => setCustomerLinkName(e.target.value)} />
                                    <InputText value={customerLinkAddress} onChange={(e) => setCustomerLinkAddress(e.target.value)} />
                                </div>
                            </div>
                            <Divider />
                            <div className="field p-fluid mt-6">
                                <Button label="????????????" icon="pi pi-user-edit" className="pr-5" onClick={()=> updateCustomer({customerUid, customerPhotoURL, customerDisplayName, customerBio, customerInfoDetail, customerLinkName, customerLinkAddress})} />
                            </div>
                            <Divider />
                            <div className="field p-fluid">
                                <Link href={`/customer/${customerObj.uid}/customerProfile`}>
                                    <Button label="????????????" icon="pi pi-arrow-left" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <div className="field p-fluid">
                                <Link href={`/`}>
                                    <Button label="????????????" icon="pi pi-home" className="p-button-info pr-5" />
                                </Link>
                            </div>
                            <Divider />
                            { customerObj.providerData[0].providerId !== 'google.com' ? (
                                <div className="field p-fluid">
                                    <Button label="???????????? ??????" icon="pi pi-user-edit" className="pr-5 p-button-warning" onClick={()=> updateCustomerPassword()} />
                                </div>
                            ) : (
                                <div></div>
                            ) }
                            <div className="field p-fluid">
                                <Button label="????????????" icon="pi pi-user-minus" className="pr-5 p-button-danger" onClick={()=> deletecustomerObj()}  />
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
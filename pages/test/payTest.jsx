import { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider'

import axios from 'axios';

import { getIamportAuthenticaiton, getPayInformation } from '../../iamportConfiguration';


payTest.layout = "L1";
export default function payTest() {
    const [accessToken, setAccessToken] = useState('');
    const [kakaypayObj, setKakaypayObj] = useState(null);

    useEffect(() => {
        console.log("accessToken", accessToken);
        console.log("kakaypayObj", kakaypayObj);
    }, [accessToken, kakaypayObj]);

    const onAuthenticate = async () => {
        const token = await getIamportAuthenticaiton();
        setAccessToken(token);
    }

    const onPayment = () => {
        getPayInformation();
    }

    const onKakaypayHistory = async () => {
        axios.get(`/kakao/payment/orders`, {
            payment_request_date: '20221124',
            cid: process.env.NEXT_PUBLIC_IAMPORT_KAKAOPAY_CID,
            page: 1,
        }).then((res) => {
            setKakaypayObj(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <div>
                <Button label='토큰 발급하기' onClick={() => onAuthenticate()} />
                <Divider />
                <Button label='결제창 불러와!' onClick={() => onPayment()} />
                <Divider />
                <Button label='카카오페이 결제내역 불러와!' onClick={() => onKakaypayHistory()} />
            </div>
        </>
    );
}
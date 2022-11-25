import axios from 'axios';


let token = '';

const getIamportAccessToken = async () => {
    await axios.post(`/users/getToken`, {
        imp_key: process.env.NEXT_PUBLIC_IAMPORT_REST_API_KEY,
        imp_secret: process.env.NEXT_PUBLIC_IAMPORT_REST_API_SECRET,
    }).then(res => {
        token = res.data.response.access_token;
    }).catch(error => {
        console.log(error);
    });
}

export const getIamportAuthenticaiton = async () => {
    await getIamportAccessToken();
    return token;
}

export const getPayInformation = () => {
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_IDENTIFICATION_CODE);
    IMP.request_pay({
        pg: `kakaopay.${process.env.NEXT_PUBLIC_IAMPORT_KAKAOPAY_CID}`,
        pay_method: "card",
        merchant_uid: "ORD20180131-0000012",
        name: "United In Grief",
        amount: 800,
        buyer_uid: "tPXWJwE8A2Rw9rOiqeLpbAiLJfK2",
        // buyer_email: "natorque5552@gmail.com",
        // buyer_name: "MinwooNa",
        // buyer_tel: "010-4242-4242",
        // buyer_addr: "서울특별시 구로구 개봉동",
        // buyer_postcode: "08233"
    }, (rsp) => {
        if (rsp.success) {
            alert(`완료 -> imp_uid: ${rsp.imp_uid} / merchant_uid(orderKey): ${rsp.merchant_uid}`)
        } else {
            alert(`실패 -> 코드: ${rsp.error_code} / 메시지: ${rsp.error_msg}`);
        }
    });
}
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

export const getPayInformation = (payList, totalPrice) => {
    let songName = "";
    let requestObj = null;

    if (payList.length > 1) {
        songName = `${payList[0].songName}외 ${payList.length-1}곡`;
    } else {
        songName = payList[0].songName;
    }

    requestObj = {
        pg: `kakaopay.${process.env.NEXT_PUBLIC_IAMPORT_KAKAOPAY_CID}`,
        pay_method: "card",
        merchant_uid: payList[0].payId,
        name: songName,
        amount: totalPrice,
        buyer_uid: payList[0].uid,
    }

    return requestObj;
}
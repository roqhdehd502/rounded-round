export const getPayInformation = (payList) => {
  let songName = "";
  let totalPrice = 0;

  if (payList.length > 1) {
      songName = `${payList[0].songName}외 ${payList.length-1}곡`;
  } else {
      songName = payList[0].songName;
  }

  payList.forEach(item => {
      totalPrice += item.price;
  });
  
  IMP.init(process.env.NEXT_PUBLIC_IAMPORT_IDENTIFICATION_CODE);
  IMP.request_pay({
      pg: `kakaopay.${process.env.NEXT_PUBLIC_IAMPORT_KAKAOPAY_CID}`,
      pay_method: "card",
      merchant_uid: payList[0].payId,
      name: songName,
      amount: totalPrice,
      buyer_uid: payList[0].uid,
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
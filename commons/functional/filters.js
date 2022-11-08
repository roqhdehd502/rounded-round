import TimeCounting from "time-counting";


export const ellipsisText = (inputText, referenceLength) => {
    if (inputText.length > referenceLength) {
        return `${inputText.substr(0, referenceLength + 1)}...` ;
    } else {
        return inputText;
    }
}


export const formatUnitEachThousand = (value) => {
    return value.toLocaleString('en');
}


export const timeCounter = (referenceTime) => {
    const timeCount = TimeCounting(new Date(referenceTime), {
      objectTime: Date.now(),
      lang: "ko"
    });

    return timeCount;
}


export const timeFormatting = (referenceTime, getTimeType='YYYYMMDD') => {
    const time = new Date(referenceTime);
    let fomattedTime;
    switch(getTimeType) {
        case 'YYYYMMDD':
            fomattedTime = `${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()}`;
            break;
        case 'YYYY':
            fomattedTime = `${time.getFullYear()}`;
            break;
        case 'MM':
            fomattedTime = `${time.getMonth()}`;
            break;
        case 'DD':
            fomattedTime = `${time.getDate()}`;
            break;        
    }

    return fomattedTime;
}


export const convertNewlineText = (referenceText) => {
    return referenceText.replace(/\\n/g, '\n');
}
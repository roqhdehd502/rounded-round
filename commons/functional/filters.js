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
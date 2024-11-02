import {dateFormatOptions} from './settings';

export const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const customFormatDate = (date: Date): string => {
    return date.toLocaleString('vi-VN', dateFormatOptions).trim();
};


export const customFormatTime = (time: string): string => {
    const [hours, minutes,] = time.split(':');
    return `${hours}:${minutes}`;
}
export  const customFormatTimeWithText = (time: string) => {
    let [hours, minutes,] = time.split(':');
    if(hours[0] === '0'){
        hours = hours.slice(1);
    }
    return `${hours}h${minutes == '00'? '' : ':'+minutes}`;
}
export const catchErrorHandle = async <T>(promise: Promise<T>) : Promise<[undefined, T] | [Error]> => {
    return promise
        .then(data => {
            return [undefined, data] as [undefined, T]
        })
        .catch(error => {
            return [error]
        });
}
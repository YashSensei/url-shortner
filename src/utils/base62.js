export const encodeBase62 = (num) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let encoded = '';
    do {
        encoded = chars[num % 62] + encoded;
        num = Math.floor(num / 62);
    } while (num > 0);
    return encoded;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [encode an uInt32, return a array of bytes]
 * @param  {[integer]} num
 * @return {[array]}
 */
function encodeUInt32(num) {
    let n = parseInt(num);
    if (isNaN(n) || n < 0) {
        console.log(n);
        return null;
    }
    let result = [];
    do {
        let tmp = n % 128;
        let next = Math.floor(n / 128);
        if (next !== 0) {
            tmp = tmp + 128;
        }
        result.push(tmp);
        n = next;
    } while (n !== 0);
    return result;
}
exports.encodeUInt32 = encodeUInt32;
;
/**
 * [encode a sInt32, return a byte array]
 * @param  {[sInt32]} num  The sInt32 need to encode
 * @return {[array]} A byte array represent the integer
 */
function encodeSInt32(num) {
    let n = parseInt(num);
    if (isNaN(n)) {
        return null;
    }
    n = n < 0 ? (Math.abs(n) * 2 - 1) : n * 2;
    return encodeUInt32(n);
}
exports.encodeSInt32 = encodeSInt32;
;
function decodeUInt32(bytes) {
    let n = 0;
    for (let i = 0; i < bytes.length; i++) {
        let m = parseInt(bytes[i]);
        n = n + ((m & 0x7f) * Math.pow(2, (7 * i)));
        if (m < 128) {
            return n;
        }
    }
    return n;
}
exports.decodeUInt32 = decodeUInt32;
;
function decodeSInt32(bytes) {
    let n = decodeUInt32(bytes);
    let flag = ((n % 2) === 1) ? -1 : 1;
    n = ((n % 2 + n) / 2) * flag;
    return n;
}
exports.decodeSInt32 = decodeSInt32;
;
//# sourceMappingURL=codec.js.map
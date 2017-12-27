"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSimpleType(type) {
    return (type === 'uInt32' ||
        type === 'sInt32' ||
        type === 'int32' ||
        type === 'uInt64' ||
        type === 'sInt64' ||
        type === 'float' ||
        type === 'double');
}
exports.isSimpleType = isSimpleType;
;
function equal(obj0, obj1) {
    for (let key in obj0) {
        let m = obj0[key];
        let n = obj1[key];
        if (typeof (m) === 'object') {
            if (!equal(m, n)) {
                return false;
            }
        }
        else if (m !== n) {
            return false;
        }
    }
    return true;
}
exports.equal = equal;
;
//# sourceMappingURL=util.js.map
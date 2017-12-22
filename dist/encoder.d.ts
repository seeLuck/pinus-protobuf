/// <reference types="node" />
export declare class Encoder {
    protos: any;
    constructor(protos: any);
    init(protos: any): void;
    encode(route: any, msg: any): Buffer;
    /**
     * Check if the msg follow the defination in the protos
     */
    checkMsg(msg: any, protos: any): boolean;
    encodeMsg(buffer: any, offset: any, protos: any, msg: any): any;
    encodeProp(value: any, type: any, offset: any, buffer: any, protos?: any): any;
    /**
     * Encode reapeated properties, simple msg and object are decode differented
     */
    encodeArray(array: any, proto: any, offset: any, buffer: any, protos: any): any;
    writeBytes(buffer: any, offset: any, bytes: any): any;
    encodeTag(type: string, tag: any): any[];
}

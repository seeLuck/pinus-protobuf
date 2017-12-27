/// <reference types="node" />
import * as constant from './constant';
export declare class Encoder {
    protos: any;
    constructor(protos: any);
    init(protos: any): void;
    encode(route: string, msg: {
        [key: string]: any;
    }): Buffer;
    /**
     * Check if the msg follow the defination in the protos
     */
    checkMsg(msg: {
        [key: string]: any;
    }, protos: {
        [key: string]: any;
    }): boolean;
    encodeMsg(buffer: Buffer, offset: number, protos: {
        [key: string]: any;
    }, msg: {
        [key: string]: any;
    }): number;
    encodeProp(value: any, type: string, offset: number, buffer: Buffer, protos?: {
        [key: string]: any;
    }): number;
    /**
     * Encode reapeated properties, simple msg and object are decode differented
     */
    encodeArray(array: Array<number>, proto: {
        [key: string]: any;
    }, offset: number, buffer: Buffer, protos: {
        [key: string]: any;
    }): number;
    writeBytes(buffer: Buffer, offset: number, bytes: Array<number>): number;
    encodeTag(type: constant.TYPES, tag: string): number[];
}

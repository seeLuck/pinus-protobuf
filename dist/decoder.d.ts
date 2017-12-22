/// <reference types="node" />
export declare class Decoder {
    buffer: Buffer;
    offset: number;
    protos: any;
    constructor(protos: any);
    init(protos: any): void;
    setProtos(protos: any): void;
    decode(route: any, buf: any): any;
    decodeMsg(msg: any, protos: any, length: any): any;
    /**
     * Test if the given msg is finished
     */
    isFinish(msg: any, protos: any): boolean;
    /**
     * Get property head from protobuf
     */
    getHead(): {
        type: number;
        tag: number;
    };
    /**
     * Get tag head without move the offset
     */
    peekHead(): {
        type: number;
        tag: number;
    };
    decodeProp(type: any, protos?: any): {};
    decodeArray(array: any, type: any, protos: any): void;
    getBytes(flag?: boolean): any[];
    peekBytes(): any[];
}

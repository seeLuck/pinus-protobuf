/// <reference types="node" />
export declare class Decoder {
    buffer: Buffer;
    offset: number;
    protos: any;
    constructor(protos: object);
    init(protos: object): void;
    setProtos(protos: object): void;
    decode(route: string, buf: Buffer): {
        [key: string]: any;
    };
    decodeMsg(msg: {
        [key: string]: any;
    }, protos: {
        [key: string]: any;
    }, length: number): {
        [key: string]: any;
    };
    /**
     * Test if the given msg is finished
     */
    isFinish(msg: object, protos: {
        [key: string]: any;
    }): boolean;
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
    decodeProp(type: string, protos?: {
        [key: string]: any;
    }): {};
    decodeArray(array: Array<object>, type: string, protos: object): void;
    getBytes(flag?: boolean): number[];
    peekBytes(): number[];
}

/// <reference types="node" />
import { Encoder } from './encoder';
import { Decoder } from './decoder';
export declare class Protobuf {
    encoder: Encoder;
    decoder: Decoder;
    constructor(opts: {
        encoderProtos: object;
        decoderProtos: object;
    });
    /**
     * [encode the given message, return a Buffer represent the message encoded by protobuf]
     * @param  {[type]} key The key to identify the message type.
     * @param  {[type]} msg The message body, a js object.
     * @return {[type]} The binary encode result in a Buffer.
     */
    encode(key: string, msg: object): Buffer;
    encode2Bytes(key: string, msg: object): Uint8Array;
    encodeStr(key: string, msg: object, code: string): string | Buffer;
    decode(key: string, msg: Buffer): {
        [key: string]: any;
    };
    decodeStr(key: string, str: string, code: string): {
        [key: string]: any;
    };
    static parse(json: object): {
        [key: string]: any;
    };
    setEncoderProtos(protos: object): void;
    setDecoderProtos(protos: object): void;
}

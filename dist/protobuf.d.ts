/// <reference types="node" />
import { Encoder } from './encoder';
import { Decoder } from './decoder';
export declare class Protobuf {
    encoder: Encoder;
    decoder: Decoder;
    constructor(opts: any);
    /**
     * [encode the given message, return a Buffer represent the message encoded by protobuf]
     * @param  {[type]} key The key to identify the message type.
     * @param  {[type]} msg The message body, a js object.
     * @return {[type]} The binary encode result in a Buffer.
     */
    encode(key: any, msg: any): Buffer;
    encode2Bytes(key: any, msg: any): Uint8Array;
    encodeStr(key: any, msg: any, code: any): string | Buffer;
    decode(key: any, msg: any): any;
    decodeStr(key: any, str: any, code: any): any;
    parse(json: any): {};
    setEncoderProtos(protos: any): void;
    setDecoderProtos(protos: any): void;
}

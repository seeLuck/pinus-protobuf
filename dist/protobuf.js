"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encoder_1 = require("./encoder");
const decoder_1 = require("./decoder");
const parser = require("./parser");
class Protobuf {
    constructor(opts) {
        //On the serverside, use serverProtos to encode messages send to client
        this.encoder = new encoder_1.Encoder(opts.encoderProtos);
        //On the serverside, user clientProtos to decode messages receive from clients
        this.decoder = new decoder_1.Decoder(opts.decoderProtos);
    }
    ;
    /**
     * [encode the given message, return a Buffer represent the message encoded by protobuf]
     * @param  {[type]} key The key to identify the message type.
     * @param  {[type]} msg The message body, a js object.
     * @return {[type]} The binary encode result in a Buffer.
     */
    encode(key, msg) {
        return this.encoder.encode(key, msg);
    }
    ;
    encode2Bytes(key, msg) {
        let buffer = this.encode(key, msg);
        if (!buffer || !buffer.length) {
            console.warn('encode msg failed! key : %j, msg : %j', key, msg);
            return null;
        }
        let bytes = new Uint8Array(buffer.length);
        for (let offset = 0; offset < buffer.length; offset++) {
            bytes[offset] = buffer.readUInt8(offset);
        }
        return bytes;
    }
    ;
    encodeStr(key, msg, code) {
        code = code || 'base64';
        let buffer = this.encode(key, msg);
        return !!buffer ? buffer.toString(code) : buffer;
    }
    ;
    decode(key, msg) {
        return this.decoder.decode(key, msg);
    }
    ;
    decodeStr(key, str, code) {
        code = code || 'base64';
        let buffer = new Buffer(str, code);
        return !!buffer ? this.decode(key, buffer) : buffer;
    }
    ;
    static parse(json) {
        return parser.parse(json);
    }
    ;
    setEncoderProtos(protos) {
        this.encoder.init(protos);
    }
    ;
    setDecoderProtos(protos) {
        this.decoder.init(protos);
    }
    ;
}
exports.Protobuf = Protobuf;
//# sourceMappingURL=protobuf.js.map
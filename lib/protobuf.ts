import { Encoder} from './encoder';
import { Decoder} from './decoder';
import * as parser from './parser';

export class Protobuf
{
    encoder: Encoder;
    decoder: Decoder;

    constructor(opts)
    {
        //On the serverside, use serverProtos to encode messages send to client
        this.encoder = new Encoder(opts.encoderProtos);

        //On the serverside, user clientProtos to decode messages receive from clients
        this.decoder = new Decoder(opts.decoderProtos);

    };
    /**
     * [encode the given message, return a Buffer represent the message encoded by protobuf]
     * @param  {[type]} key The key to identify the message type.
     * @param  {[type]} msg The message body, a js object.
     * @return {[type]} The binary encode result in a Buffer.
     */
    encode(key, msg)
    {
        return this.encoder.encode(key, msg);
    };

    encode2Bytes(key, msg)
    {
        var buffer = this.encode(key, msg);
        if (!buffer || !buffer.length)
        {
            console.warn('encode msg failed! key : %j, msg : %j', key, msg);
            return null;
        }
        var bytes = new Uint8Array(buffer.length);
        for (var offset = 0; offset < buffer.length; offset++)
        {
            bytes[offset] = buffer.readUInt8(offset);
        }

        return bytes;
    };

    encodeStr(key, msg, code)
    {
        code = code || 'base64';
        var buffer = this.encode(key, msg);
        return !!buffer ? buffer.toString(code) : buffer;
    };

    decode(key, msg)
    {
        return this.decoder.decode(key, msg);
    };

    decodeStr(key, str, code)
    {
        code = code || 'base64';
        var buffer = new Buffer(str, code);

        return !!buffer ? this.decode(key, buffer) : buffer;
    };

    static parse(json)
    {
        return parser.parse(json);
    };

    setEncoderProtos(protos)
    {
        this.encoder.init(protos);
    };

    setDecoderProtos(protos)
    {
        this.decoder.init(protos);
    };
}
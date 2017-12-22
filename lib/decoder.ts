import * as codec from './codec';
import * as util from './util';


export class Decoder
{
    buffer: Buffer;
    offset = 0;
    protos: any;


    constructor(protos)
    {
        this.init(protos);
    };

    init(protos)
    {
        this.protos = protos || {};
    }

    setProtos(protos)
    {
        if (!!protos)
        {
            this.protos = protos;
        }
    };

    decode(route, buf)
    {
        var protos = this.protos[route];

        this.buffer = buf;
        this.offset = 0;

        if (!!protos)
        {
            return this.decodeMsg({}, protos, this.buffer.length);
        }

        return null;
    };
    decodeMsg(msg, protos, length)
    {
        while (this.offset < length)
        {
            var head = this.getHead();
            var type = head.type;
            var tag = head.tag;
            var name = protos.__tags[tag];

            switch (protos[name].option)
            {
                case 'optional':
                case 'required':
                    msg[name] = this.decodeProp(protos[name].type, protos);
                    break;
                case 'repeated':
                    if (!msg[name])
                    {
                        msg[name] = [];
                    }
                    this.decodeArray(msg[name], protos[name].type, protos);
                    break;
            }
        }

        return msg;
    }

    /**
     * Test if the given msg is finished
     */
    isFinish(msg, protos)
    {
        return (!protos.__tags[this.peekHead().tag]);
    }
    /**
     * Get property head from protobuf
     */
    getHead()
    {
        var tag = codec.decodeUInt32(this.getBytes());

        return {
            type: tag & 0x7,
            tag: tag >> 3
        };
    }

    /**
     * Get tag head without move the offset
     */
    peekHead()
    {
        var tag = codec.decodeUInt32(this.peekBytes());

        return {
            type: tag & 0x7,
            tag: tag >> 3
        };
    }

    decodeProp(type, protos ?: any)
    {
        switch (type)
        {
            case 'uInt32':
                return codec.decodeUInt32(this.getBytes());
            case 'int32':
            case 'sInt32':
                return codec.decodeSInt32(this.getBytes());
            case 'float':
                var float = this.buffer.readFloatLE(this.offset);
                this.offset += 4;
                return float;
            case 'double':
                var double = this.buffer.readDoubleLE(this.offset);
                this.offset += 8;
                return double;
            case 'string':
                var length = codec.decodeUInt32(this.getBytes());

                var str = this.buffer.toString('utf8', this.offset, this.offset + length);
                this.offset += length;

                return str;
            default:
                var message = protos && (protos.__messages[type] || this.protos['message ' + type]);
                if (message)
                {
                    var length = codec.decodeUInt32(this.getBytes());
                    var msg = {};
                    this.decodeMsg(msg, message, this.offset + length);
                    return msg;
                }
                break;
        }
    }

    decodeArray(array, type, protos)
    {
        if (util.isSimpleType(type))
        {
            var length = codec.decodeUInt32(this.getBytes());

            for (var i = 0; i < length; i++)
            {
                array.push(this.decodeProp(type));
            }
        } else
        {
            array.push(this.decodeProp(type, protos));
        }
    }

    getBytes(flag ?: boolean)
    {
        var bytes = [];
        var pos = this.offset;
        flag = flag || false;

        var b : number;
        do
        {
            b = this.buffer.readUInt8(pos);
            bytes.push(b);
            pos++;
        } while (b >= 128);

        if (!flag)
        {
            this.offset = pos;
        }
        return bytes;
    }

    peekBytes()
    {
        return this.getBytes(true);
    }
}
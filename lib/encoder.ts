import * as codec from './codec';
import * as constant from './constant';
import * as util from './util';

export class Encoder
{
    protos: any;

    constructor(protos)
    {
        this.init(protos);
    };

    init(protos)
    {
        this.protos = protos || {};
    }

    encode(route, msg)
    {
        if (!route || !msg)
        {
            console.warn('Route or msg can not be null! route : %j, msg %j', route, msg);
            return null;
        }

        //Get protos from protos map use the route as key
        var protos = this.protos[route];

        //Check msg
        if (!this.checkMsg(msg, protos))
        {
            console.warn('check msg failed! msg : %j, proto : %j', msg, protos);
            return null;
        }

        //Set the length of the buffer 2 times bigger to prevent overflow
        var length = Buffer.byteLength(JSON.stringify(msg)) * 2;

        //Init buffer and offset
        var buffer = new Buffer(length);
        var offset = 0;

        if (!!protos)
        {
            offset = this.encodeMsg(buffer, offset, protos, msg);
            if (offset > 0)
            {
                return buffer.slice(0, offset);
            }
        }

        return null;
    };

    /**
     * Check if the msg follow the defination in the protos
     */
    checkMsg(msg, protos)
    {
        if (!protos || !msg)
        {
            console.warn('no protos or msg exist! msg : %j, protos : %j', msg, protos);
            return false;
        }

        for (var name in protos)
        {
            var proto = protos[name];

            //All required element must exist
            switch (proto.option)
            {
                case 'required':
                    if (typeof (msg[name]) === 'undefined')
                    {
                        console.warn('no property exist for required! name: %j, proto: %j, msg: %j', name, proto, msg);
                        return false;
                    }
                case 'optional':
                    if (typeof (msg[name]) !== 'undefined')
                    {
                        var message = protos.__messages[proto.type] || this.protos['message ' + proto.type];
                        if (!!message && !this.checkMsg(msg[name], message))
                        {
                            console.warn('inner proto error! name: %j, proto: %j, msg: %j', name, proto, msg);
                            return false;
                        }
                    }
                    break;
                case 'repeated':
                    //Check nest message in repeated elements
                    var message = protos.__messages[proto.type] || this.protos['message ' + proto.type];
                    if (!!msg[name] && !!message)
                    {
                        for (var i = 0; i < msg[name].length; i++)
                        {
                            if (!this.checkMsg(msg[name][i], message))
                            {
                                return false;
                            }
                        }
                    }
                    break;
            }
        }

        return true;
    }

    encodeMsg(buffer, offset, protos, msg)
    {
        for (var name in msg)
        {
            if (!!protos[name])
            {
                var proto = protos[name];

                switch (proto.option)
                {
                    case 'required':
                    case 'optional':
                        offset = this.writeBytes(buffer, offset, this.encodeTag(proto.type, proto.tag));
                        offset = this.encodeProp(msg[name], proto.type, offset, buffer, protos);
                        break;
                    case 'repeated':
                        if (!!msg[name] && msg[name].length > 0)
                        {
                            offset = this.encodeArray(msg[name], proto, offset, buffer, protos);
                        }
                        break;
                }
            }
        }

        return offset;
    }

    encodeProp(value, type, offset, buffer, protos ?: any)
    {
        var length = 0;

        switch (type)
        {
            case 'uInt32':
                offset = this.writeBytes(buffer, offset, codec.encodeUInt32(value));
                break;
            case 'int32':
            case 'sInt32':
                offset = this.writeBytes(buffer, offset, codec.encodeSInt32(value));
                break;
            case 'float':
                buffer.writeFloatLE(value, offset);
                offset += 4;
                break;
            case 'double':
                buffer.writeDoubleLE(value, offset);
                offset += 8;
                break;
            case 'string':
                length = Buffer.byteLength(value);

                //Encode length
                offset = this.writeBytes(buffer, offset, codec.encodeUInt32(length));
                //write string
                buffer.write(value, offset, length);
                offset += length;
                break;
            default:
                var message = protos.__messages[type] || this.protos['message ' + type];
                if (!!message)
                {
                    //Use a tmp buffer to build an internal msg
                    var tmpBuffer = new Buffer(Buffer.byteLength(JSON.stringify(value)) * 2);
                    length = 0;

                    length = this.encodeMsg(tmpBuffer, length, message, value);
                    //Encode length
                    offset = this.writeBytes(buffer, offset, codec.encodeUInt32(length));
                    //contact the object
                    tmpBuffer.copy(buffer, offset, 0, length);

                    offset += length;
                }
                break;
        }

        return offset;
    }

    /**
     * Encode reapeated properties, simple msg and object are decode differented
     */
    encodeArray(array, proto, offset, buffer, protos)
    {
        var i = 0;
        if (util.isSimpleType(proto.type))
        {
            offset = this.writeBytes(buffer, offset, this.encodeTag(proto.type, proto.tag));
            offset = this.writeBytes(buffer, offset, codec.encodeUInt32(array.length));
            for (i = 0; i < array.length; i++)
            {
                offset = this.encodeProp(array[i], proto.type, offset, buffer);
            }
        } else
        {
            for (i = 0; i < array.length; i++)
            {
                offset = this.writeBytes(buffer, offset, this.encodeTag(proto.type, proto.tag));
                offset = this.encodeProp(array[i], proto.type, offset, buffer, protos);
            }
        }

        return offset;
    }

    writeBytes(buffer, offset, bytes)
    {
        for (var i = 0; i < bytes.length; i++)
        {
            buffer.writeUInt8(bytes[i], offset);
            offset++;
        }

        return offset;
    }

    encodeTag(type : string, tag)
    {
        var value : number = constant.TYPES[type];

        if (value === undefined) value = 2;

        return codec.encodeUInt32((tag << 3) | value);
    }
}
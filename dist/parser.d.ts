/**
 * [parse the original protos, give the paresed result can be used by protobuf encode/decode.]
 * @param  {[Object]} protos Original protos, in a js map.
 * @return {[Object]} The presed result, a js object represent all the meta data of the given protos.
 */
export declare function parse(protos: {
    [key: string]: any;
}): {
    [key: string]: any;
};

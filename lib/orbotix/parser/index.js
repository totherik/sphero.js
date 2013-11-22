'use strict';


var async = require('./async'),
    errors = require('./errors');


function series(binary) {
    var binaries = [];
    return (function make(a, b) {
        if (typeof a === 'function') {
            binaries.push(a);
            return make;
        }

        binaries.forEach(function (binary) {
            binary(a, b);
        });

        return undefined;
    }(binary));
}


function asyncb(emitter, buffer) {
    var sop2, id, size, data, chk, msg;

    sop2 = buffer.readUInt8(1);

    if (sop2 === 0xfe) {

        id   = buffer.readUInt8(2);
        size = buffer.readUInt16BE(3);
        data = buffer.slice(5, size - 1);
        chk  = buffer.readUInt8(buffer.length - 1);

        msg = async[id];
        if (msg.chk !== chk) {
            emitter.emit('error', 'invalid checksum');
            return;
        }

        data = msg.deserialize(data);
        emitter.emit(msg.name, data);

    }
}


function mrspb(emitter, buffer) {
    var sop2, mrsp, seq, msg, chk, err;

    sop2 = buffer.readUInt8(1);
    mrsp = buffer.readUInt8(2);

    if (sop2 === 0xff && mrsp > 0x00) {

        seq  = buffer.readUInt8(3);
        chk  = buffer.readUInt8(buffer.length - 1);

        err = new Error(errors[mrsp].message);
        err.code = errors[mrsp].code;

        if (msg) {
            emitter.emit('packet', {
                seq: seq,
                chk: chk,
                data: undefined,
                error: err
            });
            return;
        }

        emitter.emit('error', err);

    }
}


function ackb(emitter, buffer) {
    var sop2, mrsp, seq,  size, data, chk;

    sop2 = buffer.readUInt8(1);
    mrsp = buffer.readUInt8(2);

    if (sop2 === 0xff && mrsp === 0x00) {

        seq  = buffer.readUInt8(3);
        size = buffer.readUInt8(4);
        data = buffer.slice(5, size - 1);
        chk  = buffer.readUInt8(buffer.length - 1);

        emitter.emit('packet', {
            seq: seq,
            chk: chk,
            data: data,
            error: undefined
        });

    }
}


module.exports = series(ackb)(mrspb)(asyncb);
'use strict';


var async = require('./async'),
    errors = require('./errors'),
    debug = require('debuglog')('sphero.js');

var DATA_START = 5;

function tick(emitter, name, data) {
    setImmediate(emitter.emit.bind(emitter, name, data));
}

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


function chunk(fn) {
    var data = new Buffer(0);
    return function (emitter, buffer) {
        var sop2, end;

        if (!data.length && buffer.length && buffer[0] === 0x0d) {
            // Occasionally seeing a single 0x0b byte at the beginning
            // of an otherwise normal packet payload. Not sure why.
            debug('malformed packet', buffer);
            buffer = buffer.slice(1);
        }

        data = Buffer.concat([data, buffer]);
        if (data.length < 4) {
            // Wait for another chunk
            return;
        }

        sop2 = data.readUInt8(1);
        switch (sop2) {
            case 0xff:
                end = DATA_START + data.readUInt8(4);
                break;
            case 0xfe:
                end = DATA_START + data.readUInt16BE(3);
                break;
        }

        if (data.length < end) {
            // Wait for another chunk
            return;
        }
        
        buffer = data.slice(0, end);
        data = data.slice(end);

        fn(emitter, buffer);
    }
}




function ackb(emitter, buffer) {
    var sop2, mrsp, seq, len, data, chk;

    sop2 = buffer.readUInt8(1);
    mrsp = buffer.readUInt8(2);

    if (sop2 === 0xff && mrsp === 0x00) {

        seq  = buffer.readUInt8(3);
        len  = buffer.readUInt8(4);
        data = buffer.slice(DATA_START, DATA_START + len - 1);
        chk  = buffer.readUInt8(buffer.length - 1);

        tick(emitter, 'packet', {
            seq: seq,
            chk: chk,
            data: data,
            error: undefined
        });

    }
}


function mrspb(emitter, buffer) {
    var sop1, sop2, mrsp, seq, msg, chk, err;

    sop1 = buffer.readUInt8(0);
    sop2 = buffer.readUInt8(1);
    mrsp = buffer.readUInt8(2);


    if (sop1 === 0xff && sop2 === 0xff && mrsp > 0x00) {

        seq  = buffer.readUInt8(3);
        chk  = buffer.readUInt8(buffer.length - 1);

        err = new Error(errors[mrsp].message);
        err.code = errors[mrsp].code;

        if (msg) {
            tick(emitter, 'packet', {
                seq: seq,
                chk: chk,
                data: undefined,
                error: err
            });
            return;
        }

        tick(emitter, 'error', err);

    }
}


function asyncb(emitter, buffer) {
    var sop1, sop2, id, len, data, chk, msg;

    sop1 = buffer.readUInt8(0);
    sop2 = buffer.readUInt8(1);

    if (sop1 === 0xff && sop2 === 0xfe) {

        id   = buffer.readUInt8(2);
        len = buffer.readUInt16BE(3);
        data = buffer.slice(DATA_START, DATA_START + len - 1);

        msg = async[id];
        data = msg.deserialize(data);
        tick(emitter, msg.name, data);

    }
}


module.exports = function () {
    return chunk(series(ackb)(mrspb)(asyncb));
};
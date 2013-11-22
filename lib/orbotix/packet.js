'use strict';

var slice, proto;
slice = Function.prototype.call.bind(Array.prototype.slice);


function checksum(buffer) {
    return new Buffer([sum(buffer) & 0xFF ^ 0xFF]);
}


function sum(a, b) {
    if (a.length) {
        return slice(a).reduce(sum);
    }
    return a + b;
}


proto = {

    sop: 0xff,

    sop2: 0xfc,

    toBuffer: function () {
        var sop2, buffer;

        sop2 = this.sop2;
        sop2 |= this.requestAck && 0x01;
        sop2 |= this.resetTimeout && 0x02;

        buffer = new Buffer(6);
        buffer.writeUInt8(this.sop, 0);
        buffer.writeUInt8(sop2,     1);
        buffer.writeUInt8(this.did, 2);
        buffer.writeUInt8(this.cid, 3);
        buffer.writeUInt8(this.seq, 4);
        buffer.writeUInt8(this.data.length + 1, 5);

        buffer = Buffer.concat([buffer, this.data]);
        buffer = Buffer.concat([buffer, checksum(buffer)]);

        return buffer;
    }

};


exports.create = function (did, cid, options) {

    options = options || {};

    return Object.create(proto, {

        did: {
            value: did,
            enumerable: true,
            writable: true
        },

        cid: {
            value: cid,
            enumerable: true,
            writable: true
        },

        seq: {
            value: 0,
            enumerable: true,
            writable: true
        },

        chk: {
            value: undefined,
            enumerable: true,
            writable: true
        },

        resetTimeout: {
            value: options.resetTimeout || false,
            enumerable: true,
            writable: true
        },

        requestAck: {
            value: options.requestAck || false,
            enumerable: true,
            writable: true
        },

        data: {
            value: undefined,
            enumerable: true,
            writable: true
        },

        response: {
            value: undefined,
            enumerable: true,
            writable: true
        }

    });
};

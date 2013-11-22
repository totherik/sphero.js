'use strict';

function spec(did, cid, name, fn) {
    return {
        did: did,
        cid: cid,
        name: name,
        deserialize: fn
    };
}


var res = [];


res[0x01] = spec(0x00, 0x21, 'power status', function (buffer) {
    switch (buffer.readUInt8(0)) {
        case 1:
            return 'Battery Charging';
        case 2:
            return 'Battery OK';
        case 3:
            return 'Battery Low';
        case 4:
            return 'Battery Critical';
        default:
            return undefined;
    }
});


res[0x02] = spec(0x00, 0x40, 'level 1 diagnostics', function (buffer) {
    return buffer.toString('ascii');
});


res[0x03] = spec(0x02, 0x11, 'sensor data', function (buffer) {
    return buffer;
});


res[0x04] = spec(0x02, 0x40, 'configuration', function (buffer) {
    return buffer;
});


res[0x05] = spec(null, null, 'sleep warning', function () {
    return undefined;
});


res[0x06] = spec(null, null, 'macro marker', function (buffer) {
    return buffer;
});


res[0x07] = spec(0x02, 0x12, 'collision', function () {
    return undefined;
});


res[0x08] = spec(null, null, 'orbBasic message', function (buffer) {
    return buffer.toString('ascii');
});


res[0x09] = spec(null, null, 'orbBasic error', function (buffer) {
    return buffer.toString('ascii');
});


res[0x0a] = spec(null, null, 'orbBasic error', function (buffer) {
    return buffer.toString('ascii');
});


res[0x0b] = spec(0x02, 0x09, 'self-level', function (buffer) {
    switch (buffer.readUInt8(0)) {
        case 1:
            return 'Timed Out';
        case 2:
            return 'Sensors Error';
        case 3:
            return 'Self Level Disabled';
        case 4:
            return 'Aborted';
        case 5:
            return 'Charger not found';
        case 6:
            return 'Success';
        default:
            return 'Unknown';
    }
});


res[0x0c] = spec(null, null, 'gyro axis limit exceeded', function mask(buffer) {
    var mask = buffer.readUInt8(0);
    return {
        xPositive: !!(mask & 1),
        xNegative: !!(mask & 2),
        yPositive: !!(mask & 4),
        yNegative: !!(mask & 8),
        zPositive: !!(mask & 16),
        zNegative: !!(mask & 32)
    };
});


res[0x0d] = spec(0x02, 0x43, 'sphero soul data', function (buffer) {
    return buffer;
});


res[0x0e] = spec(null, null, 'level up', function (buffer) {
    return {
        level: buffer.readUInt16BE(0),
        points: buffer.readUInt16BE(2)
    }
});


res[0x0f] = spec(null, null, 'shield damage', function (buffer) {
    return Math.floor((buffer.readUInt8(0) / 255) * 100);
});


res[0x10] = spec(null, null, 'experience', function (buffer) {
    return Math.floor((buffer.readUInt8(0) / 255) * 100);
});


res[0x11] = spec(null, null, 'boost', function (buffer) {
    return Math.floor((buffer.readUInt8(0) / 255) * 100);
});

module.exports = res;

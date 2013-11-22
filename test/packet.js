'use strict';

var test = require('tap').test,
    packet = require('../lib/orbotix/packet');


test('packet create', function (t) {

    var p = packet.create();
    t.equal(p.did, undefined);
    t.equal(p.cid, undefined);
    t.equal(p.chk, undefined);
    t.equal(p.data, undefined);
    t.equal(p.response, undefined);
    t.equal(p.seq, 0);
    t.equal(p.resetTimer, false);
    t.equal(p.requestAck, false);
    t.end();

});

test('packet create with args', function (t) {

    var p = packet.create(0x00, 0x00, { resetTimer: true, requestAck: true});
    t.equal(p.did, 0x00);
    t.equal(p.cid, 0x00);
    t.equal(p.chk, undefined);
    t.equal(p.data, undefined);
    t.equal(p.response, undefined);
    t.equal(p.seq, 0);
    t.equal(p.resetTimer, true);
    t.equal(p.requestAck, true);
    t.end();

});

test('packet buffer with data', function (t) {

    var p = packet.create(0x01, 0x02);
    p.data = new Buffer([0xff, 0xfe, 0xfd]);

    var data = p.toBuffer();
    t.equal(data.length, 10);
    t.equal(data[0], 0xff); // sop
    t.equal(data[1], 0xfc); // sop2
    t.equal(data[2], 0x01); // did
    t.equal(data[3], 0x02); // cid
    t.equal(data[4], 0x00); // seq
    t.equal(data[5], 0x04); // len (data.length + chk)
    t.equal(data[6], 0xff); // data[0];
    t.equal(data[7], 0xfe); // data[1];
    t.equal(data[8], 0xfd); // data[2];
    t.equal(data[9], 0x03); // chk
    t.end();

});

test('packet buffer with resetTimer', function (t) {

    var p = packet.create(0x01, 0x02, { resetTimer: true });
    p.data = new Buffer([0xff, 0xfe, 0xfd]);

    var data = p.toBuffer();
    t.equal(data.length, 10);
    t.equal(data[0], 0xff); // sop
    t.equal(data[1], 0xfc | 0x02); // sop2
    t.equal(data[2], 0x01); // did
    t.equal(data[3], 0x02); // cid
    t.equal(data[4], 0x00); // seq
    t.equal(data[5], 0x04); // len (data.length + chk)
    t.equal(data[6], 0xff); // data[0];
    t.equal(data[7], 0xfe); // data[1];
    t.equal(data[8], 0xfd); // data[2];
    t.equal(data[9], 0x01); // chk
    t.end();

});


test('packet buffer with requestAck', function (t) {

    var p = packet.create(0x01, 0x02, { requestAck: true });
    p.data = new Buffer([0xff, 0xfe, 0xfd]);

    var data = p.toBuffer();
    t.equal(data.length, 10);
    t.equal(data[0], 0xff); // sop
    t.equal(data[1], 0xfc | 0x01); // sop2
    t.equal(data[2], 0x01); // did
    t.equal(data[3], 0x02); // cid
    t.equal(data[4], 0x00); // seq
    t.equal(data[5], 0x04); // len (data.length + chk)
    t.equal(data[6], 0xff); // data[0];
    t.equal(data[7], 0xfe); // data[1];
    t.equal(data[8], 0xfd); // data[2];
    t.equal(data[9], 0x02); // chk
    t.end();

});


test('packet buffer with resetTimer and requestAck', function (t) {

    var p = packet.create(0x01, 0x02, { resetTimer: true, requestAck: true });
    p.data = new Buffer([0xff, 0xfe, 0xfd]);

    var data = p.toBuffer();
    t.equal(data.length, 10);
    t.equal(data[0], 0xff); // sop
    t.equal(data[1], 0xfc | 0x01 | 0x02); // sop2
    t.equal(data[2], 0x01); // did
    t.equal(data[3], 0x02); // cid
    t.equal(data[4], 0x00); // seq
    t.equal(data[5], 0x04); // len (data.length + chk)
    t.equal(data[6], 0xff); // data[0];
    t.equal(data[7], 0xfe); // data[1];
    t.equal(data[8], 0xfd); // data[2];
    t.equal(data[9], 0x00); // chk
    t.end();

});


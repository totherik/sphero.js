'use strict';


var test = require('tap').test,
    events = require('events'),
    sphero_js = require('../index');

var options = {
    device: '/dev/cu.Bluetooth-Incoming-Port',
    resetTimeout: true,
    requestAck: false
};


test('sphero factory', function (t) {

    t.equal(typeof sphero_js, 'object');
    t.equal(typeof sphero_js.createRobot, 'function');
    t.equal(sphero_js.createRobot.length, 1);
    t.end();

});


test('sphero create', function (t) {

    var robot = sphero_js.createRobot(options);
    t.ok(robot);
    t.ok(robot instanceof events.EventEmitter);
    t.equal(typeof robot.open, 'function');
    t.equal(typeof robot.close, 'function');
    t.equal(robot.resetTimeout, options.resetTimeout);
    t.equal(robot.requestAck, options.requestAck);

    var sphero = Object.getPrototypeOf(robot);
    t.equal(sphero.DID, 0x02);

    var core = Object.getPrototypeOf(sphero);
    t.equal(core.DID, 0x00);

    var serial = Object.getPrototypeOf(core);
    t.ok(serial);

    t.end();

});


test('sphero ack', function (t) {
    var robot;

    robot = sphero_js.createRobot(options);
    robot.write = function (buffer) {
        t.ok(buffer);
        robot.emit('packet', {
            seq: 0,
            chk: 0,
            data: new Buffer([0xff]),
            error: undefined
        });
    };

    robot.on('ack', function (packet) {
        t.ok(packet);
        t.end();
    });

    robot.ping({ requestAck: true });
});


test('sphero error', function (t) {
    var robot;

    robot = sphero_js.createRobot(options);
    robot.write = function (buffer) {
        t.ok(buffer);
        robot.emit('packet', {
            seq: 0,
            chk: 0,
            data: undefined,
            error: new Error('test')
        });
    };

    robot.on('error', function (err) {
        t.ok(err);
        t.equal(err.message, 'test');
        t.end();
    });

    robot.ping({ requestAck: true });
});
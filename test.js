'use strict';

var sphero = require('./index'),
    debug = require('debuglog')('sphero.js');

var connected = false;
var timer, interval;


function stop() {
    clearTimeout(timer);
    robot.roll(0, 0, 0);
}

function close() {
    if (connected) {
        debug('closing');
        connected = false;
        setTimeout(robot.close.bind(robot), 10);
    } else {
        debug('not connected');
    }
}

process.on('uncaughtException', function (err) {
    debug(err.stack);
    close();
});


var robot = sphero.createRobot({
    device: '/dev/cu.Sphero-YWR-AMP-SPP',
    resetTimeout: true,
    requestAck: false
});

//robot.on('packet', function (packet) {
//    debug('packet', packet);
//});
//
//robot.on('ack', function (packet) {
//    debug('ack', packet);
//});


robot.on('error', function (err) {
    debug('ERR', err);
    close();
});


robot.on('collision', function () {
    console.log('HEY! Watch out!');
});


robot.on('open', function () {
    var degrees = 0;

    debug('connected');
    connected = true;

    function start() {
        robot.roll(25, degrees, 1);
        turn();
    }

    function turn() {
        debug('turning', degrees);
        robot.setHeading(degrees);
        degrees += 5;
        if (degrees >= 360) {
            degrees -= 360;
        }
        timer = setTimeout(turn, 100);
    }

    (function location() {
        robot.readLocator(function (err, packet) {
            debug(err || packet.response);
            interval = setTimeout(location, 500);
        });
    }());

    robot.configureCollisionDetection(1, 100, 0, 100, 0, 100);
    robot.on('collision', function () {
        stop();
        setTimeout(start, 2500);
    });


    robot.getBluetoothInfo(function (err, data) {
        debug('bluetooth', data);
    });

    process.on('SIGINT', function () {
        clearInterval(interval);
        stop();
    });

    start();
//
//    robot.configureCollisionDetection(1, 100, 0, 100, 0, 100);
//    robot.readLocator(function (err, data) {
//        if (err) {
//            debug('ERROR', err);
//            return;
//        }
//        debug('location', data);
//    });

//    var timeout, count = 0;
//    (function seesaw () {
//        robot.roll(50, count % 2 ? 0 : 180, 1);
//        count += 1;
//        timeout = setTimeout(seesaw, 1000);
//    }());
//
//    process.on('SIGINT', function () {
//        debug('stopping');
//        robot.roll(0, 0, 0, function () {
//            debug('stopped, closing');
//            clearTimeout(timeout);
//            setTimeout(robot.close.bind(robot), 10);
//        });
//    });

});

robot.on('close', function () {
    debug('closed');
    process.exit(0);
});

process.on('SIGINT', close);

debug('connecting...');
robot.open();

'use strict';


var sphero = require('./index');

var robot = sphero.createRobot({
    device: '/dev/cu.Sphero-YWR-AMP-SPP',
    resetTimeout: true,
    requestAck: false
});

robot.open();
robot.ping();
robot.roll(50, 0, 1);
setTimeout(function () {
    robot.roll(0, 0, 0);
    robot.close();
}, 1000);
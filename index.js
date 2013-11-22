'use strict';

var orbotix = require('./lib/orbotix'),
    sphero = require('./lib/sphero');

module.exports = orbotix.registerRobot('sphero', sphero);

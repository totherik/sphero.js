'use strict';

var orbotix = require('./orbotix'),
    sphero = require('./sphero');

module.exports = orbotix.registerRobot('sphero', sphero);

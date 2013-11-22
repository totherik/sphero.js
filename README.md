### sphero.js

An API client for [Sphero] (http://www.gosphero.com/) robots (inspired by [spheron] (https://github.com/alchemycs/spheron)).

```javascript
'use strict';

var sphero = require('sphero.js');


var robot = sphero.createRobot('/my/device');

robot.on('open', function () {
    robot.ping(function () {
        console.log('pong');
        robot.close();
    });
});

robot.on('error', function (err) {
    console.error(err);
});

robot.on('ack', function (packet) {
    console.log('ack', packet.did, packet.did);
});

robot.on('close', function () {
    console.log('disconnected');
});

robot.open();
```

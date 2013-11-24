'use strict';


exports.DID = 0x00;


exports.ping = {
    cid: 0x01,
    cmd: 'CMD_PING'
};

exports.getVersioning = {
    cid: 0x02,
    cmd: 'CMD_VERSION',
    decode: function (buffer) {
        return {
            'RECV': buffer.readUInt8(0),
            'MDL': buffer.readUInt8(1),
            'MW': buffer.readUInt8(2),
            'MSA-ver': buffer.readUInt8(3),
            'MSA-rev': buffer.readUInt8(4),
            'BL': buffer.readUInt8(5),
            'BAS': buffer.readUInt8(6),
            'MACRO': buffer.readUInt8(7),
            'API-maj': buffer.readUInt8(8),
            'API-min': buffer.readUInt8(9)
        };
    }
};

exports.controlUARTTxLine = {
    cid: 0x03,
    cmd: 'CMD_CONTROL_UART_TX',
    encode: function (enable) {
        return new Buffer([ enable ? 1 : 0 ]);
    }
};

exports.setDeviceName = {
    cid: 0x10,
    cmd: 'CMD_SET_BT_NAME',
    encode: function (name) {
        return new Buffer(name);
    }
};

exports.getBluetoothInfo = {
    cid: 0x11,
    cmd: 'CMD_GET_BT_NAME',
    decode: function (buffer) {
        return {
            name: buffer.toString('ascii', 0, 16),
            bta: buffer.toString('ascii', 16, 28),
            colors: buffer.toString('hex', 29, 32)
        };
    }
};

exports.setAutoReconnect = {
    cid: 0x12,
    cmd: 'CMD_SET_AUTO_RECONNECT',
    encode: function (enable, time) {
        var buffer = new Buffer(2);
        buffer.writeUInt8(enable ? 1 : 0, 0);
        buffer.writeUInt8(time, 1);
        return buffer;
    }
};

exports.getAutoReconnect = {
    cid: 0x13,
    cmd: 'CMD_GET_AUTO_RECONNECT',
    decode: function (buffer) {
        return {
            enabled: (buffer.readUInt8(0) === 1),
            time: buffer.readUInt8(1)
        }
    }
};

exports.getPowerState = {
    cid: 0x20,
    cmd: 'CMD_GET_PWR_STATE',
    decode: function (buffer) {
        return {
            recVer: buffer.readUInt8(0),
            powerState: buffer.readUInt8(1),
            batteryVoltage: buffer.readUInt16BE(2),
            numCharges: buffer.readUInt16BE(4),
            timeSinceCharge: buffer.readUInt16BE(6)
        }
    }
};

exports.setPowerNotification = {
    cid: 0x21,
    cmd: 'CMD_SET_PWR_NOTIFY',
    encode: function (enabled) {
        return new Buffer([ enabled ? 1 : 0 ]);
    }
};

exports.sleep = {
    cid: 0x22,
    cmd: 'CMD_SLEEP',
    encode: function (wakeup, macro, orbBasic) {
        var buffer = new Buffer(5);
        buffer.writeUInt16BE(wakeup, 0);
        buffer.writeUInt8(macro, 2);
        buffer.writeUInt16BE(orbBasic, 3);
        return buffer;
    }

};

exports.getVoltageTripPoints = {
    cid: 0x23,
    cmd: 'GET_POWER_TRIPS',
    decode: function (buffer) {
        return {
            low: buffer.readUInt16BE(0),
            critical: buffer.readUInt16BE(2)
        };
    }
};

exports.setVoltageTripPoints = {
    cid: 0x24,
    cmd: 'SET_POWER_TRIPS',
    encode: function (low, critical) {
        var buffer = new Buffer(4);
        buffer.writeUInt16BE(low, 0);
        buffer.writeUInt16BE(critical, 2);
        return buffer;
    }
};

exports.setInactivityTimeout = {
    cid: 0x25,
    cmd: 'SET_INACTIVE_TIMER',
    encode: function (time) {
        var buffer = new Buffer(2);
        buffer.writeUInt16BE(time, 0);
        return buffer;
    }
};

exports.jumpToBootloader = {
    cid: 0x30,
    cmd: 'CMD_GOTO_BL'
};

exports.performLevel1Diagnostics = {
    cid: 0x40,
    cmd: 'CMD_RUN_L1_DIAGS'
};

exports.performLevel2Diagnostics = {
    cid: 0x41,
    cmd: 'CMD_RUN_L2_DIAGS',
    decode: function (buffer) {
        return buffer;
    }
};

exports.clearCounters = {
    cid: 0x42,
    cmd: 'CMD_CLEAR_COUNTERS'
};

exports.assignTimeValue = {
    cid: 0x50,
    cmd: 'CMD_ASSIGN_TIME',
    encode: function (value) {
        var buffer = new Buffer(4);
        buffer.writeUInt32BE(value);
        return buffer;
    }
};

exports.pollPacketTimes = {
    cid: 0x51,
    cmd: 'CMD_POLL_TIMES',
    encode: function (clientTx) {
        var buffer = new Buffer(4);
        buffer.writeUInt32BE(clientTx);
        return buffer;
    },
    decode: function (buffer) {
        return {
            clientTx: buffer.readUInt32BE(0),
            spheroRx: buffer.readUInt32BE(4),
            spheroTx: buffer.readUInt32BE(8)
        };
    }
};
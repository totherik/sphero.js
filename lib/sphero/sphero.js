'use strict';

exports.DID = 0x02;

exports.setHeading = {
    cid: 0x01,
    cmd: 'CMD_SET_CAL',
    encode: function (heading) {
        var buffer = new Buffer(2);
        buffer.writeUInt16BE(heading, 0);
        return buffer;
    }
};

exports.setStabilization = {
    cid: 0x02,
    cmd: 'CMD_SET_STABILIZ',
    encode: function (enabled) {
        return new Buffer([ enabled ? 1 : 0 ]);
    },
    decode: function (buffer) {
        return buffer.readUInt16BE(0);
    }
};

exports.setRotationRate = {
    cid: 0x03,
    cmd: 'CMD_SET_ROTATION_RATE',
    encode: function (rate) {
        return new Buffer([ rate ]);
    }
};

exports.getChassisId = {
    cid: 0x07,
    cmd: 'CMD_GET_CHASSIS_ID'
};

exports.selfLevel = {
    cid: 0x09,
    cmd: 'CMD_SELF_LEVEL',
    encode: function (options, angleLimit, timeout, trueTime) {
        var flags, buffer;

        flags = 0;
        flags |= options.run && 1;
        flags |= options.rotate && 2;
        flags |= options.sleep && 4;
        flags |= options.controlSystem && 8;

        buffer = new Buffer(4);
        buffer.writeUInt8(flags, 0);
        buffer.writeUInt8(angleLimit, 1);
        buffer.writeUInt8(timeout, 2);
        buffer.writeUInt8(trueTime, 1);
        return buffer;
    }
};

exports.setDataStreaming = {
    cid: 0x11,
    cmd: 'CMD_SET_DATA_STREAMING',
    encode: function (n, m, mask, pcnt, mask2) {
        var buffer = new Buffer(13);
        buffer.writeUInt16BE(n, 0);
        buffer.writeUInt16BE(m, 2);
        buffer.writeUInt32BE(mask, 4);
        buffer.writeUInt8(pcnt, 8);

        if (!mask2) {
            return buffer.slice(0, 9);
        }

        buffer.writeUInt32BE(mask2, 9);
        return buffer;
    }
};

exports.configureCollisionDetection = {
    cid: 0x12,
    cmd: 'CMD_SET_COLLISION_DET',
    encode: function (meth, Xt, Xspd, Yt, Yspd, dead) {
        var buffer = new Buffer(6);
        buffer.writeUInt8(meth, 0);
        buffer.writeUInt8(Xt, 1);
        buffer.writeUInt8(Xspd, 2);
        buffer.writeUInt8(Yt, 3);
        buffer.writeUInt8(Yspd, 4);
        buffer.writeUInt8(dead, 5);
        return buffer;
    }
};

exports.configureLocator = {
    cid: 0x13,
    cmd: 'CMD_LOCATOR',
    encode: function (flags, x, y, yaw) {
        var buffer = new Buffer(13);
        buffer.writeUInt8(flags, 0);
        buffer.writeUInt8(x, 1);
        buffer.writeUInt8(y, 3);
        buffer.writeUInt8(yaw, 5);
        return buffer;
    }
};

exports.setAccelerometerRange = {
    cid: 0x14,
    cmd: 'CMD_SET_ACCELERO',
    encode: function (idx) {
        return new Buffer([idx]);
    }
};

exports.readLocator = {
    cid: 0x15,
    cmd: 'CMD_READ_LOCATOR',
    decode: function (buffer) {
        return {
            xpos: buffer.readInt16BE(0),
            ypos: buffer.readInt16BE(2),
            xvel: buffer.readInt16BE(4),
            yvel: buffer.readInt16BE(6),
            sog: buffer.readUInt16BE(8)
        };
    }
};

exports.setRGB = {
    cid: 0x20,
    cmd: 'CMD_SET_RGB_LED',
    encode: function (rgb, save) {
        var buffer = new Buffer(4);
        buffer.writeUInt8((rgb >> 16) & 0xff, 0);
        buffer.writeUInt8((rgb >> 8) & 0xff, 1);
        buffer.writeUInt8((rgb) & 0xff, 2);
        buffer.writeUInt8(save ? 1 : 0, 3);
        return buffer;
    }
};

exports.setBrightness = {
    cid: 0x21,
    cmd: 'CMD_SET_BACK_LED',
    encode: function (intensity) {
        return new Buffer([intensity]);
    }
};

exports.getRGB = {
    cid: 0x22,
    cmd: 'CMD_GET_RGB_LED',
    decode: function (buffer) {
        var rgb;

        if (buffer.length) {
            var r, g, b;
            r = buffer.readUInt8(0) << 16;
            g = buffer.readUInt8(1) << 8;
            b = buffer.readUInt8(2);
            rgb = r + g + b;
        }

        return rgb;
    }
};

exports.roll = {
    cid: 0x30,
    cmd: 'CMD_ROLL',
    encode: function (speed, heading, state) {
        var buffer = new Buffer(4);
        buffer.writeUInt8(speed, 0);
        buffer.writeUInt16BE(heading, 1);
        buffer.writeUInt8(state, 3);
        return buffer;
    }
};

exports.boost = {
    cid: 0x31,
    cmd: 'CMD_BOOST',
    encode: function (enable) {
        return new Buffer([ enable ? 1 : 0 ]);
    }
};

exports.setRawMotorValues = {
    cid: 0x33,
    cmd: 'CMD_SET_RAW_MOTORS',
    encode: function (leftMode, leftPower, rightMode, rightPower) {
        var buffer = new Buffer(4);
        buffer.writeUInt8(leftMode, 0);
        buffer.writeUInt8(leftPower, 1);
        buffer.writeUInt8(rightMode, 2);
        buffer.writeUInt8(rightPower, 3);
        return buffer;
    }
};

exports.setMotionTimeout = {
    cid: 0x34,
    cmd: 'CMD_SET_MOTION_TO',
    encode: function (time) {
        var buffer = new Buffer(2);
        buffer.writeUInt16BE(time, 0);
        return buffer;
    }
};

exports.setPermanentOptionFlags = {
    cid: 0x35,
    cmd: 'CMD_SET_OPTIONS_FLAG',
    encode: function (flags) {
        var buffer = new Buffer(4);
        buffer.writeUInt32BE(flags, 0);
        return buffer;
    }

};

exports.getPermanentOptionFlags = {
    cid: 0x36,
    cmd: 'CMD_GET_OPTIONS_FLAG',
    decode: function (buffer) {
        return {
            sleepImmediate: buffer.readUInt8(0),
            vectorDrive: buffer.readUInt8(1),
            selfLevelOnCharge: buffer.readUInt8(2),
            ledAlwaysOn: buffer.readUInt8(3),
            motionTimeoutsEnabled: buffer.readUInt8(4),
            demoModeEnabled: buffer.readUInt8(5),
            doubleTapLight: buffer.readUInt8(6),
            doubleTapHeavy: buffer.readUInt8(7),
            gyroMaxMessageEnabled: buffer.readUInt8(8)
        };
    }
};

exports.setTemporaryOptionFlags = {
    cid: 0x37,
    cmd: 'CMD_SET_TEMP_OPTIONS_FLAG',
    encode: function (flags) {
        var buffer = new Buffer(4);
        buffer.writeUInt32BE(flags, 0);
        return buffer;
    }
};

exports.getTemporaryOptionFlags = {
    cid: 0x38,
    cmd: 'CMD_GET_TEMP_OPTIONS_FLAG',
    decode: function (buffer) {
        return {
            stopOnDisconnect: buffer.readUInt8(0)
        };
    }
};

exports.getConfigurationBlock = {
    cid: 0x40,
    cmd: 'CMD_GET_CONFIG_BLK',
    encode: function (id) {
        return new Buffer([ id ]);
    }
};

exports.setSSBModifierBlock = {
    cid: 0x41,
    cmd: 'CMD_SET_SSB_PARAMS',
    encode: function (password, data) {
        var buffer = new Buffer(0xfe);
        password.copy(buffer, 0, 0);
        data.copy(buffer, password.length, 0);
        return buffer;
    }
};

exports.setDeviceMode = {
    cid: 0x42,
    cmd: 'CMD_SET_DEVICE_MODE',
    encode: function (mode) {
        return new Buffer([ mode ]);
    }
};

exports.setConfigurationBlock = {
    cid: 0x43,
    cmd: 'CMD_SET_CFG_BLOCK',
    encode: function (block) {
        var buffer = new Buffer(0xfe);
        block.copy(buffer);
        return buffer;
    }
};

exports.getDeviceMode = {
    cid: 0x44,
    cmd: 'CMD_GET_DEVICE_MODE',
    decode: function (buffer) {
        return buffer.readUInt8(0);
    }
};

exports.getSSB = {
    cid: 0x46,
    cmd: 'CMD_GET_SSB'
};

exports.setSSB = {
    cid: 0x47,
    cmd: 'CMD_SET_SSB',
    encode: function (password, ssb) {
        var buffer = new Buffer(0xfe);
        password.copy(buffer, 0, 0);
        ssb.copy(buffer, password.length, 0);
        return buffer;
    }
};

exports.refillBank = {
    cid: 0x48,
    cmd: 'CMD_SSB_REFILL',
    encode: function (type) {
        return new Buffer([ type ]);
    },
    decode: function (buffer) {
        return {
            coresRemaining: buffer.readUInt32BE(0)
        };
    }
};

exports.buyConsumable = {
    cid: 0x49,
    cmd: 'CMD_SSB_BUY',
    encode: function (id, quantity) {
        var buffer = new Buffer(2);
        buffer.writeUInt8(id);
        buffer.writeUInt8(quantity);
        return buffer;
    },
    decode: function (buffer) {
        return {
            qtyRemaining: buffer.readUInt8(0),
            coresRemaining: buffer.readUInt32BE(1)
        };
    }
};

exports.useConsumable = {
    cid: 0x4a,
    cmd: 'CMD_SSB_USE_CONSUMEABLE',
    encode: function (id) {
        return new Buffer([ id ]);
    },
    decode: function (buffer) {
        return {
            id: buffer.readUInt8(0),
            qtyRemaining: buffer.readUInt8(1)
        }

    }
};

exports.grantCores = {
    cid: 0x4b,
    cmd: 'CMD_SSB_GRANT_CORES',
    encode: function (password, quantity, flags) {
        var buffer = new Buffer(8);
        password.copy(buffer, 0, 0);
        quantity.copy(buffer, password.length, 0);
        buffer.writeUInt8(flags);
        return buffer;
    },
    decode: function (buffer) {
        return {
            totalCores: buffer.readUInt8(0)
        };
    }
};

exports.addXP = {
    cid: 0x4c,
    cmd: 'CMD_SSB_ADD_XP',
    encode: function (password, quantity) {
        var buffer = new Buffer(5);
        password.copy(buffer, 0, 0);
        buffer.writeUInt8(quantity, password.length);
        return buffer;

    },
    decode: function (buffer) {
        return {
            percentRemaining: buffer.readUInt8(0)
        };
    }
};

exports.levelUpAttribute = {
    cid: 0x4d,
    cmd: 'CMD_SSB_LEVEL_UP_ATTR',
    encode: function (password, id) {
        var buffer = new Buffer(5);
        password.copy(buffer, 0, 0);
        buffer.writeUInt8(id, password.length);
        return buffer;

    },
    decode: function (buffer) {
        return {
            id: buffer.readUInt8(0),
            level: buffer.readUInt8(1),
            pointsRemaining: buffer.readUInt16BE(2)
        }
    }
};

exports.getPasswordSeed = {
    cid: 0x4e,
    cmd: 'CMD_GET_PW_SEED',
    decode: function (buffer) {
        return buffer.readUInt32BE(0);
    }
};

exports.enableSSBAsyncMessages = {
    cid: 0x4f,
    cmd: 'CMD_SSB_ENABLE_ASYNC',
    encode: function (enable) {
        return new Buffer([ enable ? 1 : 0 ]);
    }
};

exports.runMacro = {
    cid: 0x50,
    cmd: 'CMD_RUN_MACRO',
    encode: function (id) {
        return new Buffer([ id ]);
    }
};

exports.saveTemporaryMacro = {
    cid: 0x51,
    cmd: 'CMD_SAVE_TEMP_MACRO',
    encode: function (macro) {
        return macro;
    }
};

exports.saveMacro = {
    cid: 0x52,
    cmd: 'CMD_SAVE_MACRO',
    encode: function (macro) {
        return macro;
    }
};

exports.reinitMacroExecutive = {
    cid: 0x54,
    cmd: 'CMD_INIT_MACRO_EXECUTIVE'
};

exports.abortMacro = {
    cid: 0x55,
    cmd: 'CMD_ABORT_MACRO',
    decode: function (buffer) {
        return {
            id: buffer.readUInt8(0),
            cmdNum: buffer.readUInt16BE(1)
        };
    }
};

exports.getMacroStatus = {
    cid: 0x56,
    cmd: 'CMD_MACRO_STATUS',
    decode: function (buffer) {
        return {
            id: buffer.readUInt8(0),
            cmdNum: buffer.readUInt16BE(1)
        };
    }
};

exports.setMacroParameter = {
    cid: 0x57,
    cmd: 'CMD_SET_MACRO_PARAM',
    encode: function (param, value1, value2) {
        var buffer = new Buffer(3);
        buffer.writeUInt8(param, 0);
        buffer.writeUInt8(value1, 1);
        buffer.writeUInt8(value2, 2);
        return buffer;
    }
};

exports.appendMacroChunk = {
    cid: 0x58,
    cmd: 'CMD_APPEND_TEMP_MACRO_CHUNK',
    encode: function (chunk) {
        return chunk;
    }
};


exports.eraseOrbBasicStorage = {
    cid: 0x60,
    cmd: 'CMD_ERASE_ORBBAS',
    encode: function (area) {
        return new Buffer([ area ]);
    }
};

exports.appendOrbBasicFragment = {
    cid: 0x61,
    cmd: 'CMD_APPEND_FRAG',
    encode: function (area, code) {
        var buffer = new Buffer(code.length + 1);
        buffer.writeUInt8(area);
        code.copy(buffer, 1);
        return buffer;
    }
};

exports.executeOrbBasicProgram = {
    cid: 0x62,
    cmd: 'CMD_EXEC_ORBBAS',
    encode: function (area, start) {
        var buffer = new Buffer(3);
        buffer.writeUInt8(area, 0);
        buffer.writeUInt16BE(start, 1);
        return buffer;
    }
};

exports.aboutOrbBasicProgram = {
    cid: 0x63,
    cmd: 'CMD_ABORT_ORBBAS'
};

exports.submitValueToInputStatement = {
    cid: 0x64,
    cmd: 'CMD_ANSWER_INPUT',
    encode: function (value) {
        var buffer = new Buffer(4);
        buffer.writeInt32BE(value, 0);
        return buffer;
    }
};

exports.commitRAMProgramToFlash = {
    cid: 0x65,
    cmd: 'CMD_COMMIT_TO_FLASH'
};

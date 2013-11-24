'use strict';

var parser = require('./parser'),
    message = require('./packet'),
    SerialPort = require('serialport').SerialPort;


var slice, api;

slice = Function.prototype.call.bind(Array.prototype.slice);
api = Object.create(null);


/**
 * noop payload encoder
 * @returns {Buffer}
 */
function noop_enc() {
    return new Buffer(0);
}


/**
 * noop paylaod decoder
 * @param buffer
 * @returns {*}
 */
function noop_dec(buffer) {
    return buffer;
}

/**
 * Map the properties of an object, applying the provided function.
 * @param obj
 * @param fn
 * @returns {Object}
 */
function map(obj, fn) {
    return Object.keys(obj).reduce(function (dest, key) {
        dest[key] = fn(obj[key]);
        return dest;
    }, {});
}


/**
 * Create a method implementation for a given did and API definition.
 * @param did
 * @param def
 * @param fn
 * @returns {*}
 */
function compose(did, def, fn) {
    var encoder, decoder;

    if (typeof def !== 'object') {
        return def;
    }

    encoder = def.encode || noop_enc;
    decoder = def.decode || noop_dec;

    /**
     * The actual method implementation for this robot command. It sorts
     * out arguments that are supposed to be passed over the wire from options
     * and options ack callback. Once it does that, the pertinent info is passed
     * on to the common impl.
     */
    return function () {
        var args, arity, fields, options, callback, encode;

        args = slice(arguments);
        arity = encoder.length || 0;
        fields = args.splice(0, arity);

        encode = encoder.bind.apply(encoder, [null].concat(fields));
        options = args[0] || {};
        callback = args[1];

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        fn.call(this, did, def.cid, encode, decoder, options, callback);
        return this;
    };
}


/**
 * Invokes a given command over the socket/serial port
 * @param did the did of the current API
 * @param cid the cid of the current command
 * @param encode function that, when invoked, returns the encoded data payload
 * @param decode function that, when invoked, decodes the provided data payload
 * @param options (optional) options for the current command: resetTimeout (boolean) and requestAck (boolean)
 * @param callback (optional) implicit ack which will get invoked when a response is received.
 */
function command(did, cid, encode, decode, options, callback) {
    var self, packet;

    options.resetTimeout = (options.resetTimeout !== undefined) ? options.resetTimeout : this.resetTimeout;
    options.requestAck = (typeof callback === 'function') || (options.requestAck !== undefined ? options.requestAck : this.requestAck);

    self = this;
    packet = message.create(did, cid, options);
    packet.data = encode();

    if (options.requestAck) {
        packet.seq = this._enqueue(function (err, result) {
            if (err) {
                err.did = packet.did;
                err.cid = packet.cid;
                err.seq = packet.seq;

                if (callback) {
                    callback(err);
                    return;
                }

                setImmediate(self.emit.bind(self, 'error', err));
                return;
            }

            packet.response = decode(result.data);
            setImmediate(self.emit.bind(self, 'ack', packet));
            callback && setImmediate(callback.bind(null, null, packet));
        });
    }

    this.write(packet.toBuffer());
}


/**
 * Generates the API for the requested (pre-registered) spec name.
 * @param name the name of the spec for which to generate an impl (e.g. 'core' or 'sphero')
 * @param proto - the prototype for the resulting implementation
 * @returns {proto}
 */
function create(name, proto) {
    var spec = api[name];
    return Object.create(proto, map(spec, function (definition) {
        return {
            value: compose(spec.DID, definition, command),
            enumerable: true,
            writable: false,
            configurable: false
        };
    }));
}


exports.registerRobot = function register(name, definition) {
    api[name] = definition;

    return {

        createRobot: function (options) {
            var socket, core, proto, robot;

            options = options || {};

            socket = new SerialPort(options.device, { parser: parser() }, false);
            core = create('core', socket);
            proto = create(name, core);
            robot = Object.create(proto, {

                resetTimeout: {
                    value: options.resetTimeout !== false,
                    enumerable: true,
                    writable: true
                },

                requestAck: {
                    value: options.requestAck || false,
                    enumerable: true,
                    writable: true
                },

                _messages: {
                    value: [],
                    enumerable: false,
                    writable: false
                },

                _seq: {
                    value: -1,
                    enumerable: false,
                    writable: true
                },

                _enqueue: {
                    value: function (callback) {
                        this._seq += 1;
                        this._messages[this._seq] = callback;
                        return this._seq;
                    },
                    enumerable: false,
                    writable: false
                },

                _dequeue: {
                    value: function (packet) {
                        var handler;

                        handler = this._messages[packet.seq];
                        this._messages[packet.seq] = undefined;

                        if (typeof handler === 'function') {
                            handler(packet.error, packet);
                        }
                    },
                    enumerable: false,
                    writable: false
                }

            });

            robot.on('packet', robot._dequeue.bind(robot));
            return robot;
        }

    };
};

exports.registerRobot('core', require('./core'));


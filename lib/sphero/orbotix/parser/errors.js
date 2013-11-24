'use strict';

var errors = [];
errors[0x00] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_OK', message: 'Command succeeded' });
errors[0x01] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EGEN', message: 'General, non-specific error' });
errors[0x02] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_ECHKSUM', message: 'Received checksum failure' });
errors[0x03] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EFRAG', message: 'Received command fragment' });
errors[0x04] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EBAD_CMD', message: 'Unknown command ID' });
errors[0x05] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EUNSUPP', message: 'Command currently unsupported' });
errors[0x06] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EBAD_MSG', message: 'Bad message format' });
errors[0x07] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EPARAM', message: 'Parameter value(s) invalid' });
errors[0x08] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EEXEC', message: 'Failed to execute command' });
errors[0x09] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_EBAD_DID', message: 'Unknown Device ID' });
errors[0x0A] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_MEM_BUSY', message: 'Generic RAM access needed but it is busy' });
errors[0x0B] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_BAD_PASSWORD', message: 'Supplied password incorrect' });
errors[0x31] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_POWER_NOGOOD', message: 'Voltage too low for reflash operation' });
errors[0x32] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_PAGE_ILLEGAL', message: 'Illegal page number provided' });
errors[0x33] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_FLASH_FAIL', message: 'Page did not reprogram correctly' });
errors[0x34] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_MA_CORRUPT', message: 'Main Application corrupt' });
errors[0x35] = Object.freeze({ code: 'ORBOTIX_RSP_CODE_MSG_TIMEOUT', message: 'Msg state machine timed out' });

module.exports = errors;
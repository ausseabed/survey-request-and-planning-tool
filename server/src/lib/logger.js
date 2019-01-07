var winston = require('winston');
var uuid5 = require('uuid/v5');
var uuid4 = require('uuid/v4');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug'
        })
    ]
});

module.exports = {
    logger: logger,
    logId: function () {
        return uuid5("logs", uuid4());
    }
}
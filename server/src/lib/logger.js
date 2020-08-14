var winston = require('winston');
import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            level: 'debug'
        })
    ]
});

module.exports = {
    logger: logger,
    logId: function () {
        return uuidv5("logs", uuidv4());
    }
}

var celery = require('node-celery');
var _ = require('lodash');
var config = require('config');

var task = function (options) {
    if (!options) { options = {} };
    options = _.extend({
        broker_url: config.get('broker_url'),
        result_backend: 'amqp://'
    }, options);

    var client = celery.createClient({
        CELERY_BROKER_URL: options.broker_url,
        CELERY_RESULT_BACKEND: options.result_backend,
        RESULT_EXCHANGE: 'celery',                          // This is the name of the exchnage which accepts work
        IGNORE_RESULT: true,                                // Don't worry about results, the task will send a post to once it's done.
        TASK_RESULT_DURABLE: false,
    });

    return (function () {
        return {
            createTender: function () {
                if (client.ready) {
                    client.call('tasks.createdocs', [{
                        'title': "I changed it",
                        'subtitle': "My dooper",
                        'company_name': 'CRCSI',
                        //'date': datetime.date.today().strftime("%B %d, %Y"),
                        'date': 'sadfsdlkjfsalkd',
                        'sensor': 'ABCDE',
                        'resolution': '1.0 m'
                    }, 'https://github.com/crc-si/qa4u-docs.git']);
                }
                else {
                    throw 'Worker is not ready'
                }

                return null;        // Send something back to caller
            }
        };
    }());
}
module.exports = task;
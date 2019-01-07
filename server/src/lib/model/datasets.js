var config = require('config');

var datasets = function (options) {
    options = options || {};
    if (!options.client) throw 'db client is required.'
    if (!options.table) throw 'table name is required.'

    return (function () {
        var base = require('./base')(options);

        return {
            get: function (id) {
                return base.get(options.table, { id: id });
            },
            getAllUser: function (userId) {
                // Return all datasets user can view or edit
                var users = { ':master': config.get('db.master_userid')};
                if (userId !== config.get('db.master_userid')) {
                    users[':userId'] = userId;
                }

                return base.scan({
                    TableName: options.table,
                    FilterExpression: "created_by IN (" + Object.keys(users).toString() +")",
                    ExpressionAttributeValues: users
                });
            },
            create: function (data) {
                return base.create(options.table, data);
            },
            update: function (id, data) {
                return base.update(options.table, { id: id }, data);
            },
            delete: function (id) {
                return base.delete(options.table, { id: id });
            }
        };
    }());
}
module.exports = datasets;
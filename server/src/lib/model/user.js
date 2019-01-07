var user = function (options) {
    options = options || {};
    if (!options.client) throw 'db client is required.'
    if (!options.table) throw 'table name is required.'

    return (function () {
        var base = require('./base')(options);

        return {
            get: function (id) {
                return base.get(options.table, { id: id });
            },
            create: function (data) {
                return base.create(options.table, data);
            },
            update: function (id, data) {
                return base.update(options.table, { id: id }, data);
            }
        };
    }());
}
module.exports = user;
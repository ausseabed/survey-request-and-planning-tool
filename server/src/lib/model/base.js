var logger = require('../logger').logger;
var logIdGen = require('../logger').logId;
var _ = require('lodash');

var Base = function (options) {
    options = options || {};
    if (!options.client) throw 'db client is required.'

    return (function () {
        return {
            create: function (table, data) {
                return options.client.put({
                    TableName: table,
                    Item: _.omitBy(data, (d) => {
                        return _.isEmpty(d) && !_.isNumber(d)
                    })     // Remove empty values from data object
                }).promise()
                    .then((result) => {
                        return data;
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, table: table, data: data });
                        throw 'Error creating item. ID: ' + logid;
                    });
            },
            update: function (table, key, data, special) {
                var expressions = [];
                var expValues = {};
                var expNames = {};

                _.each(data, (v, k) => {
                    if (special && special[k]) {
                        //if (special[k] === 'list_append') { expressions.push('#_' + k + " = list_append(#_" + k + ", :_" + k + ")"); }
                        if (special[k] === 'list_append') { expressions.push('#_' + k + " = list_append(if_not_exists(#_" + k + ", :_empty_list), :_" + k + ")"); }
                        expValues[":_empty_list"] = [];
                    }
                    else {
                        expressions.push('#_' + k + " = :_" + k);
                    }
                    expValues[":_" + k] = v;
                    expNames['#_' + k] = k;
                })

                return options.client.update({
                    TableName: table,
                    Key: key,
                    UpdateExpression: "SET " + expressions.join(","),
                    ExpressionAttributeNames: expNames,
                    ExpressionAttributeValues: expValues,
                    ReturnValues: "ALL_NEW"
                }).promise()
                    .then((data) => {
                        return data.Attributes;
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, table: table, key: key, data: data });
                        throw 'Error updating item. ID: ' + logid;
                    });
            },
            delete: function (table, key) {
                return options.client.delete({
                    TableName: table,
                    Key: key
                }).promise()
                    .then((data) => {
                        return data;
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, table: table, key: key });
                        throw 'Error deleting item. ID: ' + logid;
                    });
            },
            get: function (table, key) {
                return options.client.get({
                    TableName: table,
                    Key: key
                }).promise()
                    .then((data) => {
                        return data.Item;
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, table: table, key: key });
                        throw 'Error getting item. ID: ' + logid;
                    });
            },
            query: function (params) {
                // Query params is expected to be same as dynamodb api specification
                return options.client.query(params).promise()
                    .then((data) => {
                        return data.Items;
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, params: params });
                        throw 'Error during query. ID: ' + logid;
                    });

            },
            scan: function (params) {
                return options.client.scan(params).promise()
                    .then((data) => {
                        return data
                    })
                    .catch((err) => {
                        var logid = logIdGen();
                        logger.error(err, { id: logid, params: params });
                        throw 'Error during scan. ID: ' + logid;
                    });
            }
        };
    }());
};
module.exports = Base;
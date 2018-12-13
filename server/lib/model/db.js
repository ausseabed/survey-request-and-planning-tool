﻿var AWS = require("aws-sdk");
var config = require('config');
var logger = require('../logger').logger;
var logIdGen = require('../logger').logId;
var _ = require('lodash');

var DbBase = null;
var User = null;

var _users = {
    exists: function (user_id) { return User.get(user_id).then(function (result) { return result; }); },
    create: function (data) { return User.create(data).then(function (result) { return result; }); },
    update: function (id, data) { return User.update(id, data).then(function (result) { return result; }); }
};

var _projects = {
    create: function (data) { return DbBase.create(config.get('db.tables.projects'), data).then(function (result) { return result; }); },
    update: function (key, data, special) { return DbBase.update(config.get('db.tables.projects'), key, data, special).then(function (result) { return result; }); },
    query: function (params) {
        return DbBase.query(_.assign(params, { TableName: config.get('db.tables.projects') }))
            .then(function (result) { return result; });
    },
    scan: function (params) {
        return DbBase.scan(_.assign(params, { TableName: config.get('db.tables.projects') }))
            .then(function (result) { return result; });
    },
    delete: function (key) { return DbBase.delete(config.get('db.tables.projects'), key).then(function (result) { return result; }); }
}

var _tenders = {
    create: function (data) { return DbBase.create(config.get('db.tables.tenders'), data).then(function (result) { return result; }); },
    query: function (params) {
        return DbBase.query(_.assign(params, { TableName: config.get('db.tables.tenders') }))
            .then(function (result) { return result; });
    },
    scan: function (params) {
        return DbBase.scan(_.assign(params, { TableName: config.get('db.tables.tenders') }))
            .then(function (result) { return result; });
    },
    delete: function (key) { return DbBase.delete(config.get('db.tables.tenders'), key).then(function (result) { return result; }); }
}

var _sessions = {
    create: function (data) { return DbBase.create(config.get('db.tables.sessions'), data).then(function (result) { return result; }); },
    query: function (params) {
        return DbBase.query(_.assign(params, { TableName: config.get('db.tables.sessions') }))
            .then(function (result) { return result; });
    },
    delete: function (key) { return DbBase.delete(config.get('db.tables.sessions'), key).then(function (result) { return result; }); },
    update: function (key, data, special) { return DbBase.update(config.get('db.tables.sessions'), key, data, special).then(function (result) { return result; }); }
}

var _definitions = {
    create: function (data) { return DbBase.create(config.get('db.tables.definitions'), data).then(function (result) { return result; }); },
    scan: function (params) { return DbBase.scan(_.assign(params, { TableName: config.get('db.tables.definitions') })).then(function (result) { return result; });},
    get: function (key) { return DbBase.get(config.get('db.tables.definitions'), key).then(function (result) { return result; }); },
    delete: function (key) { return DbBase.delete(config.get('db.tables.definitions'), key).then(function (result) { return result; }); },
}

var _survey = {
    create: function (data) { return DbBase.create(config.get('db.tables.survey'), data).then(function (result) { return result; }); },
}

var db = function (params) {
    if (!params &&
        process.env.NODE_ENV === 'development') {
        // We need credentials & parameters only for development environment.
        // Staging & test will derive their creds from EC2 instance
        params = {
            region: process.env.AWS_DEFAULT_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
        AWS.config.update(params);
    }
    AWS.config.setPromisesDependency(require('bluebird')); 

    var client = new AWS.DynamoDB.DocumentClient();
    DbBase = require('./base')({ client: client });
    User = require('./user')({ client: client, table: config.get('db.tables.users') });
    
    return (function () {
        return {
            users: _users,
            projects: _projects,
            survey: _survey,
            tenders: _tenders,
            sessions: _sessions,
            definitions: _definitions
        };
    }());
};

module.exports = db;
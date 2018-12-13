/*
Handle s3 specific opertions
*/

var config = require('config');
var AWS = require("aws-sdk");
const s3 = new AWS.S3();
var logger = require('./logger').logger;
var logIdGen = require('./logger').logId;
var _ = require('lodash');

module.exports = {
    upload_base64(base64, filepath) {
        /*
        Upload base64 string as file to S3 and return uploaded url endpoint
        */

        var contentType = '';
        var mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
            contentType = mime[1];
        }

        return s3.putObject({
            Bucket: config.get('s3bucket'),
            Key: filepath,
            ContentType: contentType,
            ACL: 'bucket-owner-full-control'
        }).promise()
            .then((result) => {
                return filepath;
            })
    },
    upload_file(filepath, content, contentType) {
        // Uploads the buffer to S3 and return uploaded url
        return s3.putObject({
            Bucket: config.get('s3bucket'),
            Key: filepath,
            Body: content,
            ContentType: contentType ? contentType : 'binary/octet-stream',
            ACL: 'bucket-owner-full-control'
        }).promise()
            .then((result) => {
                return filepath;
            })
    },
    delete(filepath) {
        return s3.deleteObject({
            Bucket: config.get('s3bucket'),
            Key: filepath
        }).promise()
    },
    getSignedUrl(operation, filepath, params) {
        /*
        Return a signed URL
        */
        if (!params) params = {};
        return s3.getSignedUrl(operation, {
            Bucket: config.get('s3bucket'),
            Key: filepath,
            ...params                                   // Spread any additional parameters
        });
    },
    getFileList(prefix) {
        /*
        Get file list with prefix
        */
        return s3.listObjects({
            Bucket: config.get('s3bucket'),
            Prefix: prefix
        }).promise()
            .then((result) => {
                return _.map(result.Contents, (c) => {
                    return c.Key.replace(prefix, '');
                });
            });
    },
    readFileAsJson(filepath) {
        return s3.getObject({
            Bucket: config.get('s3bucket'),
            Key: filepath
        }).promise()
            .then((result) => {
                return JSON.parse(result.Body.toString())
            })
    }
}

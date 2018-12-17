var AWS = require("aws-sdk");
var logger = require('../logger').logger;
var logIdGen = require('../logger').logId;



function tableDefinitions() {
  const dbPrefix = process.env.NODE_ENV;
  var usersParams = {
    TableName: dbPrefix + ".qa4lab.users",
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: 3
    }
  };

  var tendersParams = {
    TableName: dbPrefix + ".qa4lab.tenders",
    AttributeDefinitions: [
      {"AttributeName": "id", "AttributeType": "S"},
      {"AttributeName": "version", "AttributeType": "S"},
      {"AttributeName": "project_name", "AttributeType": "S"},
      {"AttributeName": "updated", "AttributeType": "S"}
    ],
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH"},
      { AttributeName: "version", KeyType: "RANGE"}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: "3",
      WriteCapacityUnits: "3"
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "project_name-updated-index",
        KeySchema: [
          { AttributeName: "project_name", KeyType: "HASH" },
          { AttributeName: "updated", KeyType: "RANGE" }
        ],
        Projection: {
          ProjectionType: "INCLUDE",
          NonKeyAttributes: [
            "write_users",
            "tenderer",
            "read_users",
            "contract_no"
          ]
        },
        ProvisionedThroughput: {
          "ReadCapacityUnits": "3",
          "WriteCapacityUnits": "3"
        }
      }
    ]
  }

  const tableParams = [usersParams, tendersParams];
  return tableParams;
}

function createTables(dynamodb) {
  var tableParams = tableDefinitions();
  var tableCreatePromises = [];
  tableParams.forEach(function(tp) {
    var tablePromise = dynamodb.createTable(tp).promise();
    tableCreatePromises.push(tablePromise);
  });

  let promise = Promise.all(tableCreatePromises);
  promise
  .then(function(data) {
    data.forEach(function(data) {
      logger.info('Created ' + data.TableDescription.TableName);
    });
  })
  .catch(function(error) {
    logger.error('error', error);
  });
}

function deleteTables(dynamodb) {
  if (process.env.NODE_ENV !== 'development') {
    logger.warn('Not development, not deleted');
    return;
  }
  var tableParams = tableDefinitions();
  tableParams = tableParams.map((val, index, arr) => {
    return {TableName: val.TableName}
  });
  var tableDeletePromises = [];
  tableParams.forEach(function(tp) {
    var tablePromise = dynamodb.deleteTable(tp).promise();
    tableDeletePromises.push(tablePromise);
  });

  let promise = Promise.all(tableDeletePromises);
  promise
  .then(function(data) {
    data.forEach(function(data) {
      logger.info('Deleted ' + data.TableDescription.TableName);
    });
  })
  .catch(function(error) {
    logger.error('error', error);
  });
}

function dbInit() {
  var params = {
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT
  };
  AWS.config.update(params);

  var dynamodb = new AWS.DynamoDB();

  if (process.argv.indexOf('--delete') >= 0) {
    logger.info("Deleting tables");
    deleteTables(dynamodb);
  } else {
    logger.info("Creating tables");
    createTables(dynamodb);
  }
}

dbInit();

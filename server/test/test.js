var assert = require('assert');

var db = require('../lib/model/db')();
var dbInit = require('../lib/model/db-init.js');

// placeholder test only, to be deleted when we have real tests
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

// database connectivity tests
describe('DatabaseConnectivity', function() {

  before(async function() {
    this.timeout(45000);

    console.log("clearing test db")

    const tables = await db.connection.listTables({}).promise();
    for (var i = 0; i < tables.TableNames.length; i++) {
      const tableName = tables.TableNames[i];
      await db.connection.deleteTable({TableName:tableName}).promise();
    }

    await dbInit.createTables(db.connection);
  });

  describe('#testDatabaseEmpty()', function() {
    it('DB should be empty', async function() {

      result = await db.projects.scan({})
      assert.equal(result.Count, 0);

      result = await db.tenders.scan({})
      assert.equal(result.Count, 0);

      // TODO - update after we know what tables will be in mbes
    });
  });
});

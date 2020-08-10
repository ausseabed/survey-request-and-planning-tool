const tmp = require('tmp')
const { spawnSync } = require( 'child_process' )

export function shpBuilderFactory(entityName) {
  const props = [
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    process.env.POSTGRES_HOSTNAME,
    process.env.POSTGRES_PORT
  ]
  if (entityName === 'request') {
    return new RequestShpBuilder(...props)
  } else {
    throw 'Unknown entityName passed to shpBuilder factory'
  }

}


// generates shapefiles from data stored within postgis database
// uses external command line tool
export class ShpBuilder {

  constructor(dbName, dbUser, dbPassword, dbHost, dbPort) {
    this.dbName = dbName
    this.dbUser = dbUser
    this.dbPassword = dbPassword
    this.dbHost = dbHost
    this.dbPort = dbPort
  }

  // gets a filename to a file in a temporary folder location
  // will be cleared after application restarts
  getTempDir() {
    const tmpDir = tmp.dirSync({ prefix: 'tmpshp', unsafeCleanup: true })
    return tmpDir
  }

  getCmdLineArgs(filename, query) {
    let cmd = [
      '-f', filename,
      '-h', this.dbHost,
      '-p', this.dbPort,
      '-u', this.dbUser,
      '-P', this.dbPassword,
      this.dbName,
      query
    ]

    return cmd
  }

  getQuery() {
    return ""
  }

  build(id, name) {
    const tmpDir = this.getTempDir()
    const filename = tmpDir.name + `/${name}.shp`
    const query = this.getQuery(id)
    const cmd = 'pgsql2shp'
    const cmdArgs = this.getCmdLineArgs(filename, query)

    const cmdOutput = spawnSync(cmd, cmdArgs)
    return tmpDir
  }

}


export class RequestShpBuilder extends ShpBuilder {

  getQuery(id) {
    // TODO - include proper query here
    return "SELECT * FROM survey_request_aoi"
  }


}

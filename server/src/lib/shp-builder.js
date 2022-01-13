const tmp = require('tmp')
const { spawnSync } = require('child_process')

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
  } else if (entityName === 'priority-area-submission') {
    return new PriorityAreaShpBuilder(...props)
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
    console.log(`stderr: ${cmdOutput.stderr.toString()}`);
    console.log(`stdout: ${cmdOutput.stdout.toString()}`);
    return tmpDir
  }

}


export class RequestShpBuilder extends ShpBuilder {

  getQuery(id) {
    const selects = [
      'sr.name as SR_NAME',
      'rorg.name as SR_REQ_ORG',
      'collab_orgs.orgname as SR_COL_ORG',
      'custs.custname as SR_CUSTOD',
      'sr.\"requestorName\" as SR_PER_NAM',
      'sr.\"requestorPosition\" as SR_PER_TLE',
      'sr.\"pointOfContactEmail\" as SR_EMAIL',
      'sr.\"businessJustification\" as SR_BUS_JUS',
      'sr.\"costBenefit\" as SR_COST_B',
      'sr.\"additionalFundingAvailable\" as SR_ADD_FUN',
      'sr.\"riskIssues\" as SR_RISK',
      'sr.\"furtherInformation\" as SR_F_INFO',
      'sra.name as SRA_NAME',
      'sra.survey_standard as SRA_STD',
      'sra.overall_risk as SRA_RISK',
      'sra.preferred_timeframe as SRA_TIME',
      'sra.data_types_to_capture as SRA_DATA',
      'sra.calculated_area as SRA_AREA',
      'sra.geom as GEOM',
    ]
    let q = '' +
      `SELECT ${selects.join(', ')} FROM survey_request_aoi sra ` +
      'JOIN survey_request sr ON sr.id = sra.survey_request_id ' +
      'LEFT OUTER JOIN organisation rorg ON rorg.id = sr.organisation_id ' +
      `full outer join (SELECT survey_request.id as id, string_agg(DISTINCT organisation.name, ', ') as orgname FROM survey_request LEFT JOIN survey_request_organisations_organisation ON survey_request.id = survey_request_organisations_organisation.\"surveyRequestId\" INNER JOIN organisation ON survey_request_organisations_organisation.\"organisationId\" = organisation.id GROUP BY survey_request.id) collab_orgs on collab_orgs.id = sr.id ` +
      `full outer join (SELECT survey_request.id as id, string_agg(DISTINCT custodian.name, ', ') as custname FROM survey_request LEFT JOIN survey_request_custodians_custodian ON survey_request.id = survey_request_custodians_custodian.\"surveyRequestId\" INNER JOIN custodian ON survey_request_custodians_custodian.\"custodianId\" = custodian.id GROUP BY survey_request.id) custs on custs.id = sr.id ` +
      `WHERE sr.id = '${id}'`
    return q
  }

}


export class PriorityAreaShpBuilder extends ShpBuilder {

  getQuery(id) {
    const selects = [
      'sorg.name as AS_SUB_ORG',
      'pas.\"contactPerson\" as AS_C_NAME',
      'pas.\"contactEmail\" as AS_C_EMAIL',
      'cust.name as AS_CUSTOD',
      'pa.name as A_NAME',
      'pa.seacountry_name as A_SEA_NAME',
      'pa.ecological_area_name as A_ECO_NAME',
      'pa.ecological_area_type as A_ECO_TYPE',
      'pa.\"preferredTimeframe\" as A_PREFTIME',
      'pa.timeframe_reason as A_TF_REAS',
      'pa.preferred_season as A_PREF_SEA',
      'pa.collection_cadence as A_COLL_CAD',
      'pa.time_series_description as A_TS_DESC',
      'pa.perceived_impact as A_IMPACT',
      'pa.organisational_priority as A_ORG_PRIO',
      'pa.existing_data_sources as A_DATA_SRC',
      'pa.reason_for_aoi_raise as A_REASON',
      'pa.existing_data_assessment_comments as A_DATA_COM',
      'pa.grid_size as A_GRIDSIZE',
      'pa.survey_standard as A_STANDARD',
      'pa.data_to_capture as A_DATA',
      'pa.data_capture_methods as A_DATAMETH',
      'pa.pressures as A_PRESSURE',
      'pa.purposes as A_PURPOSES',
      'pa.purpose_flags as A_PURFLAGS',
      'pa.purpose_values as A_PURVALS',
      'pa.ecosystems as A_ECOSYSTS',
      'pa.ecosystem_components as A_ECOCOMPS',
      'pa.geom as GEOM',
    ]
    let q = '' +
      `SELECT ${selects.join(', ')} FROM priority_area pa ` +
      'JOIN priority_area_submission pas ON pas.id = pa.\"priorityAreaSubmissionSubmissionId\" ' +
      'LEFT OUTER JOIN organisation sorg ON sorg.id = pas.\"submittingOrganisationId\" ' +
      'LEFT OUTER JOIN custodian cust ON cust.id = pas.\"custodianId\" ' +
      `WHERE pas.id = '${id}'`
    return q
  }

}

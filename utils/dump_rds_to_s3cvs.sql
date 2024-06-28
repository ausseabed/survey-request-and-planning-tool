SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-users',
   'ap-southeast-2'
) AS s3_uri_sct_users \gset

SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-survey-plans',
   'ap-southeast-2'
) AS s3_uri_sct_survey_plans \gset

SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-hipp-requests',
   'ap-southeast-2'
) AS s3_uri_sct_hipp_requests \gset

SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-hipp-request-areas',
   'ap-southeast-2'
) AS s3_uri_sct_hipp_request_areas \gset

SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-aoi-submissions',
   'ap-southeast-2'
) AS s3_uri_sct_aoi_submissions \gset

SELECT aws_commons.create_s3_uri(
   'ausseabed-sct-database-csv-dumps',
   'sct-aoi-submission-areas',
   'ap-southeast-2'
) AS s3_uri_sct_aoi_submission_areas \gset

SELECT * FROM aws_s3.query_export_to_s3('SELECT "user".id as id, email, "user".name, created, "lastSeen", c.name as custodian_name, role.name AS role_name FROM "user" JOIN custodian AS c ON c.id = "user"."custodianId" JOIN role ON role.id = "user"."roleId"', :'s3_uri_sct_users', options :='format csv, HEADER true');

SELECT * FROM aws_s3.query_export_to_s3(
'SELECT 
  sp.id AS survey_plan_id,
  "surveyName",
  "surveyId",
  "contactPerson",
  "email",
  "startDate",
  "endDate",
  comment,
  status,
  deleted,
  rs.created AS record_state_created,
  rs.state AS record_state
FROM survey_plan AS sp
JOIN record_state AS rs ON sp."recordStateId" = rs.id',
:'s3_uri_sct_survey_plans',
options :='format csv, HEADER true');

SELECT * FROM aws_s3.query_export_to_s3(
'
SELECT 
  sr.id AS hipp_request_id,
  sr.name AS hipp_request_name,
  "requestorName",
  "businessJustification",
  "costBenefit",
  "pointOfContactEmail",
  "furtherInformation",
  "riskIssues",
  public,
  "additionalFundingAvailable",
  deleted,
  org.name AS organisation_name,
  rs.created AS record_state_created,
  rs.state AS record_state
FROM survey_request AS sr
JOIN record_state AS rs ON sr."recordStateId" = rs.id
JOIN organisation AS org ON org.id = sr.organisation_id
',
:'s3_uri_sct_hipp_requests',
options :='format csv, HEADER true');

SELECT * FROM aws_s3.query_export_to_s3(
'
select
sr.id as hipp_request_id,
sr."name" as hipp_request_name,
sr.deleted as hipp_request_deleted,
aoi."name" as hipp_request_area_name,
survey_standard,
overall_risk,
preferred_timeframe,
data_types_to_capture,
calculated_area,
org.name AS organisation_name,
rs.created AS record_state_created,
rs.state AS record_state
FROM survey_request_aoi as aoi
join survey_request sr on sr.id = aoi.survey_request_id
JOIN organisation AS org ON org.id = sr.organisation_id
JOIN record_state AS rs ON sr."recordStateId" = rs.id
'
,:'s3_uri_sct_hipp_request_areas',
options :='format csv, HEADER true');

SELECT * FROM aws_s3.query_export_to_s3(
'
select
aoi_sub.id as submission_id,
submission_name,
c."name" as custodian_name,
"contactPerson",
"contactEmail",
org.name AS submitting_organisation_name,
"riskIssues",
"furtherInformation",
"submittingOrganisationId",
"custodianId",
aoi_sub.created,
"lastModified",
open_to_collaboration,
have_funds_resources,
aoi_sub.deleted,
rs.created AS record_state_created,
rs.state AS record_state
FROM priority_area_submission as aoi_sub
JOIN custodian AS c ON c.id = aoi_sub."custodianId"
JOIN record_state AS rs ON aoi_sub."recordStateId" = rs.id
JOIN organisation AS org ON org.id = aoi_sub."submittingOrganisationId" 
',
:'s3_uri_sct_aoi_submissions',
options :='format csv, HEADER true');

SELECT * FROM aws_s3.query_export_to_s3(
'
select
aoi_area."name" as aoi_area_name,
"preferredTimeframe",
"riskRating",
"requiredDataQuality",
priority,
"priorityAreaSubmissionSubmissionId",
seacountry_name,
ecological_area_name,
timeframe_reason,
preferred_season,
collection_cadence,
time_series_description,
perceived_impact,
organisational_priority,
existing_data_sources,
reason_for_aoi_raise,
existing_data_assessment_comments,
grid_size,
survey_standard,
data_to_capture,
aoi_area.created as aoi_area_created,
pas.id as aoi_submission_id,
pas.submission_name as aoi_submission_name,
pas.created  as aoi_submission_created,
c."name" as custodian_name,
org.name AS submitting_organisation_name,
rs.created AS record_state_created,
rs.state AS record_state
FROM priority_area as aoi_area
join priority_area_submission pas on pas.id = aoi_area."priorityAreaSubmissionSubmissionId" 
JOIN custodian AS c ON c.id = pas."custodianId"
JOIN organisation AS org ON org.id = pas."submittingOrganisationId" 
JOIN record_state AS rs ON pas."recordStateId" = rs.id
',
:'s3_uri_sct_aoi_submission_areas',
options :='format csv, HEADER true');

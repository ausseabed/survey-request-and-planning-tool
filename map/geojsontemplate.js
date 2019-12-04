<!– MapServer Template –>
[resultset layer=Survey_Plans]
{
  "type": "FeatureCollection",
  "features": [
    [feature trimlast=","]
    {
      "type": "Feature",
      "id": "[spid]",
      "geometry": {
        "type": "Polygon",
        "coordinates":[[[shpxy precision="6" cs=", " xh="[" yf="]"]]]
      },
      "properties": {
        "surveyName": "[surveyName]",
        "status": "[status]",
        "category": "[category]",
        "purpose": "[purpose]",
        "startDate": "[startDate]",
        "endDate": "[endDate]",
        "contactPerson": "[contactPerson]",
        "contactEmail": "[contactEmail]",
        "commissioningOrganisations": "[commissioningOrganisations]",
        "custodianOrganisations": "[custodianOrganisations]"
      }
    },
    [/feature]
  ]
}
[/resultset]

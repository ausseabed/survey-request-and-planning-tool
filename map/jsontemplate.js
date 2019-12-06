<!– MapServer Template –>
{
  "type": "FeatureCollection",
  "features": [
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
        "custodianOrganisations": "[custodianOrganisations]",
        "instrumentTypes": "[instrumentTypes]",
        "dataCaptureTypes": "[dataCaptureTypes]"
      }
    }
  ]
}

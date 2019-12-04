<!– MapServer Template –>
[resultset layer=Survey_Plans]
{
  "type": "FeatureCollection",
  "features": [
    [feature trimlast=","]
    {
      "type": "Feature",
      "id": "id",
      "geometry": {
        "type": "Polygon",
        "coordinates":[[shpxy precision="6" xh="[" yf="],"]]
      },
      "properties": {
        "name": [surveyName]
      }
    },
    [/feature]
  ]
}
[/resultset]

export const WMTS_GET_CAPABILITIES_URL = 'http://gaservices.ga.gov.au/site_7/rest/services/NationalMap_Colour_Topographic_Base_World_WM/MapServer/WMTS/1.0.0/WMTSCapabilities.xml';
export const WMTS_MAPSERVER_URL = 'http://gaservices.ga.gov.au/gis/rest/services/NationalMap_Colour_Topographic_Base_World_WM/MapServer';

export const MAP_ATTRIBUTION_HTML = '© Geoscience Australia - <a target="_blank" href="http://gaservices.ga.gov.au/site_7/rest/services/NationalMap_Colour_Topographic_Base_World_WM/MapServer">details<a>'

// Max Latitude -4.6 decimal degrees
// Max Longitude 174.89 decimal degrees
// Min Latitude -71.4 decimal degrees
// Min Longitude 39.45 decimal degrees
export const WMTS_DEFAULT_EXTENT = [39.45 ,-71.4, 174.89, -4.6];

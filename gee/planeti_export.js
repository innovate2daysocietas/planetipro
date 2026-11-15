// PLANETI data export for Google Earth Engine (code.earthengine.google.com)
// Edit lat, lon and halfWidthKm, click Run, then run the 'planeti_data' task in the Tasks tab.
var lat = 2.4, lon = 32.75, halfWidthKm = 10;
var startYear = 2005, endYear = 2024;
var aoi = ee.Geometry.Point([lon, lat]).buffer(halfWidthKm * 1000).bounds();

// Vegetation (NDVI) yearly median from MODIS
function ndvi(y) {
  return ee.ImageCollection('MODIS/061/MOD13A1')
    .filterDate(y + '-01-01', (y + 1) + '-01-01')
    .select('NDVI').median().multiply(0.0001);
}
// Rainfall: mean monthly rate (mm/hr), GPM IMERG
var rain = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
  .filterDate('2020-01-01', '2025-01-01').select('precipitation').mean();
// Soil moisture: SMAP L4 surface, mean for 2024
var soil = ee.ImageCollection('NASA/SMAP/SPL4SMGP/008')
  .filterDate('2024-01-01', '2025-01-01').select('sm_surface').mean();
// Slope in degrees from SRTM
var slope = ee.Terrain.slope(ee.Image('USGS/SRTMGL1_003'));

var stack = ee.Image.cat([
  slope.rename('slope'), rain.rename('rain'), soil.rename('soil'),
  ndvi(startYear).rename('ndvi_start'), ndvi(endYear).rename('ndvi_end')
]).clip(aoi);

var samples = stack.sample({region: aoi, scale: 500, numPixels: 600, geometries: true, seed: 1});
var rows = samples.map(function(f) {
  var c = f.geometry().coordinates();
  return f.set({lat: c.get(1), lon: c.get(0)});
});
print('Sample points', rows.size());
Map.centerObject(aoi, 10);
Map.addLayer(stack.select('ndvi_end'), {min: 0.1, max: 0.9, palette: ['8a5a2b','d9c35a','2f9e57','0d5c2e']}, 'NDVI ' + endYear);

Export.table.toDrive({
  collection: rows, description: 'planeti_data', fileFormat: 'CSV',
  selectors: ['lat', 'lon', 'slope', 'rain', 'soil', 'ndvi_start', 'ndvi_end']
});

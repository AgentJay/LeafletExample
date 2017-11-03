/*
Contains the layers for leaflet that are used across the site

	Base:
	"OSM": osmlayer,
	"Digital Globe": digitalGlobeLayer,
	"Satellite": satellite,

	Overlay:
	"WDPA Apr 2016": wdpa,
	"ACP Countries": ACPCountries,
	"Country Protected Areas": empty, -- To be used with any views generated layers
	"Terrestrial PAs (WDPA July 2015)": TerrestrialPAs,
	"Marine PAs (WDPA July 2015)": MarinePAs,
	"Coastal PAs (WDPA July 2015)": CostalPAs,

*/

mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

//Old Digital Globe Key changed 2016 29/11
var digitialGlobeApiKey = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpbmJscnhhZTBudmp0cWx3MXI5bWt0djgifQ.9DibR63tG-LY6FvjDLhCXg";
//My mapbox key:
var myMapboxKey = "pk.eyJ1IjoiamFtZXNkYXZ5IiwiYSI6ImNpenRuMmZ6OTAxMngzM25wNG81b2MwMTUifQ.A2YdXu17spFF-gl6yvHXaw";
//Digital Globe Key 2017/06/26
var digitalGlobeNew = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImIzMWY3NDA3NjlhYThlNjdiMTA2MGMxNzU0ZDE2YzY4In0.8jtWjgDsAwqFouTWzSnkJw";
var thunderforestApiKey = "ef51e3695a9d4aa99e2a430cf264cfab";

//var digitialGlobeApiKey = "pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg";
$url_template = "http://{s}.ashbu.cartocdn.com/carbon-tool/api/v1/map/2ebeed42402be172060d4af8cd6bfaed:1461316460543/{z}/{x}/{y}.png";
$attr_wdpa = 'Tiles <a target="attr" href="http://www.protectedplanet.net/">Protected Planet</a> &copy;';
var attribution_jrc = '&copy; JRC';
var attribution_thunder = 'Maps 	&#169; <a href="http://www.thunderforest.com">Thunderforest</a>';

var empty = L.tileLayer('', {errorTileUrl: '/images/Transparent_Map_Tile.png'});

//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/4/7/8.png
var esriTopoMap = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'); 

var osmlayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	maxZoom: 18,
	baselayer:true,
	id: 'blishten.pnnbdo98',
	accessToken: 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'
});
//Luca's API key, no longer seems to work? Or the layer is gone.
//pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw
//var LucasLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
var LucasLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: '&#169; Mapbox Basemap',
	maxZoom: 18,
	baselayer:true,
	accessToken: 'pk.eyJ1IjoiamFtZXNkYXZ5IiwiYSI6ImNpenRuMmZ6OTAxMngzM25wNG81b2MwMTUifQ.A2YdXu17spFF-gl6yvHXaw',
});

//mapbox://styles/jamesdavy/cj901g8a11icc2rs8ebw04399
//mapbox - Biopama Logo style
//https://www.mapbox.com/cartogram/
//https://api.mapbox.com/styles/v1/jamesdavy/cj5w9ud2c783t2rqnmlccdwpe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFtZXNkYXZ5IiwiYSI6ImNpenRuMmZ6OTAxMngzM25wNG81b2MwMTUifQ.A2YdXu17spFF-gl6yvHXaw
var BiopamaLayer = L.tileLayer('https://api.mapbox.com/styles/v1/jamesdavy/cj901g8a11icc2rs8ebw04399/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: '&#169; Mapbox &#169; OpenStreetMap',
	maxZoom: 18,
	baselayer:true,
	accessToken: 'pk.eyJ1IjoiamFtZXNkYXZ5IiwiYSI6ImNpenRuMmZ6OTAxMngzM25wNG81b2MwMTUifQ.A2YdXu17spFF-gl6yvHXaw',
});

var NorthStarLayer = L.tileLayer('https://api.mapbox.com/styles/v1/jamesdavy/cj978rzd7180t2rs1fpvtou2q/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: '&#169; Mapbox &#169; OpenStreetMap',
	maxZoom: 18,
	baselayer:true,
	accessToken: 'pk.eyJ1IjoibWJvbmkiLCJhIjoiY2lzOHNzcWJtMDA0ODJ6czQ2eXQxOXNqeCJ9.geDRSQxeQQQkKDN9bZWeuw',
});

var MartinosLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mboni/cj978emxv180k2rmtgsz6i1b4/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: '&#169; Mapbox &#169; OpenStreetMap',
	maxZoom: 18,
	baselayer:true,
	accessToken: 'pk.eyJ1IjoibWJvbmkiLCJhIjoiY2lzOHNzcWJtMDA0ODJ6czQ2eXQxOXNqeCJ9.geDRSQxeQQQkKDN9bZWeuw',
});


// create the tile layer with correct attribution

//previously nal0g75k
var digitalGlobeLayer = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + digitalGlobeNew, {
	minZoom: 1,
	baselayer:true,
	maxZoom: 19,
	subdomains: ['a','b','c'],
	attribution: '	&#169; <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , &#169; OpenStreetMap, &#169; Mapbox'
});
var landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=' + thunderforestApiKey, {
	attribution: attribution_thunder,
	subdomains: ['a','b','c'],
});
var metal = L.tileLayer('http://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=' + thunderforestApiKey, {
	attribution: attribution_thunder,
	subdomains: ['a','b','c'],
});
var mobileatlas = L.tileLayer('http://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=' + thunderforestApiKey, {
	attribution: attribution_thunder,
	subdomains: ['a','b','c'],
});
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
	attribution: '<a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
	subdomains: ['a','b','c','d'],
});
var CountryProjects = new L.tileLayer.wms('http://h05-prod-vm11.jrc.it/geoserver/acp/wms?', {
	layers: 'acp:acp-econservation_project_countries',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});
var klcLayer = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:klc_201508',
	makeLayerQueryable: true,
	featureInfoFormat: 'application/json',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});

var completeness_index = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:completeness_index_200_rec_1',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});
var completeness_median_year = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:median_year_stropp_et_al_2016',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});
var completeness_sampling = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:completeness_index_stropp_et_al_2016',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});
/* var ACPCountries = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'gaul_acp_countries',
	featureInfoFormat: 'application/json',
	makeLayerQueryable: true,
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	version: '1.1.0',
	zIndex: 10
}); */
var ACPCountries = new L.tileLayer.wms('http://lrm-maps.jrc.ec.europa.eu/geoserver/lrmexternal/wms?', {
	layers: 'BIOPAMA_ACP_Countries',
	makeLayerQueryable: true,
	featureInfoFormat: 'text/javascript',
	formatOptions: 'callback:getJson',
	transparent: true,
	format: 'image/png',
	attribution: attribution_jrc,
	zIndex: 10
});
var CostalPAs = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:wdpa_july2015_mergpolspnts_acp_terrmar_all',
	transparent: true,
	format: 'image/png',
	crs: L.CRS.EPSG4326,
	zIndex: 100,
	minZoom: 5,
	maxZoom: 18
});
var MarinePAs = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:wdpa_july2015_mergpolspnts_acp_mar_all',
	transparent: true,
	format: 'image/png',
	crs: L.CRS.EPSG4326,
	zIndex: 100,
	minZoom: 5,
	maxZoom: 18
});
var TerrestrialPAs = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:wdpa_july2015_mergpolspnts_acp_terr_all',
	transparent: true,
	format: 'image/png',
	crs: L.CRS.EPSG4326,
	zIndex: 100,
	minZoom: 5,
	maxZoom: 18
});

var AllPas = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:wdpa_2017_jan_acp',
	attribution: 'IUCN and UNEP-WCMC (2017), The World Database on Protected Areas (WDPA), January 2017, Available at: <a href="www.protectedplanet.net">www.protectedplanet.net</a>.',
	transparent: true,
	//propName: 'WDPAID,NAME,IUCN_CAT,REP_AREA',
	format: 'image/png',
	featureInfoFormat: 'application/json',
	makeLayerQueryable: true,
	crs: L.CRS.EPSG4326,
	zIndex: 100,
	minZoom: 4,
	maxZoom: 18
});
var AllPasMarine = new L.tileLayer.wms('http://geonode-rris.biopama.org/geoserver/wms?', {
	layers: 'geonode:wdpa_2017_jan_acp2',
	styles: 'wdpa_2017_jan_acp2_8a73ddc0',
	transparent: true,
	format: 'image/png',
	crs: L.CRS.EPSG4326,
	zIndex: 100,
	minZoom: 4,
	maxZoom: 18
});

var wdpa = new L.TileLayer($url_template, {
		attribution: $attr_wdpa,
		zIndex: 2
});

var leaflet_baseMaps = [{
	groupName: "Base layers",
	expanded: true,
	layers: {
		"Digital Globe": digitalGlobeLayer,
		"Landscape": landscape,
		"Mapbox": LucasLayer,
		"Natural Earth": MartinosLayer
	}
}];
var leaflet_overlays = [
	{
		groupName : "Overlays",
		expanded: true,
		layers: {

		}
	},
];

var leaflet_options = {
	container_width: "250px",
	group_maxHeight: "300px",
	exclusive: false,
	collapsed: true,
};

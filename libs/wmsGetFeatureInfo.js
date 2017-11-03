/*

This WMS getfeature info extension extends the built in Leaflet WMS layer. 
The standard WMS layer call in leaflet will require additional parameters to use a getfeature info request.

The new paramerters are:
makeLayerQueryable: true,  				//mandatory
featureInfoFormat: 'application/json', 	//mandatory - json strongly recommended for cross browser compatibility parsing
										//some layers will not support all mime types depending on the origin server setup
propName: 'test,test,test', 			//Optional - if specified only the properties listed will be returned 
										//HOWEVER specifying a property name stops the geometry ID from being returned meaning it is not possible to highlight the layer on mouse over.
										
The property names are needed to create the information in the pop-up. 

IF YOU DO NOT KNOW THE PROPERTIES
Simply do NOT create a case for the layer
The properties will be printed to the console
You must then build a case based on the properties 


********* Here's an example of a laflet WMS call using the getfeatureinfo params **********

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

*/

jQuery(document).ready(function($) {
		
		this_map.on('click', getFeatureInfo, this_map);

		function getFeatureInfo(evt){
			ajax_array = [];
			//Lets start by making a list of all the layers that are using WMS on the map
			this_map.eachLayer(function(layer){
				if (!layer.options.minZoom){layer.options.minZoom = 0;}
			
				if (!layer.wmsParams || !layer.wmsParams.makeLayerQueryable || layer.options.minZoom > this_map.getZoom()){
					return
				}
				else{
					var url = getFeatureInfoUrl(evt.latlng, layer);
					//If the layer supports jsonp do it, otherwise use standard json or something else (to support old geoserver)
					if (layer.wmsParams.featureInfoFormat === 'text/javascript'){
						var info;
						var ajax=jQuery.ajax({
							url: url,
							jsonp: false,
							dataType: 'jsonp',
							jsonpCallback: 'getJson',
							success:function(data)
							{
								info=data;
							}
							
						}).done(function(d)
						{
							ajax.info=d;
							
						});
						ajax_array.push(ajax);
						
					} else {
						var info;
						var ajax=jQuery.ajax({
							url: url,					
							success: function (data, status, xhr) {
								info=data;
								//console.log(data);
								//var err = typeof data === 'string' ? null : data;
								
							},
							error: function (xhr, status, error) {
								//showGetFeatureInfo(error);  
							}
						}).done(function(d)
						{
							//console.log(d)
							ajax.info=d;
							
						});
						ajax_array.push(ajax);
					}
				}
			});
			$.when.apply($,ajax_array).done(function(){
				var t='';
				for(var i = 0; i < ajax_array.length; i++) {
					var layerResponse = ajax_array[i].info;
					if (layerResponse){t+=showGetFeatureInfo(evt.latlng, layerResponse);}
				}
				makeThePopUp(evt.latlng, t)
			});
		}
		
		function getFeatureInfoUrl(latlng, CurMapLayer){
			// Construct a GetFeatureInfo request URL given a point
			var point = CurMapLayer._map.latLngToContainerPoint(latlng, CurMapLayer._map.getZoom()),
				size = CurMapLayer._map.getSize(),
				params = {
				  layers: CurMapLayer.wmsParams.layers,
				  query_layers: CurMapLayer.wmsParams.layers,
				  styles: CurMapLayer.wmsParams.styles,
				  service: 'WMS',
				  feature_count: 10,
				  version: CurMapLayer.wmsParams.version,
				  request: 'GetFeatureInfo',
				  bbox: CurMapLayer._map.getBounds().toBBoxString(),
				  height: size.y,
				  width: size.x,
				  format: CurMapLayer.wmsParams.format,
				  info_format: CurMapLayer.wmsParams.featureInfoFormat,
				  srs: 'EPSG:4326',     
				};
				if (CurMapLayer.wmsParams.propName){params.PROPERTYNAME = CurMapLayer.wmsParams.propName}
				if (CurMapLayer.wmsParams.formatOptions){params.FORMAT_OPTIONS = CurMapLayer.wmsParams.formatOptions}
			
			params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
			params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
			
			return CurMapLayer._url + L.Util.getParamString(params, CurMapLayer._url, true);
		}
		
		function showGetFeatureInfo (latlng, content) {
			var html_outout = " ";
			if (content){

				if (typeof content === 'object'){
					//add a highlight to show what the user selected
					geoJsonLayer.addData(content);
					//it takes the default style for new features, so we have to reset the style each time a feature is added
					geoJsonLayer.setStyle({
						weight: 2,
						opacity: 1,
						color: 'white',
						dashArray: '5',
						fillOpacity: 0.2
					});
					if (content.features.length == 0){
						//if theres no features on the current layer, skip it
						return '';
					}else{
						for(var i = 0; i < content.features.length; i++) {
							//if there is something, find out what it is and style as needed
							//first get the name of the layer
							var layerName = content.features[i].id;
							layerName = layerName.replace(/\.[^.]*$/g, '' );
							//console.log(content);
							switch(layerName){
								case "wdpa_2017_jan_acp":
									var pa_name = content.features[i].properties.NAME;
									var wdpaid = content.features[i].properties.WDPAID;
									var IucnCat = content.features[i].properties.IUCN_CAT;
									var ReportedArea = content.features[i].properties.REP_AREA;
									ReportedArea = ReportedArea.toFixed(2);
									html_outout += 	'<h5><a href="/pa/' + wdpaid + '">' + pa_name + "</a></h5>" +
													'<h6>IUCN Category: ' + IucnCat + '</h6>' +
													'<h6>Reported Area: ' + ReportedArea + 'km&#178;</h6>';
									break;
								case "eco_mar_ter_prot_con_2016":
									var ecoBiome = content.features[i].properties.biome;
									var ecoConnect = content.features[i].properties.connect;
									var ecoName = content.features[i].properties.eco_name;
									var ecoProtection = content.features[i].properties.protection;
									ecoProtection = ecoProtection.toFixed(2);
									var ecoRelm = content.features[i].properties.realm;
									html_outout += 	'<h5>' + ecoName + "</h5>" +
													'<h6>Relm: ' + ecoRelm + '</h6>' +
													'<h6>Percentage Protected: ' + ecoProtection + '%</h6>';								
									break;
								/* case "ecoregion_protection_connection":
									var ecoBiome = content.features[i].properties.biome;
									var ecoConnect = content.features[i].properties.connect;
									var ecoName = content.features[i].properties.eco_name;
									var ecoName2 = content.features[i].properties.ecoregion_;
									var ecoProtection = content.features[i].properties.protection;
									ecoProtection = ecoProtection.toFixed(2);
									var ecoRelm = content.features[i].properties.realm;
									html_outout += 	'<h5>' + ecoName + ecoName2 + "</h5>" +
													'<h6>Relm: ' + ecoRelm + '</h6>' +
													'<h6>Percentage Protected: ' + ecoProtection + '%</h6>';								
									break; */
								case "World_EEZ_v7_2012_HR":
								case "gaul_ACP_countries":
									var countryName = content.features[i].properties.name;
									var isoa2_id = content.features[i].properties.isoa2_id;
									var isoa2_idLow = isoa2_id.toLowerCase();
									html_outout += "<a href='http://rris.biopama.org/country/" + isoa2_id + "'><h5>"+countryName+"</h5></a>"+
									"<img alt='' class='eac-flag' src='images/countryFlags/"+isoa2_idLow+".png'>"
									break;
								case "klc_201508":
									var klcName = content.features[i].properties.klcname;
									html_outout += "<h5>KLC: " + klcName + "<h5>";
									break;
								default:
									//If you added a new layer and don't know what's inside. 
									console.log('unknown layer name: '+layerName);
									console.log(content.features[i].properties);
									break;
							}
						}
					}
				} else{
					html_outout += 	"This layer did not return json, better check it out";
					/*
					//Keeping this as an example for how to work with XML
					
					parser = new DOMParser();
					xmlDoc = parser.parseFromString(content, "text/xml");
					console.log(xmlDoc.getElementsByTagName("lrmexternal:name")[0]);
 					$layer_name = xmlDoc.getElementsByTagName("lrmexternal:name")[0].childNodes[0].nodeValue;
					if ($layer_name == "Terrestrial biomes and ecoregions (TEOW)"){
						$ecoregion = xmlDoc.getElementsByTagName("ecoregion_name")[0].childNodes[0].nodeValue;
						$biome = xmlDoc.getElementsByTagName("biome")[0].childNodes[0].nodeValue;
						$realm = xmlDoc.getElementsByTagName("realm")[0].childNodes[0].nodeValue;
						html_outout += 	"<h4>"+$layer_name+"</h4>"
								+"<h5>"+"Ecoregion: "+$ecoregion+"</h5>"
								+"<h5>"+"Biome: "+$biome+"</h5>"
								+"<h5>"+"Realm: "+$realm+"</h5>";
					}*/
				}
			}
			if (html_outout == " "){
				return '';
			}
			else{
				// Otherwise show the content in a popup, or something.
				return html_outout;
			}
		}
		function makeThePopUp(latlng, html_outout){
			if (html_outout.length == 0){
				return;
			}
			else{
				L.popup({ maxWidth: 800})
					  .setLatLng(latlng)
					  .setContent(html_outout)
					  .openOn(this_map);
			}

		}
		
		//this clears the contents of the geojson layer when the pop-up gets closed.
 		this_map.addEventListener('popupclose', function() {geoJsonLayer.clearLayers();}, this);
		
});
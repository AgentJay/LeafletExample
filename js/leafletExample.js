/*
Important to add /js/leafletGlobal.js for the layer and control variables 
For a complete list of layers that can be used check /js/leafletGlobal.js
*/
var this_map;
jQuery(document).ready(function($) {
	
		var exampleMap = L.map('mapid').setView([-10.505, 50.09], 3);
		this_map=exampleMap;
		AllLayersContent = [];
		//console.log(this_map);
		geoJsonLayer = L.geoJson().addTo(this_map);


        var control = L.Control.styledLayerControl(leaflet_baseMaps, leaflet_overlays, leaflet_options);
		control.addOverlay( ACPCountries, "ACP Countries", {groupName : "Overlays", expanded: true} );
		control.addOverlay( AllPas, "2017 January PAs", {groupName : "Overlays", expanded: true} );
		control.addOverlay( AllPasMarine, "Marine/Coastal", {groupName : "Overlays", expanded: true} );
		
		exampleMap.addControl(control);
		control.selectLayer( MartinosLayer );
		control.selectLayer( ACPCountries );
		control.selectLayer( AllPas );	
		$('.pa-number').each(function () {
			$(this).prop('Counter',0).animate({
				Counter: $(this).text()
			}, {
				duration: 4000,
				easing: 'swing',
				step: function (now) {
					$(this).text(Math.ceil(now)).digits();
					
				}
			});
		});

	$.fn.digits = function(){ 
		return this.each(function(){ 
			$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
		})
	}
});
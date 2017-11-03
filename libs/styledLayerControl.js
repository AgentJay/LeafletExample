L.Control.StyledLayerControl = L.Control.Layers.extend({
    options: {
        collapsed: true,
        position: 'topright',
        autoZIndex: true
    },

    initialize: function(baseLayers, groupedOverlays, options) {
        var i,
            j;
        L.Util.setOptions(this, options);

        this._layers = {};
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];

        for (i in baseLayers) {
            for (var j in baseLayers[i].layers) {
                this._addLayer(baseLayers[i].layers[j], j, baseLayers[i], false);
            }
        }

        for (i in groupedOverlays) {
            for (var j in groupedOverlays[i].layers) {
                this._addLayer(groupedOverlays[i].layers[j], j, groupedOverlays[i], true);
            }
        }


    },

    onAdd: function(map) {
        this._initLayout();
        this._update();

        map
            .on('layeradd', this._onLayerChange, this)
            .on('layerremove', this._onLayerChange, this)
			.on('changeorder', this._onLayerChange, this)
			.on('zoomend', this._onZoomEnd, this);

        return this._container;
    },

    onRemove: function(map) {
        map
            .off('layeradd', this._onLayerChange)
            .off('layerremove', this._onLayerChange)
			.off('changeorder', this._onLayerChange);
    },

    addBaseLayer: function(layer, name, group) {
		console.log(this)
        this._addLayer(layer, name, group, false);
        this._update();
        return this;
    },

    addOverlay: function(layer, name, group) {
        this._addLayer(layer, name, group, true);
        this._update();
        return this;
    },

    removeLayer: function(layer) {
        var id = L.Util.stamp(layer);
        delete this._layers[id];
        this._update();
        return this;
    },

    removeGroup: function(group_Name) {
        for (group in this._groupList) {
            if (this._groupList[group].groupName == group_Name) {
                for (layer in this._layers) {
                    if (this._layers[layer].group && this._layers[layer].group.name == group_Name) {
                        delete this._layers[layer];
                    }
                }
                delete this._groupList[group];
                this._update();
                break;
            }
        }
    },

    selectLayer: function(layer) {
        this._map.addLayer(layer);
        this._update();
    },

    unSelectLayer: function(layer) {
        this._map.removeLayer(layer);
        this._update();
    },

    selectGroup: function(group_Name){
    	this.changeGroup( group_Name, true)
    },

    unSelectGroup: function(group_Name){
    	this.changeGroup( group_Name, false)
    },

    changeGroup: function(group_Name, select){ 
    	for (group in this._groupList) {
            if (this._groupList[group].groupName == group_Name) {
                for (layer in this._layers) {
                    if (this._layers[layer].group && this._layers[layer].group.name == group_Name) {
                        if( select ) {
                        	this._map.addLayer(this._layers[layer].layer);
                        } else {
                        	this._map.removeLayer(this._layers[layer].layer);
                        }
                    }
                }
                break;
            }
        }
        this._update();
    },


    _initLayout: function() {
        var className = 'leaflet-control-layers',
            container = this._container = L.DomUtil.create('div', className);

        //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute('aria-haspopup', true);

        if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
        } else {
            L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
        }

        var section = document.createElement('section');
        section.className = 'ac-container ' + className + '-list';

        var form = this._form = L.DomUtil.create('form');

        section.appendChild(form);

        if (this.options.collapsed) {
            if (!L.Browser.android) {
                L.DomEvent
                    .on(container, 'mouseover', this._expand, this)
                    .on(container, 'mouseout', this._collapse, this);
            }
            var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
            link.href = '#';
            link.title = 'Layers';

            if (L.Browser.touch) {
                L.DomEvent
                    .on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', this._expand, this);
            } else {
                L.DomEvent.on(link, 'focus', this._expand, this);
            }

            this._map.on('click', this._collapse, this);
            // TODO keyboard accessibility

        } else {
            this._expand();
        }

		if(this.options.title) {
			var title = L.DomUtil.create('h3', className + '-title');
			title.innerHTML = this.options.title;
			form.appendChild(title);
		}
        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(section);

        // process options of ac-container css class - to options.container_width and options.container_maxHeight
        for (var c = 0; c < (containers = container.getElementsByClassName('ac-container')).length; c++) {
            if (this.options.container_width) {
                containers[c].style.width = this.options.container_width;
            }

            // set the max-height of control to y value of map object
            this._default_maxHeight = this.options.container_maxHeight ? this.options.container_maxHeight : (this._map._size.y - 70);
            containers[c].style.maxHeight = this._default_maxHeight + "px";

        }

        window.onresize = this._on_resize_window.bind(this);

    },

    _on_resize_window: function() {
        // listen to resize of screen to reajust de maxHeight of container
        for (var c = 0; c < containers.length; c++) {
            // input the new value to height
            containers[c].style.maxHeight = (window.innerHeight - 90) < this._removePxToInt(this._default_maxHeight) ? (window.innerHeight - 90) + "px" : this._removePxToInt(this._default_maxHeight) + "px";
        }
    },

    // remove the px from a css value and convert to a int
    _removePxToInt: function(value) {
        if (typeof value === 'string') {
            return parseInt(value.replace("px", ""));
        }
        return value;
    },

    _addLayer: function(layer, name, group, overlay) {
        var id = L.Util.stamp(layer);

		
        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (group) {
            var groupId = this._groupList.indexOf(group);

            // if not find the group search for the name
            if (groupId === -1) {
                for (g in this._groupList) {
                    if (this._groupList[g].groupName == group.groupName) {
                        groupId = g;
                        break;
                    }
                }
            }

            if (groupId === -1) {
                groupId = this._groupList.push(group) - 1;
            }

            this._layers[id].group = {
                name: group.groupName,
                id: groupId,
                expanded: group.expanded
            };
        }

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },

    _update: function() {
        if (!this._container) {
			//console.log(this);
            return;
        }
		//console.log(this);
        this._baseLayersList.innerHTML = '';
        this._overlaysList.innerHTML = '';
        this._domGroups.length = 0;

        var baseLayersPresent = false,
            overlaysPresent = false,
            i,
            obj;

		var overlaysLayers = [];
        for (i in this._layers) {
			obj = this._layers[i];
			if(!obj.overlay) {
				this._addItem(obj);
			} else if(obj.layer.options && obj.layer.options.zIndex) {
				overlaysLayers[obj.layer.options.zIndex] = obj;
			} else if(obj.layer.getLayers && obj.layer.eachLayer) {
				var min = 9999999999;
				obj.layer.eachLayer(function(ly) {
					if(ly.options && ly.options.zIndex) {
						min = Math.min(ly.options.zIndex, min);
					}
				});
				overlaysLayers[min] = obj;
			}
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
        }
		if(this.options.order === 'normal') {
			for(i = 0; i < overlaysLayers.length; i++) {
				if(overlaysLayers[i]) {
					this._addItem(overlaysLayers[i]);
				}
			}
		} else {
			for(i = overlaysLayers.length-1; i >= 0; i--) {
				if(overlaysLayers[i]) {
					this._addItem(overlaysLayers[i]);
				}
			}
		}

		L.DomUtil.create('div', 'clearfix', this._baseLayersList);
		L.DomUtil.create('div', 'clearfix', this._overlaysList);
		this._map.fire('zoomend');	// to check if any layers are disabled when the layer container first appears
    },

    _onLayerChange: function(e) {
		//this._checkIfDisabled();
		//console.log(this);
        var obj = this._layers[L.Util.stamp(e.layer)];

        if (!obj) {
            return;
        }

        if (!this._handlingClick) {
            this._update();
        }
		if (e.type ==='changeorder'){
			return;
		} else {
        var type = obj.overlay ?
            (e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
            (e.type === 'layeradd' ? 'baselayerchange' : null);
		}
        if (type) {
            this._map.fire(type, obj);
        }
    },
	
    _onZoomEnd: function(e) {
        this._checkIfDisabled();
    },

    _checkIfDisabled: function(layers) {

        var currentZoom = this._map.getZoom();
        for (layerId in this._layers) {
			//console.log(this._layers[layerId]);
            if (this._layers[layerId].layer.options && (this._layers[layerId].layer.options.minZoom || this._layers[layerId].layer.options.maxZoom)) {
				var el = document.getElementById('ac-' + this._layers[layerId].name.replace(/ /g,''));
				//var el = document.querySelectorAll('label[for="ac-' + this._layers[layerId].name.replace(/ /g,'') +'"]');
				var el1 = document.getElementById('1ac-' + this._layers[layerId].name.replace(/ /g,''));
                if (currentZoom < this._layers[layerId].layer.options.minZoom || currentZoom > this._layers[layerId].layer.options.maxZoom) {
					el.disabled = 'disabled';
					el.classList.add("LayerDisabled");
					//el.nextSibling.classList.add("LayerDisabled");
					el1.classList.add("LayerDisabled");
                } else {
                    el.disabled = '';
					el.classList.remove("LayerDisabled");
					//el.nextSibling.classList.remove("LayerDisabled");
					el1.classList.remove("LayerDisabled");
                }
            }
        }
    },

    // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
    _createRadioElement: function(name, checked) {

        var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
        if (checked) {
            radioHtml += ' checked="checked"';
        }
        radioHtml += '/>';

        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = radioHtml;

        return radioFragment.firstChild;
    },

    _addItem: function(obj) {
        var label = document.createElement('div'),//this is the DIV that contains the overlays
            input,
            checked = this._map.hasLayer(obj.layer),
            container,
			//id = 'ac_layer_input_'+obj.layer._leaflet_id,
            objid = 'ac-' + obj.name.replace(/ /g,''); //removes spaces in the layer name to turn it into a css class


        if (obj.overlay) {
			//if it's an overlay start making the inputs
            input = document.createElement('input');
			input.id = objid;
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;

            label.className = "menu-item-checkbox";

        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);//this is the DIV that contains the base layers
			input.id = objid;
            label.className = "menu-item-radio";
        }

        input.layerId = L.Util.stamp(obj.layer);
		
		L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('label');
        name.setAttribute("for",objid);
        name.className = 'menu-layer';
        name.innerHTML = '<span class="LayerOverlay" id="1' + objid + '"> ' + obj.name +'<span class="disabledtext"> Out of zoom </span>' +'</span>';

        label.appendChild(input);
		
        if (obj.layer.StyledLayerControl) {

            // configure the delete button for layers with attribute removable = true
            if (obj.layer.StyledLayerControl.removable) {
                var bt_delete = document.createElement("span");
                bt_delete.type = "button";
                bt_delete.className = "bt_delete";
                L.DomEvent.on(bt_delete, 'click', this._onDeleteClick, this);
                label.appendChild(bt_delete);
            }

            // configure the visible attribute to layer
			if( obj.layer.StyledLayerControl.visible ){
				this._map.addLayer(obj.layer);
			}

        }


        if (obj.overlay) {
			var LayerUp = document.createElement("span");
			LayerUp.type = "button";
			LayerUp.className = "leaflet-up";
			L.DomEvent.on(LayerUp, 'click', this._onDownClick, this);
            label.appendChild(LayerUp);
			var LayerDown = document.createElement("span");
			LayerDown.type = "button";
			LayerDown.className = "leaflet-down";
			L.DomEvent.on(LayerDown, 'click', this._onUpClick, this);
            label.appendChild(LayerDown);
            container = this._overlaysList;
        } else {
            container = this._baseLayersList;
        }
		
		label.appendChild(name);

        var groupContainer = this._domGroups[obj.group.id];

        if (!groupContainer) {

            groupContainer = document.createElement('div');
            groupContainer.id = 'leaflet-control-accordion-layers-' + obj.group.id;

            // verify if group is expanded
			//console.log(obj.group.expanded)
            var s_expanded = obj.group.expanded ? ' checked = "true" ' : ' checked = "false" ';
			//var s_expanded=' checked = "true" ';

            // verify if type is exclusive
            var s_type_exclusive = this.options.exclusive ? ' type="radio" ' : ' type="checkbox" ';
            inputElement = '<input id="ac' + obj.group.id + '" name="accordion-1" class="menu" ' + s_expanded + s_type_exclusive + '/>';
            inputLabel = '<label for="ac' + obj.group.id + '" class="menu-label">' + obj.group.name + '</label>';

            article = document.createElement('article');
            article.className = 'ac-large';
            article.appendChild(label);

            // process options of ac-large css class - to options.group_maxHeight property
            if (this.options.group_maxHeight) {
                article.style.maxHeight = this.options.group_maxHeight;
            }

            groupContainer.innerHTML = inputElement + inputLabel;
            groupContainer.appendChild(article);
            container.appendChild(groupContainer);

            this._domGroups[obj.group.id] = groupContainer;
        } else {
            groupContainer.lastElementChild.appendChild(label);
        }
        return label;
    },

    _onInputClick: function(e) {
        var i,
            input,
            obj,
            inputs = this._form.querySelectorAll('input:not([name="accordion-1"])'),
            inputsLen = inputs.length;

        this._handlingClick = true;

        for (i = 0; i < inputsLen; i++) {
            input = inputs[i];
            obj = this._layers[input.layerId];

            if (!obj) {
                continue;
            }

            if (input.checked && !this._map.hasLayer(obj.layer)) {
                this._map.addLayer(obj.layer);

            } else if (!input.checked && this._map.hasLayer(obj.layer)) {
                this._map.removeLayer(obj.layer);
            }
        }

        this._handlingClick = false;
    },

    _onDeleteClick: function(obj) {
        var node = obj.target.parentElement.childNodes[0];
        n_obj = this._layers[node.layerId];

        // verify if obj is a basemap and checked to not remove
        if (!n_obj.overlay && node.checked) {
            return false;
        }

        if (this._map.hasLayer(n_obj.layer)) {
            this._map.removeLayer(n_obj.layer);
        }

        obj.target.parentNode.remove();

        return false;
    },

    _expand: function() {
        L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');	
		this._map.fire('zoomend');
    },

    _collapse: function(e) {
        this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
    },
	
	_onUpClick: function(e) {
		console.log(e);
		var node = e.target.parentElement.childNodes[0];
        var obj = this._layers[node.layerId];
		
		//var layerId = e.currentTarget.layerId;
		var inputs = this._form.querySelectorAll('input[type=checkbox]:not([name="accordion-1"])');
		//var obj = this._layers[layerId];

		if(!obj.overlay) {
			return;
		}

		var replaceLayer = null;
		var idx = this._getZIndex(obj);
		for(var i=0; i < inputs.length; i++) {
			//console.log(inputs[i])
			//console.info(this._layers[inputs[i]])
			var auxLayer = this._layers[inputs[i].layerId];
			var auxIdx = this._getZIndex(auxLayer);
			if(auxLayer.overlay && (idx - 1) === auxIdx) {
				replaceLayer = auxLayer;
				break;
			}
		}

		var newZIndex = idx - 1;
		if(replaceLayer) {
			obj.layer.setZIndex(newZIndex);
			replaceLayer.layer.setZIndex(newZIndex + 1);
			this._map.fire('changeorder', obj, this);
		}
	},
	
	_onDownClick: function(e) {
		var node = e.target.parentElement.childNodes[0];
        var obj = this._layers[node.layerId];
		var inputs = this._form.querySelectorAll('input[type=checkbox]:not([name="accordion-1"])');
		//console.warn(inputs.length);

		if(!obj.overlay) {
			return;
		}

		var replaceLayer = null;
		var idx = this._getZIndex(obj);
		for(var i=0; i < inputs.length; i++) {
			var auxLayer = this._layers[inputs[i].layerId];
			var auxIdx = this._getZIndex(auxLayer);
			if(auxLayer.overlay && (idx + 1) === auxIdx) {
				replaceLayer = auxLayer;
				break;
			}
		}

		var newZIndex = idx + 1;
		if(replaceLayer) {
			obj.layer.setZIndex(newZIndex);
			replaceLayer.layer.setZIndex(newZIndex - 1);
			this._map.fire('changeorder', obj, this);
		}
	},
	
	
	_getZIndex: function(ly) {

		var _layer=ly['layer'];
		var zindex = 9999999999;
		if(_layer['options'] && _layer['options']['zIndex']) {
			zindex = _layer.options.zIndex;
		} else if(_layer.getLayers && _layer.eachLayer) {
			_layer.eachLayer(function(lay) {
				if(lay.options && lay.options.zIndex) {
					zindex = Math.min(lay.options.zIndex, zindex);
				}
			});
		}
		return zindex;
	},

});

L.Control.styledLayerControl = function(baseLayers, overlays, options) {
    return new L.Control.StyledLayerControl(baseLayers, overlays, options);
};
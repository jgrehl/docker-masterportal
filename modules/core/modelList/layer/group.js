define([
    "backbone",
    "backbone.radio",
    "openlayers",
    "modules/core/modelList/layer/model"
], function (Backbone, Radio, ol, Layer) {

    var GroupLayer = Layer.extend({

        /**
         *
         */
        createLayerSource: function () {
            // TODO noch keine Typ unterscheidung -> nur WMS
            this.createChildLayerSources(this.get("layerdefinitions"));
            this.createChildLayers(this.get("layerdefinitions"));
            this.createLayer();
        },

        /**
         * [createChildLayerSource description]
         * @return {[type]} [description]
         */
        createChildLayerSources: function (childlayers) {
            var sources = [];

            _.each(childlayers, function (child) {
                var source = new ol.source.TileWMS({
                    url: child.url,
                    params: {
                        LAYERS: child.layers,
                        FORMAT: child.format,
                        VERSION: child.version,
                        TRANSPARENT: true
                    }
                });

                sources.push(source);
            });
            this.setChildLayerSources(sources);
        },

        /**
         * [createChildLayer description]
         * @return {[type]} [description]
         */
        createChildLayers: function (childlayers) {
            var layer = new ol.Collection();

            _.each(childlayers, function (childLayer, index) {
                layer.push(new ol.layer.Tile({
                    source: this.getChildLayerSources()[index]
                }));
            }, this);
            this.setChildLayers(layer);
        },

        /**
         *
         */
        createLayer: function () {
            var groupLayer = new ol.layer.Group({
                layers: this.getChildLayers()
            });

            this.setLayer(groupLayer);
        },

        /**
         * [createLegendURL description]
         * @return {[type]} [description]
         */
        createLegendURL: function () {
            var legendURL = [];

            _.each(this.get("layerdefinitions"), function (layer) {
                if (layer.legendURL === "" || layer.legendURL === undefined) {
                    var layerNames = layer.layers.split(",");

                    if (layerNames.length === 1) {
                        legendURL.push(layer.url + "?VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + layer.layers);
                    }
                    else if (layerNames.length > 1) {
                        _.each(layerNames, function (layerName) {
                            legendURL.push(this.get("url") + "?VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + layerName);
                        }, this);
                    }
                }
            }, this);
            this.set("legendURL", legendURL);
        },

        /**
         * [showLayerInformation description]
         * @return {[type]} [description]
         */
        showLayerInformation: function () {
            var legendURL = [],
                names = [],
                styleList = Radio.request("StyleList", "returnAllModelsById", this.attributes.id);

           if (styleList.length > 0) {
                _.each(styleList, function (style) {
                    legendURL.push(style.get("imagepath") + style.get("imagename"));
                    if (style.has("legendValue")) {
                        names.push(style.get("legendValue"));
                    }
                    else {
                        names.push(style.get("styleFieldValue"));
                    }
                });
            }
            else {
                if (this.get("legendURL").length > 1) {
                    _.each(this.get("legendURL"), function (singleLegendURL) {
                        legendURL.push(singleLegendURL);
                    });
                }
                else {
                    legendURL.push(this.get("legendURL"));
                }
                if (! _.isUndefined(this.get("datasets"))) {
                    names.push(this.get("datasets")[0].md_name);
                }
            }
            Radio.trigger("LayerInformation", "add", {
                "id": this.getId(),
                "legendURL": legendURL,
                "metaID": this.get("layerdefinitions")[0].datasets[0] ? this.get("layerdefinitions")[0].datasets[0].md_id : null,
                "name": names,
                "layername": this.get("name")
            });
        },

        /**
         * Setter für das Attribut "childLayerSources"
         * @param {ol.source[]} value
         */
        setChildLayerSources: function (value) {
            this.set("childLayerSources", value);
        },

        /**
         * Setter für das Attribut "childlayers"
         * @param {ol.Collection} - Eine ol.Collection mit ol.layer Objekten
         */
        setChildLayers: function (value) {
            this.set("childlayers", value);
        },

        /**
        * Getter für das Attribute "childLayerSources"
        * @return {ol.source[]}
        */
        getChildLayerSources: function () {
            return this.get("childLayerSources");
        },

        /**
         * Getter für das Attribut "childlayers"
         * @return {ol.Collection} - Eine ol.Collection mit ol.layer Objekten
         */
        getChildLayers: function () {
            return this.get("childlayers");
        }

    });

    return GroupLayer;
});

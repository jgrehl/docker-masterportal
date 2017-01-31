define(function (require) {

    var Layer = require("modules/core/modelList/layer/model"),
        ol = require("openlayers"),
        GeoJSONLayer;

    GeoJSONLayer = Layer.extend({

        /**
         * [createLayerSource description]
         * @return {[type]} [description]
         */
        createLayerSource: function () {
            this.setLayerSource(new ol.source.Vector({
                features: this.getFeatures()
            }));
        },

        /**
         * [createLayer description]
         * @return {[type]} [description]
         */
        createLayer: function () {
            this.setLayer(new ol.layer.Vector({
                source: this.getLayerSource(),
                style: this.getStyles()
            }));
        },

        /**
         * Zeigt alle Features mit dem Default-Style an
         */
        showAllFeatures: function () {
            var collection = this.getLayerSource().getFeatures();

            collection.forEach(function (feature) {
                feature.setStyle(this.getStyles());
            }, this);
        },

        /**
         * Versteckt alle Features mit dem Hidden-Style
         */
        hideAllFeatures: function () {
            var collection = this.getLayerSource().getFeatures();

            collection.forEach(function (feature) {
                feature.setStyle(this.getHiddenStyle());
            }, this);
        },

        /**
         * Zeigt nur die Features an, deren Id übergeben wird
         * @param  {string[]} featureIdList
         */
        showFeaturesByIds: function (featureIdList) {
            _.each(featureIdList, function (id) {
                var feature = this.getLayerSource().getFeatureById(id);

                feature.setStyle(this.getStyles());
            }, this);
        },

        /**
         * Versteckt nur die Features an, deren Id übergeben wird
         * @param  {string[]} featureIdList
         */
        hideFeaturesByIds: function (featureIdList) {
            _.each(featureIdList, function (id) {
                var feature = this.getLayerSource().getFeatureById(id);

                feature.setStyle(this.getHiddenStyle());
            }, this);
        },

        // Getter
        getFeatures: function () {
            return this.get("features");
        },

        getStyles: function () {
            if (this.get("id") === "flurst" || this.get("id") === "potfl") {
                return this.getDefaultStylePolygon();
            }
        },

        getDefaultStylePolygon: function () {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(49, 159, 211, 0.8)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(50, 50, 50, 1)",
                    width: 1
                })
            });
        },

        getHiddenStyle: function () {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255, 255, 255, 0)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(49, 159, 211, 0)"
                })
            });
        }
    });

    return GeoJSONLayer;
});

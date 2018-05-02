define(function (require) {

    var Backbone = require("backbone"),
        Radio = require("backbone.radio"),
        ol = require("openlayers"),
        Einwohnerabfrage;

    Einwohnerabfrage = Backbone.Model.extend({
        defaults: {
            drawInteraction: undefined,
            isCollapsed: undefined,
            isCurrentWin: undefined,
            // circle overlay (tooltip) - shows the radius
            circleOverlay: new ol.Overlay({
                offset: [15, 0],
                positioning: "center-left"
            })
        },

        initialize: function () {
            this.listenTo(Radio.channel("Window"), {
                "winParams": this.setStatus
            });

            this.createDomOverlay(this.get("circleOverlay"));
        },

        setStatus: function (args) {
            if (args[2].getId() === "einwohnerabfrage" && args[0] === true) {
                this.set("isCollapsed", args[1]);
                this.set("isCurrentWin", args[0]);
                this.createDrawInteraction("Box");
            }
            else {
                this.set("isCurrentWin", false);
                this.get("drawInteraction").setActive(false);
                Radio.trigger("Map", "removeOverlay", this.get("circleOverlay"));
            }
        },

        createDrawInteraction: function (value) {
            var layer = Radio.request("Map", "createLayerIfNotExists", "ewt_draw_layer"),
                drawInteraction = new ol.interaction.Draw({
                    source: layer.getSource(),
                    type: value === "Box" ? "Circle" : value,
                    geometryFunction: value === "Box" ? ol.interaction.Draw.createBox() : undefined
                });

            this.toggleOverlay(value, this.get("circleOverlay"));
            this.setDrawInteractionListener(drawInteraction, layer);
            this.set("drawInteraction", drawInteraction);
            Radio.trigger("Map", "addInteraction", drawInteraction);
        },

        setDrawInteractionListener: function (interaction, layer) {
            interaction.on("drawstart", function (evt) {
                layer.getSource().clear();
                if (evt.feature.getGeometry() === "Circle") {
                    this.showOverlayOnSketch(evt.feature.getGeometry());
                }
            }, this);

            interaction.on("drawend", function (evt) {
                this.featureToGeoJson(evt.feature)
            }, this);

            interaction.on("change:active", function (evt) {
                if (evt.oldValue) {
                    layer.getSource().clear();
                    Radio.trigger("Map", "removeInteraction", evt.target);
                }
            });
        },

        showOverlayOnSketch: function (geometry) {
            geometry.on("change", function (evt) {
                var radius = this.roundRadius(evt.target.getRadius());

                this.get("circleOverlay").getElement().innerHTML = radius;
                this.get("circleOverlay").setPosition(evt.target.getLastCoordinate());
            }, this);
        },

        /**
         * converts a feature to a geojson
         * if the feature geometry is a circle, it is converted to a polygon
         * @param {ol.Feature} feature - drawn feature
         */
        featureToGeoJson: function (feature) {
            var reader = new ol.format.GeoJSON(),
                geometry = feature.getGeometry(),
                geoJsonFeature;

            if (geometry.getType() === "Circle") {
                feature.setGeometry(ol.geom.Polygon.fromCircle(geometry));
            }
            geoJsonFeature = reader.writeFeatureObject(feature);
            // trigger geoJsonFeature
        },

        /**
         * adds or removes the circle overlay from the map
         * @param {string} type - geometry type
         * @param {ol.Overlay} circleOverlay
         */
        toggleOverlay: function (type, circleOverlay) {
            if (type === "Circle") {
                Radio.trigger("Map", "addOverlay", circleOverlay);
            }
            else {
                Radio.trigger("Map", "removeOverlay", circleOverlay);
            }
        },

        /**
         * rounds the circle radius
         * @param {number} radius - circle radius
         * @return {string} the rounded radius
         */
        roundRadius: function (radius) {
            if (radius > 500) {
                return (Math.round(radius / 1000 * 100) / 100) + " km";
            }
            return (Math.round(radius * 10) / 10) + " m";
        },

        /**
         * creates a div element for the circle overlay
         * and adds it to the overlay
         * @param {ol.Overlay} circleOverlay
         */
        createDomOverlay: function (circleOverlay) {
            var element = document.createElement('div');

            element.setAttribute("id", "circle-overlay");
            circleOverlay.setElement(element);
        }
    });

    return Einwohnerabfrage;
});

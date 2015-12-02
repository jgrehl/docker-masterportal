define([
    "backbone",
    "eventbus",
    "openlayers",
    "proj4",
    "modules/layer/wfsStyle/list",
    "config"
], function (Backbone, EventBus, ol, proj4, StyleList, Config) {

    var Orientation = Backbone.Model.extend({
        defaults: {
            "marker": new ol.Overlay({positioning: "center-center", stopEvent: false}),
            "newCenter": ""
        },
        initialize: function () {
            EventBus.on("setOrientation", this.setOrientation, this);
            EventBus.on("getPOI", this.getPOI, this);
            EventBus.on("layerlist:sendVisiblePOIlayerList", this.getPOIParams, this);
        },
        setOrientation: function (btn) {
            var geolocation = new ol.Geolocation({tracking: true, projection: ol.proj.get("EPSG:4326")});

            geolocation.on ("change", function () {
                var position = geolocation.getPosition();

                this.set("newCenter", proj4(proj4("EPSG:4326"), proj4(Config.view.epsg), position));
                EventBus.trigger("mapView:setCenter", this.get("newCenter"), 6);
                EventBus.trigger("setGeolocation", [this.get("newCenter"), position]);
                var marker = this.get("marker");

                marker.setElement(document.getElementById("geolocation_marker"));
                marker.setPosition(this.get("newCenter"));
                this.set("marker", marker);
                EventBus.trigger("addOverlay", marker);
                geolocation.setTracking(false);
                if (btn === "poi") {
                    this.getPOI(500);
                }
                EventBus.trigger("showGeolocationMarker", this);
            }, this);
            geolocation.once("error", function () {
                EventBus.trigger("alert", {
                    text: "<strong>Problem ermittelt.</strong> Standpunktbestimmung momentan nicht verfügbar!",
                    kategorie: "alert-warning"
                });
                $(function () {
                    $("#loader").hide();
                });
                EventBus.trigger("clearGeolocationMarker", this);
            }, this);
        },
        getPOI: function (distance) {
            this.set("distance", distance);
            var circle = new ol.geom.Circle(this.get("newCenter"), this.get("distance")),
                circleExtent = circle.getExtent();

            this.set("circleExtent", circleExtent);
            EventBus.trigger("layerlist:getVisiblePOIlayerList", this);
        },
        getPOIParams: function (visibleWFSLayers) {

            if (this.get("circleExtent") && visibleWFSLayers) {
                _.each(visibleWFSLayers, function (layer) {
                    if (layer.has("source") === true) {
                        layer.get("source").forEachFeatureInExtent(this.get("circleExtent"), function (feature) {
                            EventBus.trigger("setModel", feature, StyleList, this.get("distance"), this.get("newCenter"), layer);
                        }, this);
                    }
                }, this);
                EventBus.trigger("showPOIModal");
            }
        }
    });

    return new Orientation();
});

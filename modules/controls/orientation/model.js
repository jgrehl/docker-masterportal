define([
    "backbone",
    "eventbus",
    "openlayers",
    "proj4",
    "modules/layer/wfsStyle/list",
    "config",
    "backbone.radio"
], function (Backbone, EventBus, ol, proj4, StyleList, Config, Radio) {

    var OrientationModel = Backbone.Model.extend({
        defaults: {
            zoomMode: "once", // once oder allways entsprechend Config
            counter: 0, // Counter der Standortbestimmung
            marker: new ol.Overlay({
                positioning: "center-center",
                stopEvent: false
            }),
            isPoiOn: false,
            tracking: false, // Flag, ob derzeit getrackt wird.
            geolocation: null // ol.geolocation wird bei erstmaliger Nutzung initiiert.
        },
        initialize: function () {
            this.setZoomMode(Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr);
            if (_.isUndefined(Radio.request("Parser", "getItemByAttributes", {id: "poi"})) === false) {
                this.setIsPoiOn(Radio.request("Parser", "getItemByAttributes", {id: "poi"}).attr);
            }
            this.listenTo(Radio.channel("ModelList"), {
                "updateVisibleInMapList": this.checkWFS
            });
            EventBus.on("setOrientation", this.track, this);
            EventBus.on("getPOI", this.getPOI, this);
            EventBus.on("orientation:removeOverlay", this.removeOverlay, this);
        },
        removeOverlay: function () {
            EventBus.trigger("removeOverlay", this.get("marker"));
        },
        untrack: function () {
            var geolocation = this.get("geolocation");

            geolocation.un ("change", this.positioning, this);
            geolocation.un ("error", this.onError, this);
            this.set("counter", 0);
            this.set("tracking", false);
            this.removeOverlay();
        },
        track: function () {
            var geolocation;

            EventBus.trigger("addOverlay", this.get("marker"));
            if (this.get("geolocation") === null) {
                geolocation = new ol.Geolocation({tracking: true, projection: ol.proj.get("EPSG:4326")});
                this.set("geolocation", geolocation);
            }
            else {
                geolocation = this.get("geolocation");
                this.positioning();
            }
            this.set("tracking", true);
            geolocation.on ("change", this.positioning, this);
            geolocation.on ("error", this.onError, this);
        },
        positionMarker: function (position) {
            try {
                this.get("marker").setPosition(position);
            }
            catch (e) {
            }
        },
        zoomAndCenter: function (position) {
            EventBus.trigger("mapView:setCenter", position, 6);
        },
        positioning: function () {
            var geolocation = this.get("geolocation"),
                position = geolocation.getPosition(),
                counter = this.get("counter") + 1,
                zoomMode = this.get("zoomMode"),
                centerPosition = proj4(proj4("EPSG:4326"), proj4(Config.view.epsg), position);

            // Setze evt. Routing-Start
            EventBus.trigger("setGeolocation", [centerPosition, position]);

            if (zoomMode === "once") {
                if (counter === 1) {
                    this.positionMarker(centerPosition);
                    this.zoomAndCenter(centerPosition);
                }
                else {
                    this.positionMarker(centerPosition);
                }
            }
            else {
                this.positionMarker(centerPosition);
                this.zoomAndCenter(centerPosition);
            }
            this.set("counter", counter);
        },
        onError: function (evt) {
            EventBus.trigger("alert", {
                text: "<strong>Lokalisierung nicht verfügbar: </strong>" + evt.message,
                kategorie: "alert-danger"
            });
            this.untrack();
        },
        onPOIError: function (evt) {
            EventBus.trigger("alert", {
                text: "<strong>'In meiner Nähe' nicht verfügbar: </strong>" + evt.message,
                kategorie: "alert-danger"
            });
            this.untrack();
            $("#loader").hide();
        },
        trackPOI: function () {
            var geolocation;

            EventBus.trigger("addOverlay", this.get("marker"));
            if (this.get("geolocation") === null) {
                geolocation = new ol.Geolocation({tracking: true, projection: ol.proj.get("EPSG:4326")});
                this.set("geolocation", geolocation);
            }
            else {
                geolocation = this.get("geolocation");
                this.callGetPOI();
            }
            geolocation.once ("change", this.callGetPOI, this);
            geolocation.once ("error", this.onPOIError, this);
        },
        untrackPOI: function () {
            var geolocation = this.get("geolocation");

            geolocation.un ("change", this.callGetPOI, this);
            geolocation.un ("error", this.onPOIError, this);
        },
        callGetPOI: function () {
            this.getPOI(500);
            this.untrackPOI();
        },
        getPOI: function (distance) {
            var geolocation = this.get("geolocation"),
                position = geolocation.getPosition(),
                centerPosition = proj4(proj4("EPSG:4326"), proj4(Config.view.epsg), position);

            this.positionMarker(centerPosition);
            this.set("distance", distance);
            this.set("newCenter", centerPosition);
            var circle = new ol.geom.Circle(centerPosition, this.get("distance")),
                circleExtent = circle.getExtent();

            this.set("circleExtent", circleExtent);
            this.getPOIParams();
        },
        getPOIParams: function (visibleWFSLayers) {
            var visibleWFSLayers = Radio.request("ModelList", "getModelsByAttributes", {isVisibleInMap: true, typ: "WFS"});

            if (this.get("circleExtent") && visibleWFSLayers) {
                _.each(visibleWFSLayers, function (layer) {
                    if (layer.has("layerSource") === true) {
                        layer.get("layer").getSource().forEachFeatureInExtent(this.get("circleExtent"), function (feature) {
                            EventBus.trigger("setModel", feature, StyleList, this.get("distance"), this.get("newCenter"), layer);
                        }, this);
                    }
                }, this);
                EventBus.trigger("showPOIModal");
            }
        },

        /**
         * Setter Methode für das Attribut zoomMode
         * @param {String} value - once oder allways
         */
        setZoomMode: function (value) {
            this.set("zoomMode", value);
        },

        /**
         * Setter Methode für das Attribut isPoiOn
         * @param {bool} value
         */
        setIsPoiOn: function (value) {
            this.set("isPoiOn", value);
        }
    });

    return new OrientationModel();
});

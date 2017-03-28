define([
    "backbone.radio",
    "openlayers",
    "proj4",
    "config"
], function (Radio, ol, proj4, Config) {

    var OrientationModel = Backbone.Model.extend({
        defaults: {
            zoomMode: "once", // once oder allways entsprechend Config
            firstGeolocation: true, // Flag, ob es sich um die erste geolocation handelt, damit "once" abgebildet werden kann.
            marker: new ol.Overlay({
                positioning: "center-center",
                stopEvent: false
            }),
            isPoiOn: false,
            tracking: false, // Flag, ob derzeit getrackt wird.
            geolocation: null, // ol.geolocation wird bei erstmaliger Nutzung initiiert.
            position: "",
            isGeolocationDenied: false,
            markerIcon: "geolocation_marker"
        },
        initialize: function () {
            if (Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr.zoomMode) {
              this.setZoomMode(Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr.zoomMode);
            }
            else {
              this.setZoomMode(Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr);
            }
            if (_.isUndefined(Radio.request("Parser", "getItemByAttributes", {id: "poi"})) === false) {
                this.setIsPoiOn(Radio.request("Parser", "getItemByAttributes", {id: "poi"}).attr);
            }
            this.listenTo(Radio.channel("ModelList"), {
                "updateVisibleInMapList": this.checkWFS
            });

            var channel = Radio.channel("Geolocation");

            channel.on({
                "removeOverlay": this.removeOverlay,
                "getPOI": this.getPOI,
                "sendPosition": this.sendPosition
            }, this);

            this.setMarkerIcon();
        },
        /*
        * Triggert die Standpunktkoordinate auf Radio
        */
        sendPosition: function () {
            if (this.get("tracking") === false) {
                this.listenToOnce(this, "change:position", function () {
                    Radio.trigger("Geolocation", "position", this.get("position"));
                    this.untrack();
                });
                this.track();
            }
            else {
                Radio.trigger("Geolocation", "position", this.get("position"));
            }
        },
        removeOverlay: function () {
            Radio.trigger("Map", "removeOverlay", this.get("marker"));
        },
        untrack: function () {
            var geolocation = this.get("geolocation");

            if (geolocation !== null) {
                geolocation.un ("change", this.positioning, this);
                geolocation.un ("error", this.onError, this);
            }
            this.set("firstGeolocation", true);
            this.set("tracking", false);
            this.removeOverlay();
        },
        track: function () {
            var geolocation,
                config = Radio.request("Parser", "getPortalConfig");

            if (this.getIsGeolocationDenied() === false) {
                Radio.trigger("Map", "addOverlay", this.get("marker"));
                if (this.get("geolocation") === null) {
                    geolocation = new ol.Geolocation({tracking: true, projection: ol.proj.get("EPSG:4326")});
                    this.set("geolocation", geolocation);
                    this.onceOrAlways(geolocation, config);
                }
                else {
                    geolocation = this.get("geolocation");
                    this.positioning();
                }
                if (config.controls.orientation === "once" || (_.isUndefined(config.controls.orientation.zoomMode) === false && config.controls.orientation.zoomMode === "once")) {
                    this.set("firstGeolocation", true);
                }
            }
            else {
                this.onError();
            }
        },

        /**
        * Unterscheided, ob in der config once oder always für Orientation angegeben wurde und setzt Event entsprechend.
        */
        onceOrAlways: function (geolocation, config) {
            if (config.controls.orientation === "once" || (_.isUndefined(config.controls.orientation.zoomMode) === false && config.controls.orientation.zoomMode === "once")) {
                geolocation.one ("change", this.positioning, this);
                geolocation.one ("error", this.onError, this);
            }
            else {
                geolocation.on ("change", this.positioning, this);
                geolocation.on ("error", this.onError, this);
                this.set("tracking", true);
            }
        },
        positionMarker: function (position) {
            if (this.getMarkerIcon() !== "geolocation_marker") {
                Radio.trigger("DragMarker", "setPosition", position);
            }
            else {
                try {
                    this.get("marker").setPosition(position);
                }
                catch (e) {
                }
            }
        },
        zoomAndCenter: function (position) {
            Radio.trigger("MapView", "setCenter", position, 6);
        },
        positioning: function () {
            var geolocation = this.get("geolocation"),
                position = geolocation.getPosition(),
                firstGeolocation = this.get("firstGeolocation"),
                zoomMode = this.get("zoomMode"),
                centerPosition = proj4(proj4("EPSG:4326"), proj4(Config.view.epsg), position);

            // speichere Position
            this.set("position", centerPosition);

            // Bildschirmnavigation
            if (zoomMode === "once") {
                if (firstGeolocation === true) {
                    this.positionMarker(centerPosition);
                    this.zoomAndCenter(centerPosition);
                    this.set("firstGeolocation", false);
                }
                else {
                    this.positionMarker(centerPosition);
                }
            }
            else {
                this.positionMarker(centerPosition);
                this.zoomAndCenter(centerPosition);
            }
        },
        onError: function () {
            Radio.trigger("Alert", "alert", {
                text: "<strong>Lokalisierung nicht verfügbar: </strong>",
                kategorie: "alert-danger"
            });
            this.setIsGeolocationDenied(true);
            this.untrack();
        },
        onPOIError: function (evt) {
            Radio.trigger("Alert", "alert", {
                text: "<strong>'In meiner Nähe' nicht verfügbar: </strong>" + evt.message,
                kategorie: "alert-danger"
            });
            this.untrack();
            $("#loader").hide();
        },
        trackPOI: function () {
            var geolocation;

            Radio.trigger("Map", "addOverlay", this.get("marker"));
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
            this.getPOI(0);
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
                            Radio.trigger("POICollection", "setModel", feature, this.get("distance"), this.get("newCenter"), layer);
                        }, this);
                    }
                }, this);
                Radio.trigger("poi", "showPOIModal");
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
        },

        setIsGeolocationDenied: function (value) {
          this.set("isGeolocationDenied", value);
        },

        getIsGeolocationDenied: function () {
          return this.get("isGeolocationDenied");
        },

        setOrientationMarkerIcon: function () {
            if (this.get("markerIcon") !== "geolocation_marker") {
                this.removeOverlay();
                $("#geolocation_marker").hide();
            }
            else {
                this.get("marker").setElement(document.getElementById("geolocation_marker"));
            }
        },

        setMarkerIcon: function () {
            if (Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr.markerIcon === "dragMarker") {
                this.set("markerIcon", "dragMarker");
            }
        },

        getMarkerIcon: function () {
            return this.get("markerIcon");
        },

        /**
        * Fügt der Orientation eine Klasse über die config.js hinzu, für mml genutzt um Orientation nur Mobil anzuzeigen
        */
        addGeolocationClass: function () {
            var className;

            if (Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr.addClass) {
                className = Radio.request("Parser", "getItemByAttributes", {id: "orientation"}).attr.addClass;
                $("#orientation").addClass(className);
            }
        }
    });

    return new OrientationModel();
});

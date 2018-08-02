define(function (require) {
    var Backbone = require("backbone"),
        Radio = require("backbone.radio"),
        ol = require("openlayers"),
        Config = require("config"),
        $ = require("jquery"),
        MapMarkerModel;

    MapMarkerModel = Backbone.Model.extend({
        defaults: {
            marker: new ol.Overlay({
                positioning: "bottom-center",
                stopEvent: false
            }),
            polygon: new ol.layer.Vector({
                name: "mapMarker",
                source: new ol.source.Vector(),
                alwaysOnTop: true,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#08775f",
                        lineDash: [8],
                        width: 4
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(8, 119, 95, 0.3)"
                    })
                })
            }),
            wkt: "",
            markers: [],
            zoomLevel: 7
        },
        initialize: function () {
            var searchConf = Radio.request("Parser", "getItemsByAttributes", {type: "searchBar"})[0].attr;

            Radio.trigger("Map", "addOverlay", this.get("marker"));
            Radio.trigger("Map", "addLayerToIndex", [this.get("polygon"), Radio.request("Map", "getLayers").getArray().length]);

            if (_.has(searchConf, "zoomLevel")) {
                this.setZoomLevel(searchConf.zoomLevel);
            }
            this.askForMarkers();
        },

        getFeature: function () {
            var format = new ol.format.WKT(),
                feature = format.readFeature(this.get("wkt"));

            return feature;
        },

        getExtent: function () {
            var feature = this.getFeature(),
                extent = feature.getGeometry().getExtent();

            return extent;
        },

        /**
         * Hilsfunktion zum ermitteln eines Features mit textueller Beschreibung
         * @param  {string} type Geometrietyp
         * @param  {number[]} geom Array mit Koordinatenwerten
         * @return {string} wkt WellKnownText-Geom
         */
        getWKTGeom: function (type, geom) {
            var wkt,
                split,
                regExp;

            if (type === "POLYGON") {
                wkt = type + "((";
                _.each(geom, function (element, index, list) {
                    if (index % 2 === 0) {
                        wkt += element + " ";
                    }
                    else if (index === list.length - 1) {
                        wkt += element + "))";
                    }
                    else {
                        wkt += element + ", ";
                    }
                });
            }
            else if (type === "POINT") {
                wkt = type + "(";
                wkt += geom[0] + " " + geom[1];
                wkt += ")";
            }
            else if (type === "MULTIPOLYGON") {
                wkt = type + "(((";
                _.each(geom, function (element, index) {
                    split = geom[index].split(" ");

                    _.each(split, function (coord, index2, list) {
                        if (index2 % 2 === 0) {
                            wkt += coord + " ";
                        }
                        else if (index2 === list.length - 1) {
                            wkt += coord + "))";
                        }
                        else {
                            wkt += coord + ", ";
                        }
                    });
                    if (index === geom.length - 1) {
                        wkt += ")";
                    }
                    else {
                        wkt += ",((";
                    }
                });
                regExp = new RegExp(", \\)\\?\\(", "g");
                wkt = wkt.replace(regExp, "),(");
            }

            return wkt;
        },

        // frägt das model in zoomtofeatures ab und bekommt ein Array mit allen Centerpoints der pro Feature-BBox
        askForMarkers: function () {
            var centers,
                imglink;

            if (_.has(Config, "zoomtofeature")) {
                centers = Radio.request("ZoomToFeature", "getCenterList");
                imglink = Config.zoomtofeature.imglink;

                _.each(centers, function (center, i) {
                    var id = "featureMarker" + i,
                        marker,
                        markers;

                    // lokaler Pfad zum IMG-Ordner ist anders
                    $("#map").append("<div id=" + id + " class='featureMarker'><img src='" + Radio.request("Util", "getPath", imglink) + "'></div>");

                    marker = new ol.Overlay({
                        id: id,
                        offset: [-12, 0],
                        positioning: "bottom-center",
                        element: document.getElementById(id),
                        stopEvent: false
                    });

                    marker.setPosition(center);
                    markers = this.get("markers");
                    markers.push(marker);
                    this.setMarkers(markers);
                    Radio.trigger("Map", "addOverlay", marker);
                }, this);
                Radio.trigger("ZoomToFeature", "zoomtofeatures");
            }
        },

        /**
         * Erstellt ein Polygon um das WKT-Feature
         * @return {void}
         */
        showFeature: function () {
            var feature = this.getFeature();

            this.get("polygon").getSource().addFeature(feature);
            this.get("polygon").setVisible(true);
        },

        /**
         * Löscht das Polygon
         * @return {void}
         */
        hideFeature: function () {
            this.get("polygon").getSource().clear();
        },

        // setter for zoomLevel
        setZoomLevel: function (value) {
            this.set("zoomLevel", value);
        },

        // setter for wkt
        setWkt: function (type, geom) {
            var value = this.getWKTGeom(type, geom);

            this.set("wkt", value);
        },

        // setter for marker
        setMarker: function (value) {
            this.set("marker", value);
        },

        // setter for markers
        setMarkers: function (value) {
            this.set("markers", value);
        },

        // setter for polygon
        setPolygon: function (value) {
            this.set("polygon", value);
        }
    });

    return MapMarkerModel;
});

define(function (require) {
    var Backbone = require("backbone"),
        Radio = require("backbone.radio"),
        ol = require("openlayers"),
        MapHandlerModel = require("modules/mapMarker/model"),
        searchVector = new ol.layer.Vector({
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
        MapMarker;

    Radio.trigger("Map", "addLayerToIndex", [searchVector, Radio.request("Map", "getLayers").getArray().length]);

    MapMarker = Backbone.View.extend({
        model: new MapHandlerModel(),
        id: "searchMarker",
        className: "glyphicon glyphicon-map-marker",
        /**
        * @description View des Map Handlers
        * @returns {void}
        */
        initialize: function () {
            var markerPosition,
                channel = Radio.channel("MapMarker");

            channel.on({
                "clearMarker": this.clearMarker,
                "zoomTo": this.zoomTo,
                "hideMarker": this.hideMarker,
                "showMarker": this.showMarker,
                "zoomToBPlan": this.zoomToBPlan,
                "zoomToBKGSearchResult": this.zoomToBKGSearchResult
            }, this);

            this.render();
            // For BauInfo: requests customModule and askes for marker position to set.
            markerPosition = Radio.request("CustomModule", "getMarkerPosition");
            if (markerPosition) {
                this.showMarker(markerPosition);
            }
            this.model.askForMarkers();
        },
        render: function () {
            this.model.get("marker").setElement(this.$el[0]);
        },
        /**
        * @description Entfernt den searchVector
        * @returns {void}
        */
        clearMarker: function () {
            searchVector.getSource().clear();
        },
        /**
        * @description Zoom auf Treffer
        * @param {Object} hit - Treffer der Searchbar
        * @returns {void}
        */
        zoomTo: function (hit) {
            // Lese index mit Maßstab 1:1000 als maximal Scale, sonst höchstmögliche Zommstufe
            var resolutions = Radio.request("MapView", "getResolutions"),
                index = _.indexOf(resolutions, 0.2645831904584105) === -1 ? resolutions.length : _.indexOf(resolutions, 0.2645831904584105),
                hasPolygon, isMobile;

            this.clearMarker();
            switch (hit.type) {
                case "Straße": {
                    this.model.getWKTFromString("POLYGON", hit.coordinate);

                    Radio.trigger("Map", "zoomToExtent", this.model.getExtentFromString(), {maxZoom: index});
                    break;
                }
                case "Parcel": {
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    this.showMarker(hit.coordinate);
                    break;
                }
                case "Krankenhaus": {
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
                case "Adresse": {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
                case "Stadtteil": {
                    hasPolygon = _.has(hit, "polygon");

                    if (hasPolygon) {
                        this.model.getWKTFromString("POLYGON", hit.polygon);
                        Radio.trigger("Map", "zoomToExtent", this.model.getExtentFromString(), {maxZoom: index});
                    }
                    else {
                        this.showMarker(hit.coordinate);
                        Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    }
                    break;
                }
                case "Thema": {
                    isMobile = Radio.request("Util", "isViewMobile");

                    // desktop - Themenbaum wird aufgeklappt
                    if (isMobile === false) {
                        Radio.trigger("ModelList", "showModelInTree", hit.id);
                    }
                    // mobil
                    else {
                        // Fügt das Model zur Liste hinzu, falls noch nicht vorhanden
                        Radio.trigger("ModelList", "addModelsByAttributes", {id: hit.id});
                        Radio.trigger("ModelList", "setModelAttributesById", hit.id, {isSelected: true});
                    }
                    break;
                }
                case "Olympiastandort": {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
                case "Paralympiastandort": {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
                case "SearchByCoord": {
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    this.showMarker(hit.coordinate);
                    break;
                }
                case "Feature-Lister-Hover": {
                    this.showMarker(hit.coordinate);
                    break;
                }
                case "Feature-Lister-Click": {
                    Radio.trigger("Map", "zoomToExtent", hit.coordinate);
                    break;
                }
                case "Schulinfosystem": {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, 6);
                    break;
                }
                case "POI": {
                    Radio.trigger("Map", "zoomToExtent", hit.coordinate, {maxZoom: index});
                    break;
                }
                default: {
                    if (hit.coordinate.length === 2) {
                        Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                        this.showMarker(hit.coordinate);
                    }
                    else if (hit.coordinate.length === 4) {
                        Radio.trigger("Map", "zoomToExtent", hit.coordinate);
                    }
                    else if (hit.coordinate.length > 4) {
                        this.model.getWKTFromString("POLYGON", hit.coordinate);
                        this.showPolyline();
                        Radio.trigger("Map", "zoomToExtent", this.model.getExtentFromString());
                    }

                    break;
                }
            }
        },

        /*
        * @description Getriggert von bkg empfängt diese Methode die XML der gesuchten Adresse
        * @param {string} data - Die Data-Object des request.
        */
        zoomToBKGSearchResult: function (data) {
            var coordinates;

            if (data.features[0].properties.bbox.type === "Point") {
                Radio.trigger("MapView", "setCenter", data.features[0].properties.bbox.coordinates, this.model.get("zoomLevel"));
                this.showMarker(data.features[0].properties.bbox.coordinates);
            }
            else if (data.features[0].properties.bbox.type === "Polygon") {
                coordinates = "";

                _.each(data.features[0].properties.bbox.coordinates[0], function (point) {
                    coordinates += point[0] + " " + point[1] + " ";
                });
                this.model.getWKTFromString("POLYGON", coordinates.trim());
                Radio.trigger("Map", "zoomToExtent", this.model.getExtentFromString());
            }
        },

        /**
         * Erstellt eine Polyline um das WKT-Feature
         * @return {void}
         */
        showPolyline: function () {
            var feature = this.model.getFeature();

            searchVector.getSource().addFeature(feature);
            searchVector.setVisible(true);
        },

        showMarker: function (coordinate) {
            this.clearMarker();
            this.model.get("marker").setPosition(coordinate);
            this.$el.show();
        },

        hideMarker: function () {
            this.$el.hide();
        }
    });

    return MapMarker;
});

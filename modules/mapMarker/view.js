define([
    "jquery",
    "openlayers",
    "modules/mapMarker/model",
    "eventbus"
    ], function ($, ol, MapHandlerModel, EventBus) {
    "use strict";

    var searchVector = new ol.layer.Vector({
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
        template: _.template("<span class='glyphicon glyphicon-remove'></span>"),
        events: {
            "click .glyphicon-remove": "hideMarker"
        },
        /**
        * @description View des Map Handlers
        */
        initialize: function () {
            var channel = Radio.channel("MapMarker");

            channel.on({
                "showMarker": this.showMarker,
                "hideMarker": this.hideMarker
            }, this);
            channel.reply({
                "getCloseButtonCorners": function () {
                    var bottomSM,
                        leftSM,
                        widthSM,
                        heightSM,
                        topSM,
                        rightSM;

                    if (this.$el.is(":visible") === false) {
                        return {
                            top: -1,
                            bottom: -1,
                            left: -1,
                            right: -1
                        };
                    }
                    else {
                        bottomSM = $("#searchMarker .glyphicon-remove").offset().top,
                            leftSM = $("#searchMarker .glyphicon-remove").offset().left,
                            widthSM = $("#searchMarker .glyphicon-remove").outerWidth(),
                            heightSM = $("#searchMarker .glyphicon-remove").outerHeight(),
                            topSM = bottomSM + heightSM,
                            rightSM = leftSM + widthSM;

                        return {
                            top: topSM,
                            bottom: bottomSM,
                            left: leftSM,
                            right: rightSM
                        };
                    }
                },
                "getPosition": this.getMarkerPosition
            }, this);

            channel.on({
                "mapHandler:clearMarker": this.clearMarker,
                "mapHandler:zoomTo": this.zoomTo,
                "mapHandler:hideMarker": this.hideMarker,
                "mapHandler:showMarker": this.showMarker,
                "mapHandler:zoomToBPlan": this.zoomToBPlan,
                "mapHandler:zoomToBKGSearchResult": this.zoomToBKGSearchResult
            }, this);

            this.listenTo(EventBus, {
                "mapHandler:clearMarker": this.clearMarker,
                "mapHandler:zoomTo": this.zoomTo,
                "mapHandler:hideMarker": this.hideMarker,
                "mapHandler:showMarker": this.showMarker,
                "mapHandler:zoomToBPlan": this.zoomToBPlan,
                "mapHandler:zoomToBKGSearchResult": this.zoomToBKGSearchResult
            }, this);

            this.render();
            this.model.askForMarkers();
        },
        render: function () {
            this.$el.html(this.template());

            this.model.get("marker").setElement(this.$el[0]);
        },
        /**
        * @description Entfernt den searchVector
        */
        clearMarker: function () {
            searchVector.getSource().clear();
        },
        /**
        * @description Zoom auf Treffer
        * @param {Object} hit - Treffer der Searchbar
        */
        zoomTo: function (hit) {
            var isMobile;

            this.clearMarker();
            switch (hit.type) {
                case "Ort": {
                    EventBus.trigger("bkg:bkgSearch", hit.name); // Abfrage der Details zur Adresse inkl. Koordinaten
                    break;
                }
                case "Straße": {
                    // this.model.getWKTFromString("POLYGON", hit.coordinate);
                    // // Lese index mit Maßstab 1:1000 als maximal Scale, sonst höchstmögliche Zommstufe
                    // var resolutions = Radio.request("MapView", "getResolutions"),
                    //     index = _.indexOf(resolutions, 0.2645831904584105) === -1 ? resolutions.length : _.indexOf(resolutions, 0.2645831904584105);
                    //
                    // Radio.trigger("Map", "zoomToExtent", this.model.getExtentFromString(), {maxZoom: index});
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevelStreet"));
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
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
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
                case "festgestellt": {
                    EventBus.trigger("specialWFS:requestbplan", hit.type, hit.name); // Abfrage der Details des BPlans, inkl. Koordinaten
                    break;
                }
                case "im Verfahren": {
                    EventBus.trigger("specialWFS:requestbplan", hit.type, hit.name); // Abfrage der Details des BPlans, inkl. Koordinaten
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
                case "Kita": {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
                default: {
                    this.showMarker(hit.coordinate);
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.model.get("zoomLevel"));
                    break;
                }
            }
        },
        /*
        * @description Getriggert vom specialWFS empfängt diese Methode die XML des zu suchenden BPlans.
        * @param {string} data - Die Data-XML des request.
        */
        zoomToBPlan: function (data) {
            var GMLReader = new ol.format.GML(),
                feature = GMLReader.readFeatures(data)[0],
                extent;

            this.clearMarker();
            extent = feature.getGeometry().getExtent();
            searchVector.getSource().addFeature(feature);
            searchVector.setVisible(true);
            Radio.trigger("Map", "zoomToExtent", extent);
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
        *
        */
        showMarker: function (coordinate) {
            this.clearMarker();
            this.model.get("marker").setPosition(coordinate);
            this.$el.show();
        },
        /**
        *
        */
        hideMarker: function () {
            this.$el.hide();
        },

        getMarkerPosition: function () {
            return this.model.get("marker").getPosition();
        }
    });

    return MapMarker;
});

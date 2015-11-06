define([
    "backbone",
    "openlayers",
    "modules/mapMarker/model",
    "eventbus"
    ], function (Backbone, ol, MapHandlerModel, EventBus) {
    "use strict";
    return Backbone.View.extend({
        model: MapHandlerModel,
        /**
        * @description View des Map Handlers
        */
        initialize: function () {
            EventBus.on("mapHandler:zoomTo", this.zoomTo, this);
            EventBus.on("mapHandler:hideMarker", this.hideMarker, this);
            EventBus.on("mapHandler:showMarker", this.showMarker, this);
            EventBus.on("mapHandler:zoomToBPlan", this.zoomToBPlan, this);
            EventBus.on("mapHandler:zoomToBKGSearchResult", this.zoomToBKGSearchResult, this);
        },
        /**
        * @description Zoom auf Treffer
        * @param {Object} hit - Treffer der Searchbar
        */
        zoomTo: function (hit) {
            var zoomLevel;

            switch (hit.type) {
                case "Ortssuche": {
                    EventBus.trigger("bkg:bkgSearch", hit.name); // Abfrage der Details zur Adresse inkl. Koordinaten
                    break;
                }
                case "Straße": {
                    EventBus.trigger("zoomToExtent", this.model.getExtentFromString("POLYGON", hit.coordinate));
                    break;
                }
                case "Parcel": {
                    EventBus.trigger("zoomToExtent", this.model.getExtentFromString("POINT", hit.coordinate));
                    this.showMarker(hit.coordinate);
                    break;
                }
                case "Krankenhaus": {
                    EventBus.trigger("mapView:setCenter", hit.coordinate, 5);
                    break;
                }
                case "Adresse": {
                    zoomLevel = 7;
                    this.showMarker(hit.coordinate);
                    EventBus.trigger("mapView:setCenter", hit.coordinate, zoomLevel);
                    break;
                }
                case "Stadtteil": {
                    zoomLevel = 7;
                    this.showMarker(hit.coordinate);
                    EventBus.trigger("mapView:setCenter", hit.coordinate, zoomLevel);
                    break;
                }
                case "Thema": {
                    EventBus.trigger("showLayerInTree", hit.model); // den Tree gibt es nur zusammen mit Karte
                    break;
                }
                case "Olympiastandort": {
                    zoomLevel = 5;
                    this.showMarker(hit.coordinate);
                    EventBus.trigger("mapView:setCenter", hit.coordinate, zoomLevel);
                    break;
                }
                case "Paralympiastandort": {
                    zoomLevel = 5;
                    this.showMarker(hit.coordinate);
                    EventBus.trigger("mapView:setCenter", hit.coordinate, zoomLevel);
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
            }
        },
        /*
        * @description Getriggert vom specialWFS empfängt diese Methode die XML des zu suchenden BPlans.
        * @param {string} data - Die Data-XML des request.
        */
        zoomToBPlan: function (data) {
            var wkt,
                hits = $("gml\\:Polygon,Polygon", data),
                wktArray = [],
                geom,
                extent;

            if (hits.length > 1) {
                _.each(hits, function (hit) {
                    var geoms = $(hits).find("gml\\:posList,posList");

                    if (geoms.length === 1) {
                        geom = geoms[0].textContent;
                    }
                    else {
                        geom = geoms[0].textContent + " )?(" + geoms[1].textContent;
                    }
                    wktArray.push(geom);
                });
                extent = this.model.getExtentFromString("MULTIPOLYGON", wktArray);
            }
            else if (hits.length === 1) {
                geom = $(hits).find("gml\\:posList,posList")[0].textContent;
                extent = this.model.getExtentFromString("POLYGON", geom);
            }
            EventBus.trigger("zoomToExtent", extent);
        },
        /*
        * @description Getriggert von bkg empfängt diese Methode die XML der gesuchten Adresse
        * @param {string} data - Die Data-Object des request.
        */
        zoomToBKGSearchResult: function (data) {
            if (data.features[0].properties.typ === "Haus") {
                EventBus.trigger("mapView:setCenter", data.features[0].properties.bbox.coordinates, 5);
                this.showMarker(data.features[0].properties.bbox.coordinates);
            }
            else {
                var coordinates = "";

                _.each(data.features[0].properties.bbox.coordinates[0], function (point) {
                    coordinates += point[0] + " " + point[1] + " ";
                });
                var extent = this.model.getExtentFromString("POLYGON", coordinates.trim());

                EventBus.trigger("zoomToExtent", extent);
            }
        },
        /**
        *
        */
        showMarker: function (coordinate) {
            this.model.get("marker").setPosition(coordinate);
            $("#searchMarker").css("display", "block");
        },
        /**
        *
        */
        hideMarker: function () {
            $("#searchMarker").css("display", "none");
        }
    });
});

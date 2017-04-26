define(function (require) {

    var Backbone = require("backbone"),
        ol = require("openlayers"),
        Radio = require("backbone.radio"),
        EventBus = require("eventbus"),
        DragMarkerModel;

    "use strict";
    DragMarkerModel = Backbone.Model.extend({
        defaults: {
            coordinate: [565764, 5933975], // Start-Koordinate
            featureName: "DragMarkerPoint",
            dragMarkerLayer: new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [10, 30], // Anchor for marker_red_small.png
                        anchorXUnits: "pixels",
                        anchorYUnits: "pixels",
                        opacity: 0.7,
                        scale: 1.4,
                        imgSize: [23, 32],
                        src: Radio.request("Util", "getImgPath") + "dragMarker.svg"
                    })
                }),
                alwaysOnTop: true,
                visible: true
            }),
            dragInteraction: new ol.interaction.Pointer({
                handleDownEvent: function (evt) {
                    return Radio.request("DragMarker", "handleDownEvent", evt);
                },
                handleDragEvent: function (evt) {
                    Radio.trigger("DragMarker", "handleDragEvent", evt);
                },
                handleMoveEvent: function () {
                    Radio.trigger("DragMarker", "handleMoveEvent");
                },
                handleUpEvent: function () {
                    return Radio.request("DragMarker", "handleUpEvent");
                }
            }),
            dragMarkerFeature: null,
            featureAtPixel: null,
            sourceHH: null,
            url: "",
            zoomLevelStreet: 4,
            firstDMA: true
        },

        initialize: function () {
            // Radio channel
            var channel = Radio.channel("DragMarker"),
            searchConf = Radio.request("Parser", "getItemsByAttributes", {type: "searchBar"})[0].attr;

            channel.on({
                "handleDragEvent": this.handleDragEvent,
                "handleMoveEvent": this.handleMoveEvent,
                "setPosition": this.setPosition,
                "hide": this.hideMarker,
                "show": this.showMarker,
                "requestAddress": this.sendOrRequestNearestAddress
            }, this);

            channel.reply({
                "handleDownEvent": this.handleDownEvent,
                "handleUpEvent": this.handleUpEvent,
                "getPosition": this.getPosition
            }, this);

            EventBus.on("searchbar:hit", this.searchbarhit, this);

            // external Radio channel
            Radio.on("ReverseGeocoder", "addressComputed", this.setNearestAddress, this);

            // internal Listeners
            this.listenTo(this, {"change:nearestAddress": this.sendNewAddress});

            // Prepare Map
            Radio.trigger("Map", "addLayerToIndex", [this.get("dragMarkerLayer"), Radio.request("Map", "getLayers").getArray().length]);
            Radio.trigger("Map", "addInteraction", this.get("dragInteraction"));

            // Set defaults
            this.setPosition(this.get("coordinate"));
            this.readConfig();
            this.getBoundaryHH();

            if (_.has(searchConf, "zoomLevelStreet")) {
                this.setZoomLevelStreet(searchConf.zoomLevelStreet);
            }
        },

        readConfig: function () {
            var config = Radio.request("Parser", "getPortalConfig").mapMarkerModul,
                landesgrenzeId = config.dragMarkerLandesgrenzeId ? config.dragMarkerLandesgrenzeId.toString() : null,
                landesgrenzeLayer = landesgrenzeId ? Radio.request("RawLayerList", "getLayerWhere", {id: landesgrenzeId}) : "",
                url = landesgrenzeLayer ? landesgrenzeLayer.get("url") : "";

            this.set("url", url);
        },

        checkInitialVisibility: function () {
            var visible = Radio.request("Parser", "getPortalConfig").mapMarkerModul.visible;

            if (visible === false) {
                this.hideMarker();
            }
            else {
                this.showMarker();
            }
        },
        getDragMarkerLayer: function () {
            return this.get("dragMarkerLayer");
        },

        showMarker: function () {
            this.getDragMarkerLayer().setVisible(true);
        },

        hideMarker: function () {
            this.getDragMarkerLayer().setVisible(false);
        },

        // liest die landesgrenze_hh.json ein und ruft dann parse auf
        getBoundaryHH: function () {
            this.fetch({
                url: Radio.request("Util", "getPath", this.get("url")),
                cache: false,
                error: function () {
                    Radio.trigger("Alert", "alert", {text: "<strong>Landesgrenze kann nicht geladen werden!", kategorie: "alert-danger"});
                }
            });
        },

        parse: function (data) {
            this.getFeatureFromResponse(data);
        },

        // sets polygon of hamburg
        getFeatureFromResponse: function (data) {
            var vectorSource = new ol.source.Vector({
                    format: new ol.format.GeoJSON()
                });

            vectorSource.addFeatures(vectorSource.getFormat().readFeatures(data));
            this.set("sourceHH", vectorSource);
        },

        // returns boolean isInside Hamburg
        isInsideHH: function (coord) {
            var featureAtCoord = this.get("sourceHH").getFeaturesAtCoordinate(coord),
                isInside = featureAtCoord.length > 0 ? true : false;

            return isInside;
        },

        // sets feature to specific coordiante without zooming
        setPosition: function (coordinate) {
            var pointFeature = new ol.Feature({
                name: this.get("featureName"),
                geometry: new ol.geom.Point(coordinate)
            });

            this.get("dragMarkerLayer").getSource().clear();
            this.get("dragMarkerLayer").getSource().addFeature(pointFeature);
            this.set("coordinate", coordinate);
            this.requestNewAddress();
        },

        // replies specific coordinate of feature
        getPosition: function () {
            return this.get("coordinate");
        },

        // receives new address from WPS
        setNearestAddress: function (response) {
            this.set("nearestAddress", response);
        },

        // gets called when address gets selected
        searchbarhit: function (hit) {
            var coord = _.isArray(hit.coordinate) ? hit.coordinate : _.map(hit.coordinate.split(" "), function (t) {
                    return parseFloat(t);
                }),
                type = coord.length === 2 ? "point" : coord.length === 10 ? "bbox" : undefined,
                nestedArr = [],
                geom,
                newCoord;

            if (type === "point") {
                this.setPosition(coord);
                if (hit.type === "Straße") {
                    Radio.trigger("MapView", "setCenter", hit.coordinate, this.getZoomLevelStreet());
                }
                else {
                    this.zoomTo(coord);
                }
            }
            else if (type === "bbox") {
                _.each(coord, function (num, index, array) {
                    if (index % 2 === 0) {
                        nestedArr.push ([num, array[index + 1]]);
                    }
                });
                geom = new ol.geom.LineString(nestedArr);
                newCoord = ol.extent.getCenter(geom.getExtent());

                this.setPosition(newCoord);
                this.zoomTo(newCoord);
            }
        },

        // zoom der Map auf Koordinate
        zoomTo: function (coord) {
            Radio.trigger("MapView", "setCenter", coord, 7);
        },

        // Requests "nearestAddress", indem der ReverseGeocoder angefragt wird.
        requestNewAddress: function () {
            Radio.trigger("ReverseGeocoder", "request", this.get("coordinate"));
        },

        // Wird auf listenTo "change:nearestAddress" registriert. Liefert Adressobjekt bzw. Fehlerobjekt aus.
        sendNewAddress: function () {
            Radio.trigger("DragMarker", "newAddress", this.get("nearestAddress"), this.getFirstDMAdress());
            if (this.getFirstDMAdress() === true) {
                this.setFirstDMAdress(false);
            }
        },

        // Wird auf Radio "requestAddress" ausgeführt. Prüft, ob gültige Adresse ermittelt wurde und triggert diese sofort bzw. initiiert eine neue Abfrage
        sendOrRequestNearestAddress: function () {
            var newAddress = this.get("nearestAddress");

            if (_.has(newAddress, "error") === true) {
                this.requestNewAddress(); // letztmalig wurde ein Fehlerobjekt zurückgemeldet. Daher neue Anfrage.
            }
            else if (_.isNull(newAddress) === true) {
                this.requestNewAddress(); // noch keine Addresse ermittelt. Daher neue Anfrage.
            }
            else if (_.has(newAddress, "distance") === true) {
                this.sendNewAddress(); // eine gültige Addresse wurde bereits ermittelt. Direkt triggern.
            }
        },

        // INTERACTION EVENTS
        // start Event
        handleDownEvent: function (evt) {
            var hasFeaturesAtPixel = evt.map.hasFeatureAtPixel(evt.pixel),
                feature;

            if (hasFeaturesAtPixel === true) {
                feature = evt.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });

                if (feature.get("name") === this.get("featureName")) {
                    this.set("featureAtPixel", feature);
                    this.set("coordinate", feature.getGeometry().getCoordinates());
                    this.set("dragMarkerFeature", feature);
                }
            }

            return hasFeaturesAtPixel;
        },

        // calculates move-vector
        handleDragEvent: function (evt) {
            var evtCoordinate,
                isInside;

            if (_.isNull(this.get("featureAtPixel")) === false) {
                evtCoordinate = evt.coordinate,
                    isInside = this.isInsideHH(evtCoordinate);

                document.body.style.cursor = "pointer";
                if (isInside) {
                    this.set("coordinate", evtCoordinate);
                    this.get("dragMarkerFeature").getGeometry().setCoordinates([evtCoordinate[0], evtCoordinate[1]]);
                }
            }
        },

        // stop Event
        handleUpEvent: function () {
            document.body.style.cursor = "default";
            this.requestNewAddress();
            this.set("dragMarkerFeature", null);
            this.set("featureAtPixel", null);
            return false;
        },

        /**
        * Setter Zoomlevel für Straßen
        */
        setZoomLevelStreet: function (value) {
            this.set("zoomLevelStreet", value);
        },
        /**
        * Getter Zoomlevel für Straßen
        */
        getZoomLevelStreet: function () {
            return this.get("zoomLevelStreet");
        },

        /**
        * Setter firstDMA für erste Adresssuche über ReverseGeocoder
        */
        setFirstDMAdress: function (value) {
            this.set("firstDMA", value);
        },

        /**
        * Getter firstDMA für erste Adresssuche über ReverseGeocoder
        */
        getFirstDMAdress: function () {
            return this.get("firstDMA");
        }
    });

    return DragMarkerModel;
});

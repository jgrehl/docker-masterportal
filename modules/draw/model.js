define([
    "backbone",
    "openlayers",
    "eventbus"
], function () {

    var Backbone = require("backbone"),
        ol = require("openlayers"),
        EventBus = require("eventbus"),
        DrawTool;

    DrawTool = Backbone.Model.extend({

        defaults: {
            source: new ol.source.Vector(),
            interactions: [
                { text: "Punkt zeichnen", type: "Point", name: "drawPoint" },
                { text: "Linie zeichnen", type: "LineString", name: "drawLine" },
                { text: "Polygon zeichnen", type: "Polygon", name: "drawArea" },
                { text: "Text schreiben", type: "Point", name: "writeText" }
            ],
            selectedInteraction: "drawPoint",
            types: ["Point", "LineString", "Polygon"],
            selectedType: "Point",
            fonts: ["Arial", "Times New Roman", "Calibri"],
            selectedFont: "Arial",
            fontSizes: [
                { name: "8 px", value: 8 },
                { name: "10 px", value: 10 },
                { name: "12 px", value: 12 },
                { name: "14 px", value: 14 },
                { name: "16 px", value: 16 },
                { name: "18 px", value: 18 },
                { name: "20 px", value: 20 },
                { name: "24 px", value: 24 },
                { name: "28 px", value: 28 },
                { name: "32 px", value: 32 }
            ],
            selectedFontSize: 16,
            text: "Klicken Sie auf die Karte um den Text zu platzieren",
            colors: [
                { name: "Blau", value: "rgba(55, 126, 184, 0.5)" },
                { name: "Gelb", value: "rgba(255, 255, 51, 0.5)" },
                { name: "Grau", value: "rgba(153, 153, 153, 0.5)" },
                { name: "Grün", value: "rgba(77, 175, 74, 0.5)" },
                { name: "Orange", value: "rgba(255, 127, 0, 0.5)" },
                { name: "Rot", value: "rgba(228, 26, 28, 0.5)" },
                { name: "Schwarz", value: "rgba(0, 0, 0, 0.5)" },
                { name: "Weiß", value: "rgba(255, 255, 255, 0.5)" }
            ],
            selectedColor: "rgba(255, 127, 0, 0.5)",
            pointRadiuses: [
                { name: "6 px", value: 6 },
                { name: "8 px", value: 8 },
                { name: "10 px", value: 10 },
                { name: "12 px", value: 12 },
                { name: "14 px", value: 14 },
                { name: "16 px", value: 16 }
            ],
            radius: 6,
            strokeWidth: [
                { name: "1 px", value: 1 },
                { name: "2 px", value: 2 },
                { name: "3 px", value: 3 },
                { name: "4 px", value: 4 },
                { name: "5 px", value: 5 },
                { name: "6 px", value: 6 }
            ],
            selectedStrokeWidth: 1,
            opacity: [
                {name: "0 %", value: "1.0"},
                {name: "10 %", value: "0.9"},
                {name: "20 %", value: "0.8"},
                {name: "30 %", value: "0.7"},
                {name: "40 %", value: "0.6"},
                {name: "50 %", value: "0.5"},
                {name: "60 %", value: "0.4"},
                {name: "70 %", value: "0.3"},
                {name: "80 %", value: "0.2"},
                {name: "90 %", value: "0.1"}
            ],
            selectedOpacity: "0.5"
        },

        initialize: function () {
            this.listenTo(EventBus, {
                "winParams": this.setStatus,
                "getDrawlayer": this.getLayer
            });

            this.listenTo(this, {
                "change:selectedInteraction": this.setStyle,
                "change:text": this.setStyle,
                "change:selectedFont": this.setStyle,
                "change:selectedFontSize": this.setStyle,
                "change:selectedColor change:radius change:selectedStrokeWidth": this.setStyle,
                "change:drawendCoords": this.triggerDrawendCoords
            });

            this.set("layer", new ol.layer.Vector({
                source: this.get("source")
            }));
            EventBus.trigger("addLayer", this.get("layer"));
        },

        setStatus: function (args) {
            if (args[2] === "draw" && args[0] === true) {
                this.set("isCollapsed", args[1]);
                this.set("isCurrentWin", args[0]);
                this.setStyle();
            }
            else {
                this.set("isCurrentWin", false);
                EventBus.trigger("removeInteraction", this.get("draw"));
            }
        },

        createInteraction: function () {
            EventBus.trigger("removeInteraction", this.get("draw"));
            this.set("draw", new ol.interaction.Draw({
                source: this.get("source"),
                type: this.get("selectedType"),
                style: this.get("style")
            }));
            this.get("draw").on("drawend", function (evt) {
                this.setDrawendCoords(evt.feature.getGeometry());
                evt.feature.setStyle(this.get("style"));
            }, this);
            EventBus.trigger("addInteraction", this.get("draw"));
        },

        /**
         * Setzt den "Draw Type" (Point, LineString oder Polygon).
         */
        setType: function () {
            var selectedInteraction = _.findWhere(this.get("interactions"), {name: this.get("selectedInteraction")});

            this.set("selectedType", selectedInteraction.type);
            if (this.get("selectedType") !== "Point") {
                this.set("radius", 6);
            }
            this.createInteraction();
        },

        /**
         * Setzt die Interaction.
         * @param {string} value - drawPoint | drawLine | drawArea | writeText
         */
        setInteraction: function (value) {
            this.set("selectedInteraction", value);
        },

        /**
         * Setzt die Schriftart.
         * @param {string} value - Arial | Times New Roman | Calibri
         */
        setFont: function (value) {
            this.set("selectedFont", value);
        },

        /**
         * Setzt die Schriftgröße.
         * @param {number} value - 8 | 10 | 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32
         */
        setFontSize: function (value) {
            this.set("selectedFontSize", value);
        },

        /**
         * Setzt die Farbe für Schrift und Geometrie.
         * @param {string} value - rgba-Wert
         */
        setColor: function (value) {
            var color = value.substr(0, value.length - 4) + this.get("selectedOpacity");

            this.set("selectedColor", color + ")");
        },

        /**
         * Setzt die Transparenz.
         * @param {string} value - 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
         */
        setOpacity: function (value) {
            this.set("selectedOpacity", parseFloat(value, 10).toFixed(1));
            this.setColor(this.get("selectedColor"));
        },

        /**
         * Setzt den Text.
         * @param {string} value - Text von $(".drawText")
         */
        setText: function (value) {
            this.set("text", value);
        },

        /**
         * Setzt den Radius.
         * @param {string} value - 6 | 8 | 10 | 12 | 14 | 16
         */
        setPointRadius: function (value) {
            this.set("radius", parseInt(value, 10));
        },

        /**
         * Setzt die Strichstärke.
         * @param {string} value - 1 | 2 | 3 | 4 | 5 | 6
         */
        setStrokeWidth: function (value) {
            this.set("selectedStrokeWidth", parseInt(value, 10));
        },

        /**
         * Setzt den Style für ein Feature.
         */
        setStyle: function () {
            if (this.get("selectedInteraction") === "writeText") {
                this.set("style", this.getTextStyle());
            }
            else {
                this.set("style", this.getDrawStyle());
            }
            this.setType();
        },

        /**
         * Erstellt ein Feature Style für Punkte, Linien oder Flächen und gibt ihn zurück.
         * @return {ol.style.Style}
         */
        getDrawStyle: function () {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: this.get("selectedColor")
                }),
                stroke: new ol.style.Stroke({
                    color: this.get("selectedColor").substr(0, this.get("selectedColor").length - 6) + ", 1)",
                    width: this.get("selectedStrokeWidth")
                }),
                image: new ol.style.Circle({
                    radius: this.get("radius"),
                    fill: new ol.style.Fill({
                        color: this.get("selectedColor")
                    })
                })
            });
        },

        /**
         * Erstellt ein Feature Style für Texte und gibt ihn zurück.
         * @return {ol.style.Style}
         */
        getTextStyle: function () {
            return new ol.style.Style({
                text: new ol.style.Text({
                    text: this.get("text"),
                    font: this.get("selectedFontSize") + "px " + this.get("selectedFont"),
                    fill: new ol.style.Fill({
                        color: this.get("selectedColor").substr(0, this.get("selectedColor").length - 6) + ", 1)"
                    })
                })
            });
        },

        // Löscht alle Geometrien
        deleteFeatures: function () {
            this.get("source").clear();
        },

        getLayer: function () {
            EventBus.trigger("sendDrawLayer", this.get("layer"));
        },

        setDrawendCoords: function (geom) {
            var geoJSON = new ol.format.GeoJSON();

            this.set("drawendCoords", geoJSON.writeGeometry(geom));
        },

        triggerDrawendCoords: function () {
            EventBus.trigger("getDrawendCoords", this.get("drawendCoords"));
        }
    });

    return DrawTool;
});

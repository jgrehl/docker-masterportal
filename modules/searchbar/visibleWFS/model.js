define([
    "backbone",
    "eventbus",
    "modules/layer/list",
    "modules/searchbar/model"
    ], function (Backbone, EventBus) {
    "use strict";
    return Backbone.Model.extend({
        /**
        *
        */
        defaults: {
            inUse: false,
            features: [],
            minChars: 3
        },
        /**
         * @description Initialisierung der visibleWFS Suche
         * @param {Object} config - Das Konfigurationsobjekt der Suche in sichtbaren WFS.
         * @param {integer} [config.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
         */
        initialize: function (config) {
            if (config.minChars) {
                this.set("minChars", config.minChars);
            }
            EventBus.on("layerlist:sendVisibleWFSlayerList", this.getFeaturesForSearch, this);
            EventBus.on("searchbar:search", this.search, this);
            EventBus.trigger("layerlist:getVisibleWFSlayerList");
        },
        /**
        *
        */
        search: function (searchString) {
            if (this.get("inUse") === false && searchString.length >= this.get("minChars")) {
                this.set("inUse", true);
                var searchStringRegExp = new RegExp(searchString.replace(/ /g, ""), "i"); // Erst join dann als regulärer Ausdruck

                this.searchInFeatures(searchStringRegExp);
                EventBus.trigger("createRecommendedList");
                this.set("inUse", false);
            }
        },
        /**
        *
        */
        searchInFeatures: function (searchStringRegExp) {
            _.each(this.get("features"), function (feature) {
                var featureName = feature.name.replace(/ /g, "");

                // Prüft ob der Suchstring ein Teilstring vom Feature ist
                if (featureName.search(searchStringRegExp) !== -1) {
                    EventBus.trigger("searchbar:pushHits", "hitList", feature);
                }
            }, this);
        },
        /**
        *
        */
        getFeaturesForSearch: function (layermodels) {
            this.set("features", []);
            var featureArray = [],
                imageSrc;

            _.each(layermodels, function (layer) {
                if (_.has(layer.attributes, "searchField") === true && layer.get("searchField") !== "" && layer.get("searchField") !== undefined) {
                    if (layer.get("layer").getStyle()[0]) {
                        imageSrc = layer.get("layer").getStyle()[0].getImage().getSrc();
                        if (imageSrc) {
                            var features = layer.get("layer").getSource().getFeatures();

                            _.each(features, function (feature) {
                                featureArray.push({
                                    name: feature.get("name"),
                                    type: "Krankenhaus",
                                    coordinate: feature.getGeometry().getCoordinates(),
                                    imageSrc: imageSrc,
                                    id: feature.get("name").replace(/ /g, "") + layer.get("name")});
                            });
                        }
                    }
                }
            });
            this.set("features", featureArray);
        }
    });
});

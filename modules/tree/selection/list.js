define([
    "backbone",
    "backbone.radio",
    "eventbus",
    "config",
    "bootstrap/popover"
], function (Backbone, Radio, EventBus, Config) {

    var list = Backbone.Collection.extend({
        initialize: function () {
            var channel = Radio.channel("SelectedList");

            // EventBus Listener
            this.listenTo(EventBus, {
                "layerlist:sendSelectedLayerList": this.addModelsToList,
                "addModelToSelectionList": this.addModelToList,
                "removeModelFromSelectionList": this.remove,
                "getSelectedVisibleWMSLayer": this.sendVisibleWMSLayer,
                "layerselectionlist:createParamsForURL": this.createParamsForURL
            }, this);

            // Eigene Listener
            this.listenTo(this, {
                "update": function () {
                    channel.trigger("changedList", this.models);
                },
                "add": this.addLayerToMap,
                "remove": this.removeLayerFromMap,
                "change:visibility change:transparence": function () {
                    channel.trigger("changedList", this.models);
                }
            });

            // Selektierte Layer werden in die Auswahl übernommen
            this.loadSelection();
        },

        loadSelection: function () {
            // Wird ausgewertet wenn das Portal parametrisiert aufgerufen wird
            if (_.has(Config.tree, "layerIDsToSelect") === true) {
                _.each(Config.tree.layerIDsToSelect, function (obj) {
                    EventBus.trigger("layerlist:setAttributionsByID", obj.id, {"selected": true});
                    EventBus.trigger("layerlist:setAttributionsByID", obj.id, {"visibility": obj.visibility});
                }, this);
            }
            // Über die Konfiguration sichtbar geschaltete Hintergrundkarten
            if (_.has(Config.tree, "baseLayer") === true) {
                _.each(_.where(Config.tree.baseLayer, {visibility: true}), function (obj) {
                    EventBus.trigger("layerlist:setAttributionsByID", obj.id, {"selected": true});
                }, this);
            }
            if (_.has(Config.tree, "layer") === true) {
                _.each(_.where(Config.tree.layer, {visibility: true}), function (obj) {
                    EventBus.trigger("layerlist:setAttributionsByID", obj.id, {"selected": true});
                }, this);
            }
        },

        // Fügt der Collection ein Model hinzu. Layer werden immer ans Ende hinzugefügt, der erste Baselayer an den Anfang.
        // Zusätzliche Baselayer werden immer über dem am höchsten platzierten Baselayer eingefügt.
        addModelToList: function (model) {
            if (model.get("isbaselayer") === false) {
                this.add(model);
            }
            else {
                var highestIndex = [],
                    baselayerList = this.where({isbaselayer: true});

                if (baselayerList.length) {
                    _.each(baselayerList, function (baselayer) {
                        highestIndex.push(this.indexOf(baselayer));
                    }, this);
                    this.add(model, {at: _.max(highestIndex) + 1});
                }
                else {
                    this.add(model, {at: 0});
                }
            }
        },
        /**
         * Triggert das Event "addLayerToIndex". Übergibt das "layer"-Attribut und den Index vom Model (ol.layer).
         * @param {Backbone.Model} model - Layer-Model
         */
         addLayerToMap: function (model) {
            EventBus.trigger("addLayerToIndex", [model.get("layer"), this.indexOf(model)]);
            $(".layer-selection-save").popover("destroy");
        },
        /**
         * Triggert das Event "removeLayer". Übergibt das "layer"-Attribut vom Model (ol.layer).
         * @param {Backbone.Model} model - Layer-Model
         */
        removeLayerFromMap: function (model) {
           EventBus.trigger("removeLayer", model.get("layer"));
           $(".layer-selection-save").popover("destroy");
       },
        /**
         * Schiebt das Model in der Collection eine Position nach oben.
         * @param {Backbone.Model} model - Layer-Model
         */
         moveModelUp: function (model) {
            var fromIndex = this.indexOf(model),
                toIndex = fromIndex + 1;

            if (fromIndex < this.length - 1) {
                this.remove(model);
                this.add(model, {at: toIndex});
            }
        },
        /**
         * Schiebt das Model in der Collection eine Position nach unten.
         * @param {Backbone.Model} model - Layer-Model
         */
         moveModelDown: function (model) {
            var fromIndex = this.indexOf(model),
                toIndex = fromIndex - 1;

            if (fromIndex > 0) {
                this.remove(model);
                this.add(model, {at: toIndex});
            }
        },
        /**
         * Verschiebt das Model innerhalb der Collection nach oben oder unten.
         * @param {Backbone.Model} model - Layer-Model
         * @param {Number} index - Wert um den das Model verschoben werden soll
         */
        moveModelDelta: function (model, index) {
            var fromIndex = this.indexOf(model),
                toIndex = fromIndex + index;

                this.remove(model);
                this.add(model, {at: toIndex});
        },
        /**
         * Triggert das Event "layerForPrint". Übergibt alle Models die ausgewählt und sichtbar sind.
         */
        sendVisibleWMSLayer: function () {
            EventBus.trigger("layerlist:sendVisibleWMSlayerList", this.where({typ: "WMS", selected: true, visibility: true}));
        }
    });

    return list;
});

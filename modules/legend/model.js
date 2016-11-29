define([
    "backbone",
    "backbone.radio",
    "modules/layer/wfsStyle/list",
    "backbone.radio",
    "bootstrap/modal"
], function (Backbone, Radio, StyleList, Radio) {

    var Legend = Backbone.Model.extend({

        defaults: {
            getLegendURLParams: "?VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=",
            legendParams: [],
            wmsLayerList: [],
            paramsStyleWMS: []
        },

        initialize: function () {
            var channel = Radio.channel("Legend");

            channel.reply({
               "getLegendParams": this.getLegendParams
            }, this);

            this.listenTo(Radio.channel("ModelList"), {
                "updatedSelectedLayerList": this.setLayerList
            });
            this.listenTo(Radio.channel("StyleWMS"), {
                "updateParamsStyleWMS": this.updateParamsStyleWMS
            });

            this.listenTo(this, {
                "change:wmsLayerList": this.setLegendParamsFromWMS,
                "change:wfsLayerList": this.setLegendParamsFromWFS,
                "change:groupLayerList": this.setLegendParamsFromGROUP,
                "change:paramsStyleWMS": this.updateLegendFromStyleWMS
            });
            this.setLayerList();
        },

        updateParamsStyleWMS: function (params) {
            this.set("paramsStyleWMS", params);
        },

        updateLegendFromStyleWMS: function () {
            var params = this.get("paramsStyleWMS"),
                legendParams = this.get("legendParams"),
                legendParams2 = [];

            _.each(legendParams, function (legendParam) {
                if (legendParam.layername === "Erreichbare Arbeitsplaetze in 30min") {
                    var layername = legendParam.layername,
                        isVisibleInMap = legendParam.isVisibleInMap;

                    legendParams2.push({params: params,
                                       layername: layername,
                                       typ: "styleWMS",
                                       isVisibleInMap: isVisibleInMap});
                }
                else {
                    legendParams2.push(legendParam);
                }
            });
            this.set("legendParams", legendParams2);
        },

        getLegendParams: function () {
            return this.get("legendParams");
        },
        createLegend: function () {
            this.set("legendParams", []);
            this.set("legendParams", _.sortBy(this.get("tempArray"), function (obj) {
                return obj.layername;
            }));
        },

        setLayerList: function () {
            var filteredLayerList,
                groupedLayers,
                modelList = Radio.request("ModelList", "getCollection"),
                layerlist;

//            layerlist = modelList.where({type: "layer", isVisibleInMap: true});
            layerlist = modelList.where({type: "layer"});
            this.unsetLegendParams();
            // Die Layer die nicht in der Legende dargestellt werden sollen
            filteredLayerList = _.filter(layerlist, function (layer) {
                return layer.get("legendURL") !== "ignore";
            });

            // Liste wird nach Typen(WMS, WFS,...) gruppiert
            groupedLayers = _.groupBy(filteredLayerList, function (layer) {
                return layer.get("typ");
            });
            // this.set("tempArray", []);
            if (_.has(groupedLayers, "WMS")) {
                this.set("wmsLayerList", groupedLayers.WMS);
            }
            if (_.has(groupedLayers, "WFS")) {
                this.set("wfsLayerList", groupedLayers.WFS);
            }
            if (_.has(groupedLayers, "GROUP")) {
                this.set("groupLayerList", groupedLayers.GROUP);
            }
            this.createLegend();
        },

        unsetLegendParams: function () {
            this.set("wfsLayerList", "");
            this.set("wmsLayerList", "");
            this.set("groupLayerList", "");
            this.set("tempArray", []);
        },

        setLegendParamsFromWMS: function () {
            var paramsStyleWMS = this.get("paramsStyleWMS");

            _.each(this.get("wmsLayerList"), function (layer) {

                if (paramsStyleWMS.length > 0 && layer.get("name") === "Erreichbare Arbeitsplaetze in 30min") {
                    this.push("tempArray", {
                        layername: layer.get("name"),
                        typ: "styleWMS",
                        params: paramsStyleWMS,
                        isVisibleInMap: layer.get("isVisibleInMap")
                    });
                }
                else {
                    var legendURL = layer.get("legendURL");

                    this.push("tempArray", {
                        layername: layer.get("name"),
                        img: legendURL,
                        typ: "WMS",
                        isVisibleInMap: layer.get("isVisibleInMap")
                    });
                }
            }, this);
        },

        setLegendParamsFromWFS: function () {
            _.each(this.get("wfsLayerList"), function (layer) {
                if (typeof layer.get("legendURL") === "string") {
                    this.push("tempArray", {
                        layername: layer.get("name"),
                        img: layer.get("legendURL"),
                        typ: "WFS",
                        isVisibleInMap: layer.get("isVisibleInMap")
                    });
                }
                else {
                    var image = [],
                        name = [],
                        styleList;

                    styleList = StyleList.returnAllModelsById(layer.getStyleId());
                    if (styleList.length > 1) {
                        _.each(styleList, function (style) {
                            image.push(style.getSimpleStyle()[0].getImage().getSrc());
                                if (style.has("legendValue")) {
                                    name.push(style.get("legendValue"));
                                }
                                else {
                                    name.push(style.get("styleFieldValue"));
                                }
                            });
                        }
                        else {
                            if (styleList[0].getSimpleStyle()[0].getImage() != null) {
                                image.push(styleList[0].getSimpleStyle()[0].getImage().getSrc());
                            }
                            name.push(layer.get("name"));
                        }
                        this.push("tempArray", {
                            layername: layer.get("name"),
                            legendname: name,
                            img: image,
                            typ: "WFS",
                            isVisibleInMap: layer.get("isVisibleInMap")
                        });
                }
            }, this);
        },

        // HVV-Quatsch funktioniert noch nicht richtig
        setLegendParamsFromGROUP: function () {
            _.each(this.get("groupLayerList"), function (layer) {
                this.push("tempArray", {
                    layername: layer.get("name"),
                    img: layer.get("legendURL"),
                    typ: "WMS",
                    isVisibleInMap: layer.get("isVisibleInMap")
                });
            }, this);
        },

        /**
         * @desc Hilfsmethode um ein Attribut vom Typ Array zu setzen.
         * @param {String} attribute - Das Attribut das gesetzt werden soll.
         * @param {whatever} value - Der Wert des Attributs.
         */
        push: function (attribute, value) {
            var tempArray = _.clone(this.get(attribute));

            tempArray.push(value);
            this.set(attribute, _.flatten(tempArray));
        }
    });

    return Legend;
});

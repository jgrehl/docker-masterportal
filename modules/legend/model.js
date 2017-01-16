define([

    "bootstrap/modal"
], function () {

    var Legend = Backbone.Model.extend({

        defaults: {
            getLegendURLParams: "?VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=",
            legendParams: [],
            wmsLayerList: [],
            paramsStyleWMS: [],
            paramsStyleWMSArray: []
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
                "updateParamsStyleWMS": this.updateParamsStyleWMSArray
            });

            this.listenTo(this, {
                "change:wmsLayerList": this.setLegendParamsFromWMS,
                "change:wfsLayerList": this.setLegendParamsFromWFS,
                "change:groupLayerList": this.setLegendParamsFromGROUP,
                "change:paramsStyleWMSArray": this.updateLegendFromStyleWMSArray
            });

            this.setLayerList();
        },

        updateParamsStyleWMSArray: function (params) {
            var paramsStyleWMSArray = this.get("paramsStyleWMSArray"),
            paramsStyleWMSArray2 = [];
            _.each (paramsStyleWMSArray, function (paramsStyleWMS){
                if(params.styleWMSName !== paramsStyleWMS.styleWMSName){
                    paramsStyleWMSArray2.push(paramsStyleWMS);
                }
            });
            paramsStyleWMSArray2.push(params);
            this.set("paramsStyleWMS", params);
            this.set("paramsStyleWMSArray", paramsStyleWMSArray2);

        },

        updateLegendFromStyleWMSArray: function () {
            var paramsStyleWMSArray = this.get("paramsStyleWMSArray"),
                legendParams = this.get("legendParams")

            _.each(this.get("legendParams"), function (legendParam, i) {
                    _.find (paramsStyleWMSArray, function (paramsStyleWMS) {
                        if (legendParam.layername === paramsStyleWMS.styleWMSName) {
                            var layername = legendParam.layername,
                                isVisibleInMap = legendParam.isVisibleInMap;

                            legendParams.splice(i, 1, {params: paramsStyleWMS,
                                               layername: layername,
                                               typ: "styleWMS",
                                               isVisibleInMap: isVisibleInMap});

                        }
                    });
            });
            this.set("legendParams", legendParams);
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
                modelList = Radio.request("ModelList", "getCollection");

//            layerlist = modelList.where({type: "layer", isVisibleInMap: true});
            this.unsetLegendParams();
            // Die Layer die in der Legende dargestellt werden sollen
            filteredLayerList = _.filter(modelList.models, function (layer) {
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
            var paramsStyleWMSArray = this.get("paramsStyleWMSArray"),
            paramsStyleWMS = "";

            _.each(this.get("wmsLayerList"), function (layer) {
                paramsStyleWMS = _.find(paramsStyleWMSArray, function(paramsStyleWMS){
                    if (layer.get("name") === paramsStyleWMS.styleWMSName) {
                        return true;
                    }
                });
                if (paramsStyleWMS) {

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

                    styleList = Radio.request("StyleList", "returnAllModelsById", layer.getStyleId());
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

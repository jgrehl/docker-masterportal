define(function (require) {

    var Backbone = require("backbone"),

        ol = require("openlayers"),
        Config = require("config"),
        Requestor;

    Requestor = Backbone.Model.extend({
        requestCount: 0,
        pContent: [],

        /**
         * params: [0] = Objekt mit name und url; [1] = Koordinate
         */
        requestFeatures: function (params) {

            this.groupContentByTyp(params[0]);
            this.setGFIPosition(params[1]);
            this.pContent = [];

            if (this.has("gfiWMSContent")) {
                _.each(this.getGFIWMSContent(), function (visibleLayer) {
                    if (visibleLayer.infoFormat === "text/html") {
                        this.openHTMLContent(visibleLayer);
                    }
                    else {
                        this.setWMSPopupContent(visibleLayer);
                    }
                }, this);
            }
            else {
                this.getGFIFeatureContent();
                this.buildTemplate(this.getGFIPosition());
            }

            Radio.trigger("Util", "hideLoader");
        },

        groupContentByTyp: function (content) {
            var groupByTyp = _.groupBy(content, function (obj) {
                // WMS || WFS || GeoJSON
                return obj.typ;
            });

            _.each(groupByTyp, function (value, key) {
                switch (key) {
                    case "WFS": {
                        this.setGFIWFSContent(value);
                        break;
                    }
                    case "GeoJSON": {
                        this.setGFIGeoJSONContent(value);
                        break;
                    }
                    case "WMS": {
                        this.setGFIWMSContent(value);
                        break;
                    }
                }
            }, this);
        },

        openHTMLContent: function (visibleLayer) {
            // Für das Bohrdatenportal werden die GFI-Anfragen in einem neuen Fenster geöffnet, gefiltert nach der ID aus dem DM.
            if (visibleLayer.ol_layer.get("featureCount")) {
                var featurecount = "&FEATURE_COUNT=";

                featurecount = featurecount.concat(visibleLayer.ol_layer.get("featureCount").toString());
                visibleLayer.url = visibleLayer.url.concat(featurecount);
            }
            if (visibleLayer.ol_layer.id === "2407" || visibleLayer.ol_layer.id === "4423") {

                window.open(visibleLayer.url, "weitere Informationen", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=500,width=800,height=700");
                this.getGFIFeatureContent();
                this.buildTemplate(this.getGFIPosition());
                this.unset("gfiWMSContent");
                this.pContent = [];
            }
            else {
                var gfiFeatures = {"html": visibleLayer.url};

                $.ajax({
                    url: Radio.request("Util", "getProxyURL", visibleLayer.url),
                    async: false,
                    type: "GET",
                    context: this,
                    success: function (data) {
                        if ($(data).find("tbody").children().length > 1 === true) {
                            this.pushGFIContent([gfiFeatures], visibleLayer);
                        }
                    },
                    complete: function () {
                        this.getGFIFeatureContent();
                        this.buildTemplate(this.getGFIPosition());
                        this.unset("gfiWMSContent");
                        this.pContent = [];
                    }
                });
            }
        },

        getGFIFeatureContent: function () {
            var gfiContent;

            if (this.has("gfiWFSContent")) {
                _.each(this.getGFIWFSContent(), function (visibleLayer) {
                    gfiContent = this.translateGFI([visibleLayer.feature.getProperties()], visibleLayer.attributes);
                    this.pushGFIContent(gfiContent, visibleLayer);
                }, this);
                this.unset("gfiWFSContent");
            }
            if (this.has("gfiGeoJSONContent")) {
                _.each(this.getGFIGeoJSONContent(), function (visibleLayer) {
                    gfiContent = this.setGeoJSONPopupContent(visibleLayer.feature);
                    this.pushGFIContent(gfiContent, visibleLayer);
                }, this);
                this.unset("gfiGeoJSONContent");
            }
        },

        pushGFIContent: function (gfiContent, visibleLayer) {
            this.pContent.push({
                content: gfiContent,
                name: visibleLayer.name,
                ol_layer: visibleLayer.ol_layer
            });
        },

        setGeoJSONPopupContent: function (feature) {
            var featureList = [];

            if (_.has(feature.getProperties(), "gfiAttributes")) {
                featureList.push(feature.getProperties().gfiAttributes);
            }
            else {
                _.each(feature.getProperties().features, function (feature) {
                    featureList.push(feature.get("gfiAttributes"));
                });
            }
            return featureList;
        },

        setWMSPopupContent: function (params) {
            var url,
                data = "FEATURE_COUNT=" + params.ol_layer.get("featureCount").toString(),
                pgfi = [];

            if (params.url.search(location.host) === -1) {
                url = Radio.request("Util", "getProxyURL", params.url);
            }
            else {
                url = params.url;
            }
            ++this.requestCount;
            $.ajax({
                url: url,
                data: data,
                async: true,
                type: "GET",
                context: this, // das model
                success: function (data) {
                    var gfiList = [],
                        gfiFormat ,
                        gfiFeatures;

                    // handle non text/xml responses arriving as string
                    if (_.isString(data)) {
                        data = $.parseXML(data);
                    }

                    // parse result, try built-in ol-format first
                    gfiFormat = new ol.format.WMSGetFeatureInfo();
                    // das reverse wird fürs Planportal gebraucht SD 18.01.2016
                    gfiFeatures = gfiFormat.readFeatures(data, {
                        dataProjection: Config.view.proj
                    }).reverse();

                    // ESRI is not parsed by the ol-format
                    if (_.isEmpty(gfiFeatures)) {
                        if (data.getElementsByTagName("FIELDS")[0] !== undefined) {
                            _.each(data.getElementsByTagName("FIELDS"), function (element) {
                                var gfi = {};

                                _.each(element.attributes, function (attribute) {
                                    var key = attribute.localName;

                                    if (this.isValidValue(attribute.value)) {
                                        gfi[key] = attribute.value;
                                    }
                                    else if (this.isValidValue(attribute.textContent)) {
                                        gfi[key] = attribute.textContent;
                                    }
                                    else {
                                        gfi[key] = "";
                                    }
                                }, this);

                                gfiList.push(gfi);
                            }, this);
                        }
                    }
                    else { // OS (deegree, UMN, Geoserver) is parsed by ol-format
                        _.each(gfiFeatures, function (feature) {
                            gfiList.push(feature.getProperties());
                        });
                    }

                    if (gfiList) {
                        pgfi = this.translateGFI(gfiList, params.ol_layer.get("gfiAttributes"), params.ol_layer.get("gfiTheme"), "WMS");
                    }
                    this.pushGFIContent(pgfi, params);
                },
                error: function (jqXHR, textStatus) {
                    alert("Ajax-Request " + textStatus);
                },
                complete: function () {
                     --this.requestCount;

                    if (this.requestCount === 0) {
                        this.getGFIFeatureContent();
                        this.buildTemplate(this.getGFIPosition());
                        this.unset("gfiWMSContent");
                    }
                }
            });
        },

        buildTemplate: function () {
            Radio.trigger("Requestor", "renderResults", [this.pContent, this.getGFIPosition()]);
        },

        setGFIWMSContent: function (value) {
            this.set("gfiWMSContent", value);
        },

        setGFIWFSContent: function (value) {
            this.set("gfiWFSContent", value);
        },

        setGFIGeoJSONContent: function (value) {
            this.set("gfiGeoJSONContent", value);
        },

        setGFIPosition: function (value) {
            this.set("gfiPosition", value);
        },

        getGFIWMSContent: function () {
            return this.get("gfiWMSContent");
        },

        getGFIWFSContent: function () {
            return this.get("gfiWFSContent");
        },

        getGFIGeoJSONContent: function () {
            return this.get("gfiGeoJSONContent");
        },

        getGFIPosition: function () {
            return this.get("gfiPosition");
        },

        isValidKey: function (key) {
            var ignoredKeys = Config.ignoredKeys;

            if (_.indexOf(ignoredKeys, key.toUpperCase()) !== -1) {
                return false;
            }
            return true;
        },
        /** helper function: check, if str has a valid value */
        isValidValue: function (str) {
            if (str && _.isString(str) && str !== "" && str.toUpperCase() !== "NULL") {
                return true;
            }
            return false;
        },

        /** helper function: first letter upperCase, _ becomes " " */
        beautifyString: function (str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1).replace("_", " ");
        },
        translateGFI: function (gfiList, gfiAttributes, theme, typ) {
            var pgfi = [];

            _.each(gfiList, function (element) {
                var preGfi = {},
                    gfi = {};

                // get rid of invalid keys and keys with invalid values; trim values
                _.each(element, function (value, key) {
                    if (theme === "table") {
                        if (this.isValidKey(key)) {
                            preGfi[key] = value;
                        }
                    }
                    else {
                        if (this.isValidKey(key) && this.isValidValue(value)) {
                            preGfi[key] = value.trim();
                        }
                    }
                }, this);
                if (gfiAttributes === "showAll") {
                    // beautify keys
                    _.each(preGfi, function (value, key) {
                        var key;

                        key = this.beautifyString(key);
                        gfi[key] = value;
                    }, this);
                    // im IE müssen die Attribute für WMS umgedreht werden
                 if (Radio.request("Util", "isInternetExplorer") !== false && typ === "WMS") {
                        var keys = [],
                            values = [];

                        _.each (gfi, function (value, key) {
                            keys.push(key);
                            values.push(value);
                        }, this);
                        keys.reverse();
                        values.reverse();
                        gfi = _.object(keys, values);
                     }
                }
                else {
                    // map object keys to gfiAttributes from layer model

//                    _.each(preGfi, function (value, key) {
//                        key = gfiAttributes[key];
//                        if (key) {
//                            gfi[key] = value;
//                        }
//                    });
                    _.each(gfiAttributes, function (value, key) {
                        key = preGfi[key];
                        if (key) {
                            gfi[value] = key;
                        }
                    });
                }
                if (_.isEmpty(gfi) !== true) {
                    pgfi.push(gfi);
                }
            }, this);
            return pgfi;
    }
    });

    return new Requestor();
});

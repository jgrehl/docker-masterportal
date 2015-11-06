define([
    "backbone",
    "eventbus",
    "modules/searchbar/model"
    ], function (Backbone, EventBus) {
    "use strict";
    return Backbone.Model.extend({
        /**
        *
        */
        defaults: {
            inUse: false,
            minChars: 3,
            bPlans: [],
            olympia: [],
            bplanURL: "" // bplan-URL für evtl. requests des mapHandlers
        },
        /**
         * @description Initialisierung der wfsFeature Suche.
         * @param {Objekt} config - Das Konfigurationsarray für die specialWFS-Suche
         * @param {integer} [config.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
         * @param {Object[]} config.definitions - Definitionen der SpecialWFS.
         * @param {Object} config.definitions[].definition - Definition eines SpecialWFS.
         * @param {string} config.definitions[].definition.url - Die URL, des WFS
         * @param {string} config.definitions[].definition.data - Query string des WFS-Request
         * @param {string} config.definitions[].definition.name - Name der speziellen Filterfunktion (bplan|olympia|paralympia)
         * @param {string} [initialQuery] - Initialer Suchstring.
         */
        initialize: function (config, initialQuery) {
            if (config.minChars) {
                this.set("minChars", config.minChars);
            }
            _.each(config.definitions, function (element) {
                if (element.name === "olympia") {
                    this.sendRequest(element.url, element.data, this.getFeaturesForOlympia, false);
                }
                else if (element.name === "paralympia") {
                    this.sendRequest(element.url, element.data, this.getFeaturesForParalympia, false);
                }
                else if (element.name === "bplan") {
                    this.set("bplanURL", element.url);
                    this.sendRequest(element.url, element.data, this.getFeaturesForBPlan, false);
                }
            }, this);
            EventBus.on("searchbar:search", this.search, this);
            EventBus.on("specialWFS:requestbplan", this.requestbplan, this);
            if (initialQuery && _.isString(initialQuery) === true) {
                this.search(initialQuery);
            }
        },
        /**
         * @description Suchfunktion, wird von Searchbar getriggert
         * @param {string} searchString - Der Suchstring.
        */
        search: function (searchString) {
            if (this.get("inUse") === false) {
                this.set("inUse", true);
                var searchStringRegExp = new RegExp(searchString.replace(/ /g, ""), "i"); // Erst join dann als regulärer Ausdruck

                if (this.get("olympia").length > 0 && searchString.length >= this.get("minChars")) {
                    this.searchInOlympiaFeatures(searchStringRegExp);
                }
                if (this.get("bPlans").length > 0 && searchString.length >= this.get("minChars")) {
                    this.searchInBPlans(searchStringRegExp);
                }
                EventBus.trigger("createRecommendedList");
                this.set("inUse", false);
            }
        },
        /**
         * @description Methode, um Koordinaten eines B-Plan abzufragen. Wird vom mapHandler getriggert.
         * @param {string} type - Der ausgewählte BPlan-Typ, der abgefragt werden soll.
        */
        requestbplan: function (type, name) {
            var typeName = (type === "festgestellt") ? "hh_hh_planung_festgestellt" : "imverfahren",
                propertyName = (type === "festgestellt") ? "planrecht" : "plan",
                data = "<?xml version='1.0' encoding='UTF-8'?><wfs:GetFeature SERVICE='WFS' version='1.1.0' xmlns:app='http://www.deegree.org/app' xmlns:wfs='http://www.opengis.net/wfs' xmlns:gml='http://www.opengis.net/gml' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd'><wfs:Query typeName='" + typeName + "'><ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>app:" + propertyName + "</ogc:PropertyName><ogc:Literal>" + name + "</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter></wfs:Query></wfs:GetFeature>";

            this.sendRequest(this.get("bplanURL"), data, this.getExtentFromBPlan, true, true);
        },
        /**
        * @description Methode zum Zurückschicken des gefundenen Plans an mapHandler.
        * @param {string} data - Die Data-XML.
        */
        getExtentFromBPlan: function (data) {
            EventBus.trigger("mapHandler:zoomToBPlan", data);
        },
        /**
        *
        */
        searchInBPlans: function (searchStringRegExp) {
            _.each(this.get("bPlans"), function (bPlan) {
                // Prüft ob der Suchstring ein Teilstring vom B-Plan ist
                if (bPlan.name.search(searchStringRegExp) !== -1) {
                    EventBus.trigger("searchbar:pushHits", "hitList", bPlan);
                }
            }, this);
        },
        /**
        *
        */
        searchInOlympiaFeatures: function (searchStringRegExp) {
            _.each(this.get("olympia"), function (feature) {
                _.each(feature.name.split(","), function (ele) {
                    var eleName = ele.replace(/ /g, "");
                    // Prüft ob der Suchstring ein Teilstring vom Feature ist
                    if (eleName.search(searchStringRegExp) !== -1) {
                        EventBus.trigger("searchbar:pushHits", "hitList", {
                            name: ele,
                            type: feature.type,
                            coordinate: feature.coordinate,
                            glyphicon: "glyphicon-fire",
                            id: feature.id
                        });
                    }
                }, this);
            }, this);
        },
        /**
         * success-Funktion für die Olympiastandorte. Schreibt Ergebnisse in "bplan".
         * @param  {xml} data - getFeature-Request
         */
        getFeaturesForBPlan: function (data) {
            var hits = $("wfs\\:member,member", data),
                name,
                type;

            _.each(hits, function (hit) {
                if ($(hit).find("app\\:planrecht, planrecht")[0] !== undefined) {
                    name = $(hit).find("app\\:planrecht, planrecht")[0].textContent;
                    type = "festgestellt";
                }
                else {
                    name = $(hit).find("app\\:plan, plan")[0].textContent;
                    type = "im Verfahren";
                }
                // BPlan-Objekte
                this.get("bPlans").push({
                    name: name.trim(),
                    type: type,
                    glyphicon: "glyphicon-picture",
                    id: name.replace(/ /g, "") + "BPlan"
                });
            }, this);
        },
        /**
         * success-Funktion für die Olympiastandorte. Schreibt Ergebnisse in "olypia".
         * @param  {xml} data - getFeature-Request
         */
        getFeaturesForOlympia: function (data) {
            var hits = $("wfs\\:member,member", data),
                coordinate,
                position,
                hitType,
                hitName;

            _.each(hits, function (hit) {
               if ($(hit).find("gml\\:pos,pos")[0] !== undefined) {
                    position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                    coordinate = [parseFloat(position[0]), parseFloat(position[1])];
                    if ($(hit).find("app\\:piktogramm, piktogramm")[0] !== undefined && $(hit).find("app\\:art,art")[0].textContent !== "Umring") {
                        hitName = $(hit).find("app\\:piktogramm, piktogramm")[0].textContent;
                        hitType = $(hit).find("app\\:staette, staette")[0].textContent;
                        // Olympia-Objekte
                        this.get("olympia").push({
                            name: hitName,
                            type: "Olympiastandort",
                            coordinate: coordinate,
                            glyphicon: "glyphicon-fire",
                            id: hitName.replace(/ /g, "") + "Olympia"
                        });
                    }
               }
            }, this);
        },
        /**
         * success-Funktion für die Paralympiastandorte. Schreibt Ergebnisse in "olypia".
         * @param  {xml} data - getFeature-Request
         */
        getFeaturesForParalympia: function (data) {
            var hits = $("wfs\\:member,member", data),
                coordinate,
                position,
                hitType,
                hitName;

            _.each(hits, function (hit) {
               if ($(hit).find("gml\\:pos,pos")[0] !== undefined) {
                    position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                    coordinate = [parseFloat(position[0]), parseFloat(position[1])];
                    if ($(hit).find("app\\:piktogramm, piktogramm")[0] !== undefined && $(hit).find("app\\:art,art")[0].textContent !== "Umring") {
                        hitName = $(hit).find("app\\:piktogramm, piktogramm")[0].textContent;
                        hitType = $(hit).find("app\\:staette, staette")[0].textContent;
                        // Olympia-Objekte
                        this.get("olympia").push({
                            name: hitName,
                            type: "Paralympiastandort",
                            coordinate: coordinate,
                            glyphicon: "glyphicon-fire",
                            id: hitName.replace(/ /g, "") + "Paralympia"
                        });
                    }
               }
            }, this);
        },
        /**
         * @description Führt einen HTTP-GET-Request aus.
         *
         * @param {String} url - A string containing the URL to which the request is sent
         * @param {String} data - Data to be sent to the server
         * @param {function} successFunction - A function to be called if the request succeeds
         * @param {boolean} asyncBool - asynchroner oder synchroner Request
         * @param {boolean} [usePOST] - POST anstelle von GET?
         */
        sendRequest: function (url, data, successFunction, asyncBool, usePOST) {
            var type = (usePOST && usePOST === true) ? "POST" : "GET";

            $.ajax({
                url: url,
                data: data,
                context: this,
                async: asyncBool,
                type: type,
                success: successFunction,
                timeout: 6000,
                contentType: "text/xml",
                error: function () {
                    EventBus.trigger("alert", url + " nicht erreichbar.");
                }
            });
        }
    });
});

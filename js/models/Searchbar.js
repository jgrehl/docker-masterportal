define([
    "jquery",
    "underscore",
    "backbone",
    "openlayers",
    "eventbus",
    "config"
    ], function ($, _, Backbone, ol, EventBus, Config) {

        /**
        * Dieses Model ist ein Attribut der Searchbar.
        * Es verwaltet die Zustände (Suche läuft = false, Suche fertig = true) der einzelnen Suchen (Adresse, Straßen...).
        */
        var SearchReady = Backbone.Model.extend({

            /**
            * Initial werden die Zustände für die Adresssuche und die Straßensuche auf false gesetzt.
            * Zusätzlich wird die Methode "checkAttributes" auf das Event "change" für alle Attribute registriert.
            */
            "initialize": function () {
                this.set("streetSearch", false);
                this.set("numberSearch", false);
                this.on("change", this.checkAttributes);
            },

            /**
            * Prüft ob alle Attribute auf "true" stehen (Alle Suchen sind fertig).
            * Wenn das der Fall ist, wird das Event "createRecommendedList" über den EventBus getriggert.
            */
            "checkAttributes": function () {
                var allAttr = _.every(this.attributes, function(attr) { // http://underscorejs.org/#every
                    return attr === true;
                });
                if (allAttr === true) {
                    EventBus.trigger("createRecommendedList");  // Searchbar.initalize()
                }
            }
        });

        /**
        *
        */
        var Searchbar = Backbone.Model.extend({

            /**
            *
            */
            "defaults": {
                placeholder: Config.searchBar.placeholder,
                searchString: "",   // der aktuelle String in der Suchmaske
                hitList: [],
                isOnlyOneStreet: false, // Wenn true --> Hausnummernsuche startet
                onlyOneStreetName: "",  // speichert den Namen der Straße, wenn die Straßensuche nur noch eine Treffer zurückgibt.
                gazetteerURL: Config.gazetteerURL
            },

            /**
            *
            */
            "initialize": function () {
                this.on("change:searchString", this.checkStringAndSearch);
                EventBus.on("sendVisibleWFSLayer", this.getFeaturesForSearch, this);
                EventBus.on("createRecommendedList", this.createRecommendedList, this);
                this.set("isSearchReady", new SearchReady());

                // Prüfen ob BPlan-Suche konfiguriert ist. Wenn ja --> B-Pläne laden(bzw. die Namen der B-Pläne) und notwendige Attrbiute setzen
                if (Config.bPlanURL !== undefined) {
                    this.set("bPlanURL", Config.bPlanURL);
                    this.set("bPlans", []);
                    this.get("isSearchReady").set("bPlanSearch", false);
                    this.getBPlans();
                }

                // Marker zur Visualisierung eines Punktes
                this.set("marker", new ol.Overlay({
                    positioning: "bottom-center",
                    element: $("#searchMarker"),    // Element aus der index.html
                    stopEvent: false
                }));
                EventBus.trigger("addOverlay", this.get("marker"));
            },

            /**
            *
            */
            "setSearchString": function (value) {
                this.set("searchString", value);
                // NOTE hier muss ich nochmal bei. Stichwort "Backspacetaste gedrückt lassen"
                if (value === "" || value.length < 3) {
                    this.set("isOnlyOneStreet", false);
                }
            },

            /**
            *
            */
            "pushHits": function (attr, val) {
                var tempArray = _.clone(this.get(attr));
                tempArray.push(val);
                this.set(attr, _.flatten(tempArray));
            },

            /**
            *
            */
            "checkStringAndSearch": function () {
                this.set("hitList", []);
                if (this.get("searchString").length >= 3) {
                    this.searchStreets();
                }
            },

            /**
            *
            */
            "searchStreets": function () {
                this.get("isSearchReady").set("streetSearch", false);
                var requestStreetName, streetNames = [];
                // Prüft ob der Suchstring ein Teilstring vom Straßennamen ist. Und ob zurzeit nur eine Straße vorhanden ist.
                if (this.get("isOnlyOneStreet") === true && this.get("onlyOneStreetName").search(this.get("searchString")) === -1) {
                    // Damit die Straßensuche auch funktioniert wenn nach Hausnummern gesucht wird.
                    requestStreetName = this.get("onlyOneStreetName");
                }
                else {
                    requestStreetName = this.get("searchString");
                }
                $.ajax({
                    url: this.get("gazetteerURL") + "&StoredQuery_ID=findeStrasse&strassenname=" + encodeURIComponent(requestStreetName),
                    context: this,  // das model
                    async: true,
                    type: "GET",
                    success: function (data) {
                        try {
                            // Firefox, IE
                            if (data.getElementsByTagName("wfs:member").length > 0) {
                                var hits = data.getElementsByTagName("wfs:member");
                                _.each(hits, function (element, index) {
                                    var coord = data.getElementsByTagName("gml:posList")[index].textContent;
                                    var streetName = data.getElementsByTagName("dog:strassenname")[index].textContent;
                                    streetNames.push({"name": streetName, "type": "Straße", "coordinate": coord, "glyphicon": "glyphicon-road", "id": streetName.replace(/ /g, "") + "Straße"});
                                }, this);
                                this.pushHits("hitList", streetNames);
                            }
                            // WebKit
                            else if (data.getElementsByTagName("member") !== undefined) {
                                var hits = data.getElementsByTagName("member");
                                _.each(hits, function (element, index) {
                                    var coord = data.getElementsByTagName("posList")[index].textContent;
                                    var streetName = data.getElementsByTagName("strassenname")[index].textContent;
                                    streetNames.push({"name": streetName, "type": "Straße", "coordinate": coord, "glyphicon": "glyphicon-road", "id": streetName.replace(/ /g, "") + "Straße"});
                                }, this);
                                this.set("hitList", streetNames);
                            }
                            // Marker - wurde mehr als eine Straße gefunden
                            if (streetNames.length === 1) {
                                this.set("isOnlyOneStreet", true);
                                this.set("onlyOneStreetName", streetNames[0].name);
                                // Prüft ob der Suchstring ein Teilstring vom Straßennamen ist. Wenn nicht, dann wird die Hausnummernsuche ausgeführt.
                                var searchStringRegExp = new RegExp(this.get("searchString"), "i");
                                if (this.get("onlyOneStreetName").search(searchStringRegExp) === -1) {
                                    this.searchHouseNumbers();
                                }
                            }
                            else {
                                this.set("isOnlyOneStreet", false);
                                // this.set("numberSearch", true);
                                this.get("isSearchReady").set("numberSearch", true);
                            }
                            // NOTE hier sollte man noch dran rumschrauben wenn noch mehr Suchen dazukommen (Reihenfolge, searchEnd-Parameter)?!
                            this.searchInBPlans();
                            this.searchInFeatures();
                        }
                        catch (error) {
                            //console.log(error);
                        }
                        this.get("isSearchReady").set("streetSearch", true);
                    }
                });
            },

            /**
            *
            */
            "searchHouseNumbers": function () {
                // this.set("numberSearch", false);
                this.get("isSearchReady").set("numberSearch", false);
                $.ajax({
                    url: this.get("gazetteerURL") + "&StoredQuery_ID=HausnummernZuStrasse&strassenname=" + encodeURIComponent(this.get("onlyOneStreetName")),
                    context: this,  // das model
                    async: true,
                    type: "GET",
                    success: function (data) {
                        var hits, number, affix, coord, houseNumbers = [];
                        try {
                            // Join den Suchstring
                            var searchStringJoin = this.get("searchString").replace(/ /g, "");
                            var searchStringRegExp = new RegExp(searchStringJoin, "i");
                            // Firefox, IE
                            if (data.getElementsByTagName("wfs:member").length > 0) {
                                hits = data.getElementsByTagName("wfs:member");
                                _.each(hits, function (element, index) {
                                    number = element.getElementsByTagName("dog:hausnummer")[0].textContent;
                                    coord = [parseFloat(data.getElementsByTagName("gml:pos")[index].textContent.split(" ")[0]), parseFloat(data.getElementsByTagName("gml:pos")[index].textContent.split(" ")[1])];
                                    if (element.getElementsByTagName("dog:hausnummernzusatz")[0] !== undefined) {
                                        affix = element.getElementsByTagName("dog:hausnummernzusatz")[0].textContent;
                                        // Join die Adresse
                                        var addressJoin = this.get("onlyOneStreetName").replace(/ /g, "") + number +affix;
                                        // Prüft ob der Suchstring ein Teilstring der Adresse ist
                                        if (addressJoin.search(searchStringRegExp) !== -1) {
                                            houseNumbers.push({"name": this.get("onlyOneStreetName") + " " + number + affix, "type": "Adresse", "coordinate": coord, "glyphicon": "glyphicon-map-marker", "id": addressJoin + "Adresse"});
                                        }
                                    }
                                    else {
                                        // Join die Adresse
                                        var addressJoin = this.get("onlyOneStreetName").replace(/ /g, "") + number;
                                        // Prüft ob der Suchstring ein Teilstring der Adresse ist
                                        if (addressJoin.search(searchStringRegExp) !== -1) {
                                            houseNumbers.push({"name": this.get("onlyOneStreetName") + " " + number, "type": "Adresse", "coordinate": coord, "glyphicon": "glyphicon-map-marker", "id": addressJoin + "Adresse"});
                                        }
                                    }
                                }, this);
                            }
                            // WebKit
                            else if (data.getElementsByTagName("member") !== undefined) {
                                hits = data.getElementsByTagName("member");
                                _.each(hits, function (element, index) {
                                    number = element.getElementsByTagName("hausnummer")[0].textContent;
                                    coord = [parseFloat(data.getElementsByTagName("pos")[index].textContent.split(" ")[0]), parseFloat(data.getElementsByTagName("pos")[index].textContent.split(" ")[1])];
                                    if (element.getElementsByTagName("hausnummernzusatz")[0] !== undefined) {
                                        affix = element.getElementsByTagName("hausnummernzusatz")[0].textContent;
                                        // Join die Adresse
                                        var addressJoin = this.get("onlyOneStreetName").replace(/ /g, "") + number +affix;
                                        // Prüft ob der Suchstring ein Teilstring der Adresse ist
                                        if (addressJoin.search(searchStringRegExp) !== -1) {
                                            houseNumbers.push({"name": this.get("onlyOneStreetName") + " " + number + affix, "type": "Adresse", "coordinate": coord, "glyphicon": "glyphicon-map-marker", "id": addressJoin + "Adresse"});
                                        }
                                    }
                                    else {
                                        // Join die Adresse
                                        var addressJoin = this.get("onlyOneStreetName").replace(/ /g, "") + number;
                                        // Prüft ob der Suchstring ein Teilstring der Adresse ist
                                        if (addressJoin.search(searchStringRegExp) !== -1) {
                                            houseNumbers.push({"name": this.get("onlyOneStreetName") + " " + number, "type": "Adresse", "coordinate": coord, "glyphicon": "glyphicon-map-marker", "id": addressJoin + "Adresse"});
                                        }
                                    }
                                }, this);
                            }
                            this.pushHits("hitList", houseNumbers); // Fügt die Treffer zur hitList hinzu
                        }
                        catch (error) {
                            //console.log(error);
                        }
                        // this.set("numberSearch", true);
                        this.get("isSearchReady").set("numberSearch", true);
                    }
                });
            },

            /**
            *
            */
            "searchInBPlans": function () {
                this.get("isSearchReady").set("bPlanSearch", false);
                var locatedPlans = [];
                // Join den Suchstring
                var searchStringJoin = this.get("searchString").replace(/ /g, "");
                var searchStringRegExp = new RegExp(searchStringJoin, "i");
                _.each(this.get("bPlans"), function (bPlan) {
                    // Prüft ob der Suchstring ein Teilstring vom B-Plan ist
                    if (bPlan.name.search(searchStringRegExp) !== -1) {
                        locatedPlans.push(bPlan);
                    }
                }, this);
                this.pushHits("hitList", locatedPlans);
                this.get("isSearchReady").set("bPlanSearch", true);
            },

            /**
            *
            */
            "searchInFeatures": function () {
                this.get("isSearchReady").set("featureSearch", false);
                var locatedFeatures = [];
                // Join den Suchstring
                var searchStringJoin = this.get("searchString").replace(/ /g, "");
                var searchStringRegExp = new RegExp(searchStringJoin, "i");
                _.each(this.get("features"), function (feature) {
                    var featureName = feature.name.replace(/ /g, "");
                    // Prüft ob der Suchstring ein Teilstring vom Feature ist
                    if (featureName.search(searchStringRegExp) !== -1) {
                        locatedFeatures.push(feature);
                    }
                }, this);
                this.pushHits("hitList", locatedFeatures);
                this.get("isSearchReady").set("featureSearch", true);
            },

            /**
            *
            */
            "getBPlans": function () {
                var plans = [];
                $.ajax({
                    url: Config.proxyURL,
                    context: this,  // das model
                    async: false,
                    type: "GET",
                    data: {url: this.get("bPlanURL") + "&Typenames=imverfahren&propertyname=plan"},
                    success: function (data) {
                        try {
                            // Firefox, IE
                            if (data.getElementsByTagName("wfs:member").length > 0) {
                                var hits = data.getElementsByTagName("wfs:member");
                                _.each(hits, function (hit, index) {
                                    var name = data.getElementsByTagName("app:plan")[index].textContent;
                                    plans.push({"name": name.trim(), "type": "BPlan im Verfahren", "glyphicon": "glyphicon-picture", "id": name.replace(/ /g, "") +  "BPlan"});
                                }, this);
                            }
                            // WebKit
                            else if (data.getElementsByTagName("member") !== undefined) {
                                var hits = data.getElementsByTagName("member");
                                _.each(hits, function (hit, index) {
                                    var name = data.getElementsByTagName("plan")[index].textContent;
                                    plans.push({"name": name.trim(), "type": "BPlan im Verfahren", "glyphicon": "glyphicon-picture", "id": name.replace(/ /g, "") +  "BPlan"});
                                }, this);
                            }
                        }
                        catch (error) {
                            //console.log(error);
                        }
                    }
                });
                $.ajax({
                    url: Config.proxyURL,
                    context: this,  // das model
                    async: true,
                    type: "GET",
                    data: {url: this.get("bPlanURL") + "&Typenames=hh_hh_planung_festgestellt&propertyname=planrecht"},
                    success: function (data) {
                        try {
                            // Firefox, IE
                            if (data.getElementsByTagName("wfs:member").length > 0) {
                                var hits = data.getElementsByTagName("wfs:member");
                                _.each(hits, function (hit, index) {
                                    var name = data.getElementsByTagName("app:planrecht")[index].textContent;
                                    plans.push({"name": name.trim(), "type": "BPlan festgestellt", "glyphicon": "glyphicon-picture", "id": name.replace(/ /g, "") +  "BPlan"});
                                }, this);
                            }
                            // WebKit
                            else if (data.getElementsByTagName("member") !== undefined) {
                                var hits = data.getElementsByTagName("member");
                                _.each(hits, function (hit, index) {
                                    var name = data.getElementsByTagName("planrecht")[index].textContent;
                                    plans.push({"name": name.trim(), "type": "BPlan festgestellt", "glyphicon": "glyphicon-picture", "id": name.replace(/ /g, "") +  "BPlan"});
                                }, this);
                            }
                        }
                        catch (error) {
                            //console.log(error);
                        }
                        this.pushHits("bPlans", plans);
                    }
                });
            },

            /**
            *
            */
            "getFeaturesForSearch": function (layermodels) {
                this.set("features", []);
                this.get("isSearchReady").set("featureSearch", false);
                var featureArray = [];
                _.each(layermodels, function (layer) {
                    if (_.has(layer.attributes, "searchField") === true && layer.get('searchField') != '') {
                        var imageSrc = layer.get("layer").getStyle()[0].getImage().getSrc();
                        if (imageSrc) {
                            var features = layer.get("source").getFeatures();
                            _.each(features, function (feature) {
                                featureArray.push({"name": feature.get("name"), "type": "Krankenhaus", "coordinate": feature.getGeometry().getCoordinates(), "imageSrc": imageSrc, "id":  feature.get("name").replace(/ /g, "") +  layer.get("name")});
                            });
                        }
                    }
                });
                this.pushHits("features", featureArray);
            },

            /**
            *
            */
            "createRecommendedList": function () {
                this.set("isHitListReady", false);
                if (this.get("hitList").length > 5) {
                    var numbers = [];
                    while (numbers.length < 5) {
                        var randomNumber = _.random(0, this.get("hitList").length - 1);
                        if (_.contains(numbers, randomNumber) === false) {
                            numbers.push(randomNumber);
                        }
                    }
                    var mapHitList = _.map(numbers, function (number) {
                        return this.get("hitList")[number];
                    }, this);
                    this.set("recommendedList", mapHitList);
                }
                else {
                    this.set("recommendedList", this.get("hitList"));
                }
                this.set("isHitListReady", true);
            }
        });

        return new Searchbar();
    });

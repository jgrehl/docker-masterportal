define([
    "eventbus",
    "modules/searchbar/model"
], function (EventBus) {
    "use strict";
    return Backbone.Model.extend({
        /**
        *
        */
        defaults: {
            inUse: 0,
            minChars: 3,
            gazetteerURL: "",
            searchStreets: false,
            searchHouseNumbers: false,
            searchDistricts: false,
            searchParcels: false,
            searchStreetKey: false,
            onlyOneStreetName: "",
            searchStringRegExp: "",
            houseNumbers: [],
            ajaxRequests: {},
            typeOfRequest: "",
            prevSearchString: ""
        },
        /**
         * @description Initialisierung der Gazetteer Suche
         * @param {Object} config - Das Konfigurationsobjekt für die Gazetteer-Suche.
         * @param {string} config.serviceId - ID aus rest-conf für URL des GAZ.
         * @param {boolean} [config.searchStreets=false] - Soll nach Straßennamen gesucht werden? Vorraussetzung für searchHouseNumbers. Default: false.
         * @param {boolean} [config.searchHouseNumbers=false] - Sollen auch Hausnummern gesucht werden oder nur Straßen? Default: false.
         * @param {boolean} [config.searchDistricts=false] - Soll nach Stadtteilen gesucht werden? Default: false.
         * @param {boolean} [config.searchParcels=false] - Soll nach Flurstücken gesucht werden? Default: false.
         * @param {integer} [config.minCharacters=3] - Mindestanzahl an Characters im Suchstring, bevor Suche initieert wird. Default: 3.
         */
        initialize: function (config) {
            var gazService = Radio.request("RestReader", "getServiceById", config.serviceId);

            this.listenTo(EventBus, {
                "setPastedHouseNumber": this.setPastedHouseNumber,
                "searchbar:search": this.search,
                "gaz:adressSearch": this.adressSearch
            });

            if (gazService[0] && gazService[0].get("url")) {
                this.set("gazetteerURL", gazService[0].get("url"));
            }
            if (config.searchStreets) {
                this.set("searchStreets", config.searchStreets);
            }
            if (config.searchHouseNumbers) {
                this.set("searchHouseNumbers", config.searchHouseNumbers);
            }
            if (config.searchDistricts) {
               this.set("searchDistricts", config.searchDistricts);
            }
            if (config.searchParcels) {
                this.set("searchParcels", config.searchParcels);
            }
            if (config.searchStreetKey) {
                this.set("searchStreetKey", config.searchStreetKey);
            }
            if (config.minChars) {
                this.set("minChars", config.minChars);
            }
            if (_.isUndefined(Radio.request("ParametricURL", "getInitString")) === false) {
                this.directSearch(Radio.request("ParametricURL", "getInitString"));
            }
        },

        // für Copy/Paste bei Adressen
        setPastedHouseNumber: function (value) {
            this.set("pastedHouseNumber", value);
        },

        /**
        *
        */
        search: function (searchString) {
            var gemarkung, flurstuecksnummer;

            this.set("searchString", searchString);
            if (searchString.length >= this.get("minChars")) {
                if (this.get("searchStreets") === true) {
                    searchString = searchString.replace(/[()]/g, "\\$&");
                    Radio.trigger("Searchbar", "setSingelStreeName", "");
                    this.set("searchStringRegExp", new RegExp(searchString.replace(/ /g, ""), "i")); // Erst join dann als regulärer Ausdruck
                    this.set("onlyOneStreetName", "");
                    this.setTypeOfRequest("searchStreets");
                    this.sendRequest("StoredQuery_ID=findeStrasse&strassenname=" + encodeURIComponent(searchString), this.getStreets, true, this.getTypeOfRequest());
                }
                if (this.get("searchDistricts") === true) {
                    if (!_.isNull(searchString.match(/^[a-z\-]+$/i))) {
                        this.setTypeOfRequest("searchDistricts");
                        this.sendRequest("StoredQuery_ID=findeStadtteil&stadtteilname=" + searchString, this.getDistricts, true, this.getTypeOfRequest());
                    }
                }
                if (this.get("searchParcels") === true) {

                    if (!_.isNull(searchString.match(/^[0-9]{4}[\s|\/][0-9]*$/))) {
                        gemarkung = searchString.split(/[\s|\/]/)[0];
                        flurstuecksnummer = searchString.split(/[\s|\/]/)[1];
                        this.setTypeOfRequest("searchParcels1");
                        this.sendRequest("StoredQuery_ID=Flurstueck&gemarkung=" + gemarkung + "&flurstuecksnummer=" + flurstuecksnummer, this.getParcel, true, this.getTypeOfRequest());
                    }
                    else if (!_.isNull(searchString.match(/^[0-9]{5,}$/))) {
                        gemarkung = searchString.slice(0, 4);
                        flurstuecksnummer = searchString.slice(4);
                        this.setTypeOfRequest("searchParcels2");
                        this.sendRequest("StoredQuery_ID=Flurstueck&gemarkung=" + gemarkung + "&flurstuecksnummer=" + flurstuecksnummer, this.getParcel, true, this.getTypeOfRequest());
                    }
                }
                if (this.get("searchStreetKey") === true) {
                    if (!_.isNull(searchString.match(/^[a-z]{1}[0-9]{1,5}$/i))) {
                        this.setTypeOfRequest("searchStreetKey");
                        this.sendRequest("StoredQuery_ID=findeStrassenSchluessel&strassenschluessel=" + searchString, this.getStreetKey, true, this.getTypeOfRequest());
                    }
                }
            }
        },
        /**
        * @description Adresssuche mit Straße und Hausnummer und Zusatz. Wird nicht über die Searchbar getriggert.
        * @param {Object} adress - Adressobjekt zur Suche
        * @param {string} adress.streetname - Straßenname
        * @param {integer} adress.housenumber - Hausnummer
        * @param {string} [adress.affix] - Zusatz zur Hausnummer
        */
        adressSearch: function (adress) {
            if (adress.affix && adress.affix !== "") {
                this.setTypeOfRequest("adress1");
                this.sendRequest("StoredQuery_ID=AdresseMitZusatz&strassenname=" + encodeURIComponent(adress.streetname) + "&hausnummer=" + encodeURIComponent(adress.housenumber) + "&zusatz=" + encodeURIComponent(adress.affix), this.getAdress, false, this.getTypeOfRequest());
            }
            else {
                this.setTypeOfRequest("adress2");
                this.sendRequest("StoredQuery_ID=AdresseOhneZusatz&strassenname=" + encodeURIComponent(adress.streetname) + "&hausnummer=" + encodeURIComponent(adress.housenumber), this.getAdress, false, this.getTypeOfRequest());
            }
        },
        /**
        * @description Veränderte Suchabfolge bei initialer Suche, z.B. über Config.initialQuery
        * @param {string} searchString - Suchstring
        */
        directSearch: function (searchString) {
            var splitInitString;

            this.set("searchString", searchString);
            if (searchString.search(",") !== -1) {
                splitInitString = searchString.split(",");

                this.set("onlyOneStreetName", splitInitString[0]);
                searchString = searchString.replace(/\ /g, "");
                this.set("searchStringRegExp", new RegExp(searchString.replace(/\,/g, ""), "i")); // Erst join dann als regulärer Ausdruck
                this.setTypeOfRequest("onlyOneStreetName1");
                this.sendRequest("StoredQuery_ID=HausnummernZuStrasse&strassenname=" + encodeURIComponent(this.get("onlyOneStreetName")), this.getHouseNumbers, false, this.getTypeOfRequest());
            }
            else {
                this.set("searchStringRegExp", new RegExp(searchString.replace(/ /g, ""), "i")); // Erst join dann als regulärer Ausdruck
                this.set("onlyOneStreetName", "");
                this.setTypeOfRequest("onlyOneStreetName2");
                this.sendRequest("StoredQuery_ID=findeStrasse&strassenname=" + encodeURIComponent(searchString), this.getStreets, true, this.getTypeOfRequest());
            }
            if (this.get("searchStreetKey") === true) {
                if (!_.isNull(searchString.match(/^[a-z]{1}[0-9]{1,5}$/i))) {
                    this.setTypeOfRequest("searchStreetKey2");
                    this.sendRequest("StoredQuery_ID=findeStrassenSchluessel&strassenschluessel=" + searchString, this.getStreetKey, true, this.getTypeOfRequest());
                }
            }
            $("#searchInput").val(searchString);
            EventBus.trigger("createRecommendedList");
        },
        /**
        * @description Methode zur Weiterleitung der adressSearch
        * @param {xml} data - Response
        */
        getAdress: function (data) {
            EventBus.trigger("gaz:getAdress", data);
        },
        /**
         * [getStreets description]
         * @param  {[type]} data [description]
         */
        getStreets: function (data) {
            var hits = $("wfs\\:member,member", data),
                position,
                coordinates,
                hitNames = [],
                hitName,
                hitObject,
                firstDigit,
                newHouseNumber;

            _.each(hits, function (hit) {
                if (_.isUndefined($(hit).find("iso19112\\:position_strassenachse,position_strassenachse").find("gml\\:pos,pos")[0]) === false) {
                    position = $(hit).find("iso19112\\:position_strassenachse,position_strassenachse").find("gml\\:pos,pos")[0].textContent.split(" ");
                }
                else {
                    position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                }
                coordinates = [parseFloat(position[0]), parseFloat(position[1])];
                hitName = $(hit).find("dog\\:strassenname, strassenname")[0].textContent;
                hitNames.push(hitName);
                // "Hitlist-Objekte"
                hitObject = {
                    name: hitName,
                    type: "Straße",
                    coordinate: coordinates,
                    glyphicon: "glyphicon-road",
                    id: hitName.replace(/ /g, "") + "Straße"
                };
                EventBus.trigger("searchbar:pushHits", "hitList", hitObject);
            }, this);
            if (this.get("searchHouseNumbers") === true) {
                if (hits.length === 1) {
                    this.set("prevSearchString", hitName.replace(/\ /g, ""));
                    this.set("onlyOneStreetName", hitName);
                    this.setTypeOfRequest("searchHouseNumbers1");
                    Radio.trigger("Searchbar", "setSingelStreeName", hitObject);
                    this.sendRequest("StoredQuery_ID=HausnummernZuStrasse&strassenname=" + encodeURIComponent(hitName), this.getHouseNumbers, false, this.getTypeOfRequest());
                }
                else if (hits.length === 0) {
                    firstDigit = this.get("searchString").search(/\d/),
                    newHouseNumber = this.get("searchString").substring(firstDigit).replace(/\ /g, "");

                    if (!_.include(this.get("searchString").toString(), this.get("prevSearchString").toString())) {
                        this.setSearchStringRegExp(new RegExp(this.get("prevSearchString").replace(/[0-9]/g, "").replace(/\ /g, "") + newHouseNumber), "i");
                    }
                    this.searchInHouseNumbers();
                }
                else {
                    this.set("prevSearchString", this.get("searchString"));
                    _.each(hitNames, function (hitName) {
                        if (hitName.toLowerCase() === this.get("searchString").toLowerCase()) {
                            this.set("onlyOneStreetName", hitName);
                            this.setTypeOfRequest("searchHouseNumbers2");
                            this.sendRequest("StoredQuery_ID=HausnummernZuStrasse&strassenname=" + encodeURIComponent(hitName), this.getHouseNumbers, false, this.getTypeOfRequest());
                        }
                    }, this);
                    EventBus.trigger("createRecommendedList");
                }
            }
        },
        /**
         * [getDistricts description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        getDistricts: function (data) {
            var hits = $("wfs\\:member,member", data),
                coordinate,
                position,
                hitName;

            _.each(hits, function (hit) {
                position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                coordinate = [parseFloat(position[0]), parseFloat(position[1])];
                hitName = $(hit).find("iso19112\\:geographicIdentifier , geographicIdentifier")[0].textContent;
                // "Hitlist-Objekte"
                EventBus.trigger("searchbar:pushHits", "hitList", {
                    name: hitName,
                    type: "Stadtteil",
                    coordinate: coordinate,
                    glyphicon: "glyphicon-map-marker",
                    id: hitName.replace(/ /g, "") + "Stadtteil"
                });
            }, this);
            EventBus.trigger("createRecommendedList");
        },
        searchInHouseNumbers: function () {
            var address,
                number;
            // Adressuche über Copy/Paste
            Radio.trigger("Searchbar", "setHitList", []);
            if (this.get("pastedHouseNumber") !== undefined) {
                _.each(this.get("houseNumbers"), function (houseNumber) {
                    address = houseNumber.name.replace(/ /g, "");
                    number = houseNumber.adress.housenumber + houseNumber.adress.affix;

                    if (number.indexOf(this.get("pastedHouseNumber")) === 0) {
                        Radio.trigger("Searchbar", "pushHits", "hitList", houseNumber);
                    }
                }, this);
                this.unset("pastedHouseNumber");
            }
            else {
                _.each(this.get("houseNumbers"), function (houseNumber) {
                    address = houseNumber.name.replace(/ /g, "");
                    if (address.search(this.get("searchStringRegExp")) !== -1) {
                        EventBus.trigger("searchbar:pushHits", "hitList", houseNumber);
                    }
                }, this);
            }
            Radio.trigger("Searchbar", "createRecommendedList");
            this.setSearchStringRegExp("");
        },
        /**
         * [getHouseNumbers description]
         * @param  {[type]} data [description]
         */
        getHouseNumbers: function (data) {
            var hits = $("wfs\\:member,member", data),
                number,
                affix,
                coordinate,
                position,
                name,
                adress = {};

            this.set("houseNumbers", []);
            _.each(hits, function (hit) {
                var obj;

                position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                coordinate = [parseFloat(position[0]), parseFloat(position[1])];
                number = $(hit).find("dog\\:hausnummer,hausnummer")[0].textContent;
                if ($(hit).find("dog\\:hausnummernzusatz,hausnummernzusatz")[0] !== undefined) {
                    affix = $(hit).find("dog\\:hausnummernzusatz,hausnummernzusatz")[0].textContent;
                    name = this.get("onlyOneStreetName") + " " + number + affix;
                    adress = {
                        streetname: this.get("onlyOneStreetName"),
                        housenumber: number,
                        affix: affix
                    };
                }
                else {
                    name = this.get("onlyOneStreetName") + " " + number ;
                    adress = {
                        streetname: this.get("onlyOneStreetName"),
                        housenumber: number,
                        affix: ""
                    };
                }
                // "Hitlist-Objekte"
                obj = {
                    name: name,
                    type: "Adresse",
                    coordinate: coordinate,
                    glyphicon: "glyphicon-map-marker",
                    adress: adress,
                    id: _.uniqueId("Adresse")
                };

                this.get("houseNumbers").push(obj);
            }, this);
            this.searchInHouseNumbers();
        },
        /**
         *
         */
        getParcel: function (data) {
            var hits = $("wfs\\:member,member", data),
                coordinate,
                position,
                geom,
                gemarkung,
                flurstueck;

            _.each(hits, function (hit) {
                position = $(hit).find("gml\\:pos,pos")[0].textContent.split(" ");
                gemarkung = $(hit).find("dog\\:gemarkung,gemarkung")[0].textContent;
                flurstueck = $(hit).find("dog\\:flurstuecksnummer,flurstuecksnummer")[0].textContent;
                coordinate = [parseFloat(position[0]), parseFloat(position[1])];
                geom = $(hit).find("gml\\:posList, posList")[0].textContent;
                // "Hitlist-Objekte"
                EventBus.trigger("searchbar:pushHits", "hitList", {
                    name: "Flurstück " + gemarkung + "/" + flurstueck,
                    type: "Parcel",
                    coordinate: coordinate,
                    glyphicon: "glyphicon-map-marker",
                    geom: "geom",
                    id: "Parcel"
                });
            }, this);
            EventBus.trigger("createRecommendedList");
        },
        /**
         *
         */
        getStreetKey: function (data) {
            var hits = $("wfs\\:member,member", data),
                coordinates,
                hitName;

            _.each(hits, function (hit) {
                coordinates = $(hit).find("gml\\:posList,posList")[0].textContent;
                hitName = $(hit).find("dog\\:strassenname, strassenname")[0].textContent;
                // "Hitlist-Objekte"
                EventBus.trigger("searchbar:pushHits", "hitList", {
                    name: hitName,
                    type: "Straße",
                    coordinate: coordinates,
                    glyphicon: "glyphicon-road",
                    id: hitName.replace(/ /g, "") + "Straße"
                });
            }, this);
            EventBus.trigger("createRecommendedList");
        },
        /**
         * @description Führt einen HTTP-GET-Request aus.
         *
         * @param {String} data - Data to be sent to the server
         * @param {function} successFunction - A function to be called if the request succeeds
         * @param {boolean} asyncBool - asynchroner oder synchroner Request
         */
        sendRequest: function (data, successFunction, asyncBool, type) {
            var ajax = this.get("ajaxRequests");

            if (ajax[type] !== null && !_.isUndefined(ajax[type])) {
                ajax[type].abort();
                this.polishAjax(type);
            }
            this.ajaxSend(data, successFunction, asyncBool, type);
        },

        ajaxSend: function (data, successFunction, asyncBool, typeRequest) {
            this.get("ajaxRequests")[typeRequest] = ($.ajax({
                url: this.get("gazetteerURL"),
                data: data,
                dataType: "xml",
                context: this,
                async: asyncBool,
                type: "GET",
                success: successFunction,
                timeout: 6000,
                typeRequest: typeRequest,
                error: function (err) {
                    this.showError(err);
                },
                complete: function () {
                    this.polishAjax(typeRequest);
                }
            }, this));
        },

        /**
         * Triggert die Darstellung einer Fehlermeldung
         * @param {object} err Fehlerobjekt aus Ajax-Request
         */
        showError: function (err) {
            var detail = err.statusText && err.statusText !== "" ? err.statusText : "";

            Radio.trigger("Alert", "alert", "Gazetteer-URL nicht erreichbar. " + detail);
        },

        /**
         * Löscht die Information des erfolgreichen oder abgebrochenen Ajax-Requests wieder aus dem Objekt der laufenden Ajax-Requests
         * @param {string} type Bezeichnung des Typs
         */
        polishAjax: function (type) {
            var ajax = this.get("ajaxRequests"),
                cleanedAjax = _.omit(ajax, type);

            this.set("ajaxRequests", cleanedAjax);
        },

        /**
        * Holt den jeweiligen Typ der gesendet wird
        */
        getTypeOfRequest: function () {
            return this.get("typeOfRequest");
        },

        /**
        * Setzt den jeweiligen Typ der gesendet wird
        */
        setTypeOfRequest: function (value) {
            this.set("typeOfRequest", value);
        },

        /**
        * Holt den angepassten SearchString
        */
        getSearchStringRegExp: function () {
            return this.get("searchStringRegExp");
        },

        /**
        * Setzt den angepassten SearchString
        */
        setSearchStringRegExp: function (value) {
            this.set("searchStringRegExp", value);
        }
    });
});

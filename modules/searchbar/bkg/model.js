import "../model";

const BKGSearchModel = Backbone.Model.extend(/** @lends BKGSearchModel.prototype */{
    defaults: {
        minChars: 3,
        bkgSuggestURL: "",
        bkgSearchURL: "",
        extent: [
            454591, 5809000, 700000, 6075769
        ],
        suggestCount: 20,
        epsg: "EPSG:25832",
        filter: "filter=(typ:*)",
        score: 0.6,
        ajaxRequests: {},
        typeOfRequest: "",
        zoomToResult: false, // @deprecated in version 3.0.0
        zoomToresulOnHover: false,
        zoomToResultOnClick: true,
        idCounter: 0,
        zoomLevel: 7
    },
    /**
     * @description Initialisierung der BKG Suggest Suche
     * @param {Object} config - Das Konfigurationsobjet der BKG Suche.
     * @param {integer} [config.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
     * @param {string} config.suggestServiceId - ID aus rest-services für URL für schnelles Suggest.
     * @param {string} [config.geosearchServiceId] - ID aus rest-services für URL für ausführliche Search.
     * @param {float[]} [config.extent=454591, 5809000, 700000, 6075769] - Koordinatenbasierte Ausdehnung in der gesucht wird.
     * @param {integer} [config.suggestCount=20] - Anzahl der über suggest angefragten Vorschläge.
     * @param {string} [config.epsg=EPSG:25832] - EPSG-Code des verwendeten Koordinatensystems.
     * @param {string} [config.filter=filter=(typ:*)] - Filterstring
     * @param {float} [config.score=0.6] - Score-Wert, der die Qualität der Ergebnisse auswertet.
     * @param {Number} idCounter=0 counter for unique ids
     * @returns {void}
     */
    initialize: function (config) {
        var suggestService = Radio.request("RestReader", "getServiceById", config.suggestServiceId),
            geosearchService = Radio.request("RestReader", "getServiceById", config.geosearchServiceId);

        if (suggestService && suggestService.get("url")) {
            this.set("bkgSuggestURL", suggestService.get("url"));
        }

        if (geosearchService && geosearchService.get("url")) {
            this.set("bkgSearchURL", geosearchService.get("url"));
        }

        if (config.minChars) {
            this.set("minChars", config.minChars);
        }
        if (config.extent) {
            this.set("extent", config.extent);
        }
        if (config.suggestCount) {
            this.set("suggestCount", config.suggestCount);
        }
        if (config.epsg) {
            this.set("epsg", config.epsg);
        }
        if (config.filter) {
            this.set("filter", config.filter);
        }
        if (config.score) {
            this.set("score", config.score);
        }
        if (Radio.request("ParametricURL", "getInitString") !== undefined) {
            this.directSearch(Radio.request("ParametricURL", "getInitString"));
        }

        this.listenTo(Radio.channel("Searchbar"), {
            "bkgSearch": this.bkgSearch,
            "search": this.search
        });
    },
    /**
    * @description Veränderte Suchabfolge bei initialer Suche z.B. furch URL-Parameter query
    * @param {string} searchString - Suchstring
    * @returns {void}
    */
    directSearch: function (searchString) {
        var request;

        if (searchString.length >= this.get("minChars")) {
            $("#searchInput").val(searchString);
            request = "bbox=" + this.get("extent") + "&outputformat=json&srsName=" + this.get("epsg") + "&query=" + encodeURIComponent(searchString) + "&" + this.get("filter") + "&count=" + this.get("suggestCount");

            this.setTypeOfRequest("direct");
            this.sendRequest(this.get("bkgSuggestURL"), request, this.directPushSuggestions, false, this.get("typeOfRequest"));
        }
    },
    directPushSuggestions: function (data) {
        if (data.length === 1) {
            this.bkgSearch({
                name: data[0].suggestion
            });
        }
        else {
            data.forEach(function (hit) {
                if (hit.score > this.get("score")) {
                    Radio.trigger("Searchbar", "pushHits", "hitList", {
                        name: hit.suggestion,
                        metaName: hit.suggestion,
                        type: i18next.t("common:modules.searchbar.type.location"),
                        bkg: true,
                        glyphicon: "glyphicon-road",
                        id: this.uniqueId("bkgSuggest"),
                        triggerEvent: {
                            channel: "Searchbar",
                            event: "bkgSearch"
                        }
                    });
                }
            }, this);
        }
        Radio.trigger("Searchbar", "createRecommendedList", "bkg");
    },
    /**
     * Returns a unique id, starts with the given prefix
     * @param {string} prefix prefix for the id
     * @returns {string} a unique id
     */
    uniqueId: function (prefix) {
        let counter = this.get("idCounter");
        const id = ++counter;

        this.setIdCounter(id);
        return prefix ? prefix + id : id;
    },
    /**
     * Startet die Suche
     * @param  {string} searchString Suchpattern
     * @return {void}
     */
    search: function (searchString) {
        if (searchString.length >= this.get("minChars")) {
            this.suggestByBKG(searchString);
        }
    },

    suggestByBKG: function (searchString) {
        var request = "bbox=" + this.get("extent") + "&outputformat=json&srsName=" + this.get("epsg") + "&query=" + encodeURIComponent(searchString) + "&" + this.get("filter") + "&count=" + this.get("suggestCount");

        this.setTypeOfRequest("suggest");
        this.sendRequest(this.get("bkgSuggestURL"), request, this.pushSuggestions, true, this.get("typeOfRequest"));
    },

    /**
     * Fügt die Vorschläge den Suchtreffern hinzu
     * @param  {object[]} data Array der Treffer
     * @return {void}
     */
    pushSuggestions: function (data) {
        data.forEach(function (hit) {
            if (hit.score > this.get("score")) {
                Radio.trigger("Searchbar", "pushHits", "hitList", {
                    name: hit.suggestion,
                    metaName: hit.suggestion,
                    type: i18next.t("common:modules.searchbar.type.location"),
                    bkg: true,
                    glyphicon: "glyphicon-road",
                    id: this.uniqueId("bkgSuggest"),
                    triggerEvent: {
                        channel: "Searchbar",
                        event: "bkgSearch"
                    }
                });
            }
        }, this);
        Radio.trigger("Searchbar", "createRecommendedList");
    },

    /**
     * Starts the precise search of a selected BKG proposal.
     * @param  {object} hit - Object of the BKG proposal.
     * @param  {boolean} showOrHideMarker - Indicates whether the marker should be shown or hidden.
     * @param  {event} eventType - The type of event that triggered this function.
     * @return {void}
     */
    bkgSearch: function (hit, showOrHideMarker, eventType) {
        var name = hit.name,
            request = "bbox=" + this.get("extent") + "&outputformat=json&srsName=" + this.get("epsg") + "&count=1&query=" + encodeURIComponent(name);

        this.setTypeOfRequest("search");
        this.sendRequest(this.get("bkgSearchURL"), request, this.handleBKGSearchResult, true, this.get("typeOfRequest"), showOrHideMarker, eventType);
    },

    /**
     * Triggers the zoom on the feature and the drawing or hiding of the marker
     * @param  {string} data - Data-XML from request.
     * @param  {boolean} showOrHideMarker - Indicates whether the marker should be shown or hidden.
     * @param  {event} eventType - The type of event that triggered this function.
     * @returns {void}
     */
    handleBKGSearchResult: function (data, showOrHideMarker, eventType) {
        if (showOrHideMarker === true) {
            Radio.trigger("MapMarker", "showMarker", data.features[0].geometry.coordinates);
        }
        else {
            Radio.trigger("MapMarker", "hideMarker");
        }

        if ((eventType === "mouseover" && this.get("zoomToResultOnHover")) || (eventType === "click" && this.get("zoomToResultOnClick"))) {
            Radio.trigger("MapMarker", "zoomToBKGSearchResult", data, this.get("zoomLevel"));
        }
        /**
         * zoomToResult
         * @deprecated in 3.0.0
         */
        else if (eventType === "mouseover" && this.get("zoomToResult")) {
            console.warn("Parameter 'zoomToResult' is deprecated. Please use 'zoomToResultOnHover' or 'zoomToResultOnClick' instead.");
            Radio.trigger("MapMarker", "zoomToBKGSearchResult", data, this.get("zoomLevel"));
        }
    },

    /**
     * Executes an HTTP GET request.
     * @param {String} url - URL the request is sent to.
     * @param {String} data - Data to be sent to the server
     * @param {function} successFunction - A function to be called if the request succeeds
     * @param {boolean} asyncBool - asynchroner oder synchroner Request
     * @param {String} type - Typ des Requests,
     * @param  {boolean} showOrHideMarker - Indicates whether the marker should be shown or hidden.
     * @param  {event} eventType - The type of event that triggered this function
     * @returns {void}
     */
    sendRequest: function (url, data, successFunction, asyncBool, type, showOrHideMarker, eventType) {
        var ajax = this.get("ajaxRequests");

        if (ajax[type] !== null && ajax[type] !== undefined) {
            ajax[type].abort();
            this.polishAjax(type);
        }
        this.ajaxSend(url, data, successFunction, asyncBool, type, showOrHideMarker, eventType);
    },

    /**
     * Sends the ajax request.
     * @param {String} url - URL the request is sent to.
     * @param {String} data - Data to be sent to the server.
     * @param {function} successFunction - A function to be called if the request succeeds.
     * @param {boolean} asyncBool - asynchroner oder synchroner Request.
     * @param {String} typeRequest - Typ des Requests.
     * @param  {boolean} showOrHideMarker - Indicates whether the marker should be shown or hidden.
     * @param  {event} eventType - The type of event that triggered this function.
     * @returns {void}
     */
    ajaxSend: function (url, data, successFunction, asyncBool, typeRequest, showOrHideMarker, eventType) {
        this.get("ajaxRequests")[typeRequest] = $.ajax({
            url: url,
            data: data,
            dataType: "json",
            context: this,
            async: asyncBool,
            type: "GET",
            success: (resultData) => successFunction.call(this, resultData, showOrHideMarker, eventType),
            timeout: 6000,
            typeRequest: typeRequest,
            error: function (err) {
                if (err.status !== 0) { // No error message for abort.
                    this.showError(err);
                }
                Radio.trigger("Searchbar", "abortSearch", "bkg");
            },
            complete: function () {
                this.polishAjax(typeRequest);
            }
        }, this);
    },

    /**
     * Triggers the display of an error message.
     * @param {object} err - Error object from Ajax request.
     * @returns {void}
     */
    showError: function (err) {
        const detail = err.statusText && err.statusText !== "" ? err.statusText : "";

        Radio.trigger("Alert", "alert", i18next.t("common:modules.searchbar.bkg.errorMsg") + " " + detail);
    },

    /**
     * Deletes the information of the successful or aborted Ajax request from the object of the running Ajax requests
     * @param {string} type - Designation of the type.
     * @returns {void}
     */
    polishAjax: function (type) {
        var ajax = this.get("ajaxRequests"),
            cleanedAjax = _.omit(ajax, type);

        this.set("ajaxRequests", cleanedAjax);
    },

    /**
     * Sets the typeOfRequest
     * @param {string} value - typeOfRequest
     * @returns {void}
     */
    setTypeOfRequest: function (value) {
        this.set("typeOfRequest", value);
    },

    /**
    * Sets the showOrHideMarker.
    * @param {string} value - showOrHideMarker
    * @returns {void}
    */
    setShowOrHideMarker: function (value) {
        this.set("showOrHideMarker", value);
    },

    /**
    * Sets the idCounter.
    * @param {string} value - idCounter
    * @returns {void}
    */
    setIdCounter: function (value) {
        this.set("idCounter", value);
    }
});

export default BKGSearchModel;

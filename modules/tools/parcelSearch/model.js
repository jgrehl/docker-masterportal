import Tool from "../../core/modelList/tool/model";

const ParcelSearch = Tool.extend({
    defaults: _.extend({}, Tool.prototype.defaults, {
        deactivateGFI: false,
        renderToWindow: true,
        isCollapsed: undefined,
        isCurrentWin: undefined,
        countryNumber: "02", // Kennzeichen des Landes. Wird für den Report benötigt um das Flurstückskennzeichen zusammmenzubauen
        fetched: false, // initiales Laden der JSON
        serviceId: "",
        reportServiceId: "",
        serviceURL: "", // Flurstücks-Gazetteer-URL
        storedQueryID: null, // StoredQueryID, die im Request angesprochen werden soll.
        districts: {}, // Object mit allen Gemarkungen {{"name: "id"}, {"name2: "id2"}, ...}
        cadastralDistricts: {}, // Object mit allen Fluren {{"id1: ["name1", "name2"]}, {"id2: ["name1", "name2"]}, ...}
        districtNumber: "0", // default Gemarkung
        cadastralDistrictField: false, // sollen Fluren genutzt werden? Wird automatisch beim parsen ermittelt.
        cadastralDistrictNumber: "0", // default Flur
        parcelDenominatorField: false, // sollen Flurstücksnenner verwendet werden? Aus config
        parcelNumber: "", // default Flurstücksnummer
        parcelDenominatorNumber: "0", // default Flurstücksnenner,
        createReport: false, // soll Berichts-Funktionalität gestartet werden? Aus Config.json
        parcelFound: false, // flag für den Bericht. Bericht wird nur abgefragt wenn Flurstück existiert
        glyphicon: "glyphicon-search",
        mapMarkerType: "Parcel",
        // translations
        searchText: "",
        generateReportText: "",
        parcelNumberText: "",
        parcelNumberPlaceholderText: "",
        districtText: "",
        chooseText: "",
        wrongConfig: "",
        districtsLoadFailed: "",
        wrongConfigParcelsearch: "",
        parcelSearchImpossible: "",
        tryAgainLater: ""

    }),
    initialize: function () {
        this.superInitialize();
        this.changeLang(i18next.language);

        this.listenTo(Radio.channel("ParcelSearch"), {
            "createReport": this.createReport
        });
        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.changeLang
        });
        this.setDefaults();
    },

    setDefaults: function () {
        var restService,
            serviceURL;

        if (this.get("parcelDenominator") === true) {
            this.setParcelDenominatorField(true);
        }

        restService = this.get("serviceId") ? Radio.request("RestReader", "getServiceById", this.get("serviceId")) : null;
        serviceURL = restService && restService.get("url") ? restService.get("url") : null;

        this.setServiceURL(serviceURL);
        // lade json und Konfiguration
        if (serviceURL && this.get("configJSON") && this.get("storedQueryID")) {
            this.loadConfiguration(this.get("configJSON"));
        }
        else {
            Radio.trigger("Alert", "alert", this.get("wrongConfig") + " (" + this.get("name") + ")");
        }
    },
    /**
     * change language - sets default values for the language
     * @param {String} lng the language changed to
     * @returns {Void}  -
     */
    changeLang: function () {
        this.set({
            searchText: i18next.t("common:button.search"),
            generateReportText: i18next.t("common:modules.tools.parcelSearch.generateReport"),
            parcelNumberText: i18next.t("common:modules.tools.parcelSearch.parcelNumber"),
            parcelNumberPlaceholderText: i18next.t("common:modules.tools.parcelSearch.parcelNumberPlaceholder"),
            chooseText: i18next.t("common:modules.tools.parcelSearch.choose"),
            districtText: i18next.t("common:modules.tools.parcelSearch.district"),
            wrongConfig: i18next.t("common:modules.tools.parcelSearch.wrongConfig"),
            districtsLoadFailed: i18next.t("common:modules.tools.parcelSearch.districtsLoadFailed"),
            wrongConfigParcelsearch: i18next.t("common:modules.tools.parcelSearch.wrongConfigParcelsearch"),
            parcelSearchImpossible: i18next.t("common:modules.tools.parcelSearch.parcelSearchImpossible"),
            tryAgainLater: i18next.t("common:modules.tools.parcelSearch.tryAgainLater")
        });
    },
    /*
     * liest die gemarkung.json ein. Anschließend wird parse gestartet.
     */
    loadConfiguration: function (configJSON) {
        this.fetch({
            url: configJSON,
            cache: false,
            context: this,
            error: function () {
                Radio.trigger("Alert", "alert", this.get("districtsLoadFailed") + " (" + this.get("name") + ")");
            },
            complete: function () {
                Radio.trigger("Util", "hideLoader");
            },
            beforeSend: function () {
                Radio.trigger("Util", "showLoader");
            }
        });
    },
    /*
     * parst die gemarkung.json. Das JSON-Object hat folgenden Aufbau:
     * {"Allermöhe": { "id": "0601", "flur": ["Flur1", "Flur2"]}, "Alsterdorf": { "id": "0424", "flur": ["Flur3", "Flur4"]}, "Alt-Rahlstedt": { "id": "0544", "flur": []}, ...}
     * Der Wert "flur" ist optional und davon abhängig, ob im nutzenden Bundesland auch Fluren genutzt werden.
     */
    parse: function (obj) {
        var districts = {},
            cadastralDistricts = {};

        _.each(obj, function (value, key) {
            _.extend(districts, _.object([key], [value.id]));
            if (_.has(value, "flur") && _.isArray(value.flur) && value.flur.length > 0) {
                _.extend(cadastralDistricts, _.object([value.id], [value.flur]));
            }
        }, this);
        this.setDistricts(districts);
        if (_.values(cadastralDistricts).length > 0) {
            this.setCadastralDistricts(cadastralDistricts);
            this.setCadastralDistrictField(true);
        }
        this.setFetched(true);
    },
    createReport: function (flurstueck, gemarkung) {
        var flurst_kennz,
            jasperService = Radio.request("RestReader", "getServiceById", this.get("reportServiceId")),
            params = _.isUndefined(jasperService) === false ? jasperService.get("params") : undefined,
            url = _.isUndefined(jasperService) === false ? jasperService.get("url") + "?" : undefined;

        // setze flurst_nummer und gemarkung aus gfi Aufruf
        if (_.isUndefined(flurstueck) === false) {
            this.setParcelNumber(flurstueck);
            this.setDistrictNumber(gemarkung);
            this.setParcelFound(true);
        }
        else {
            // prüfe ob es ein Flurstück gibt
            this.sendRequest();
        }
        flurst_kennz = this.createFlurstKennz();
        // if (this.get("parcelFound") === true) {
        if (this.get("parcelFound") && _.isUndefined(url) === false && _.isUndefined(params) === false) {
            params.flurstueckskennzeichen = flurst_kennz;
            url = this.buildUrl(url, params);
            window.open(url, "_blank");
        }
        else {
            Radio.trigger("Alert", "alert", {text: this.get("wrongConfigParcelsearch"), kategorie: "alert-info"});
        }
    },
    buildUrl: function (url, params) {
        var addedUrl = url;

        _.each(params, function (val, key) {
            var andSymbol = "&";

            addedUrl += key + "=" + String(val) + andSymbol;
        });
        // if params is empty object
        if (addedUrl.charAt(addedUrl.length - 1) !== "?") {
            addedUrl = addedUrl.slice(0, -1);
        }
        return addedUrl;

    },
    createFlurstKennz: function () {
        var land = this.get("countryNumber"),
            gemarkung = this.get("districtNumber"),
            flurst_nr = this.padLeft(this.get("parcelNumber"), 5, "0");

        return land + gemarkung + "___" + flurst_nr + "______";
    },
    /**
     * Erzeugt einen String bestimmter Länge anhand eines übergebenen String und füllt links mit gewünschtem Zeichen
     * @param  {number} number      Zahl, die links ergänzt werden soll
     * @param  {number} length      gewünschte Länge des String
     * @param  {string} [prefix=0]  Füllzeichen
     * @return {string}             aufgefüllter String
     */
    padLeft: function (number, length, prefix) {
        return Array(length - String(number).length + 1).join(prefix || "0") + number;
    },
    sendRequest: function () {
        var storedQuery = "&StoredQuery_ID=" + this.get("storedQueryID"),
            gemarkung = "&gemarkung=" + this.get("districtNumber"),
            flur = this.get("cadastralDistrictField") === true ? "&flur=" + this.get("cadastralDistrictNumber") : "",
            parcelNumber = "&flurstuecksnummer=" + this.padLeft(this.get("parcelNumber"), 5, "0"),
            parcelDenominatorNumber = this.get("parcelDenominatorField") === true ? "&flurstuecksnummernenner=" + this.padLeft(this.get("parcelDenominatorNumber"), 3, "0") : "",
            data = storedQuery + gemarkung + flur + parcelNumber + parcelDenominatorNumber;

        $.ajax({
            url: this.get("serviceURL"),
            data: data,
            context: this,
            success: this.getParcel,
            timeout: 6000,
            async: false,
            error: function () {
                Radio.trigger("Alert", "alert", {text: "<strong>" + this.get("parcelSearchImpossible") + "</strong> " + this.get("tryAgainLater"), kategorie: "alert-danger"});
            },
            complete: function () {
                Radio.trigger("Util", "hideLoader");
            },
            beforeSend: function () {
                Radio.trigger("Util", "showLoader");
            }
        });
    },
    getParcel: function (data) {
        var member = $("wfs\\:member,member", data)[0],
            parcelNumber,
            parcelDenominatorNumber,
            position,
            coordinate,
            geoExtent,
            attributes;

        if (!member || member.length === 0) {
            parcelNumber = this.padLeft(this.get("parcelNumber"), 5, "0");
            parcelDenominatorNumber = this.get("parcelDenominatorField") === true ? " / " + this.padLeft(this.get("parcelDenominatorNumber"), 3, "0") : "";
            this.setParcelFound(false);
            Radio.trigger("Alert", "alert", {text: i18next.t("common:modules.tools.parcelSearch.parcelNotFound", {flstNr: parcelNumber + parcelDenominatorNumber}), kategorie: "alert-info"});
            Radio.trigger("ParcelSearch", "noParcelFound");
        }
        else {
            position = $(member).find("gml\\:pos, pos")[0] ? $(member).find("gml\\:pos, pos")[0].textContent.split(" ") : null;
            coordinate = position ? [parseFloat(position[0]), parseFloat(position[1])] : null;
            attributes = coordinate ? _.object(["coordinate"], [coordinate]) : {};
            geoExtent = $(member).find("iso19112\\:geographicExtent, geographicExtent")[0] ? $(member).find("iso19112\\:geographicExtent, geographicExtent")[0] : null;
            attributes = geoExtent ? _.extend(attributes, _.object(["geographicExtent"], [geoExtent])) : attributes;

            $(member).find("*").filter(function () {
                return this.nodeName.indexOf("dog") !== -1 || this.nodeName.indexOf("gages") !== -1;
            }).each(function () {
                _.extend(attributes, _.object([this.nodeName.split(":")[1]], [this.textContent]));
            });
            this.setParcelFound(true);

            Radio.trigger("MapMarker", "zoomTo", {type: this.get("mapMarkerType"), coordinate: coordinate});
            Radio.trigger("ParcelSearch", "parcelFound", attributes);
        }
    },

    setDistrictNumber: function (value) {
        this.set("districtNumber", value);
    },

    setCadastralDistrictNumber: function (value) {
        this.set("cadastralDistrictNumber", value);
    },

    setParcelDenominatorNumber: function (value) {
        this.set("parcelDenominatorNumber", value);
    },

    setParcelDenominatorField: function (value) {
        this.set("parcelDenominatorField", value);
    },

    // setter for isCollapsed
    setIsCollapsed: function (value) {
        this.set("isCollapsed", value);
    },

    // setter for isCurrentWin
    setIsCurrentWin: function (value) {
        this.set("isCurrentWin", value);
    },

    // setter for serviceURL
    setServiceURL: function (value) {
        this.set("serviceURL", value);
    },

    // setter for districts
    setDistricts: function (value) {
        this.set("districts", value);
    },

    // setter for cadastralDistricts
    setCadastralDistricts: function (value) {
        this.set("cadastralDistricts", value);
    },

    // setter for fetched
    setFetched: function (value) {
        this.set("fetched", value);
    },

    // setter for cadastralDistrictField
    setCadastralDistrictField: function (value) {
        this.set("cadastralDistrictField", value);
    },

    setParcelNumber: function (value) {
        this.set("parcelNumber", value);
    },

    // setter for parcelFound
    setParcelFound: function (value) {
        this.set("parcelFound", value);
    }
});

export default ParcelSearch;

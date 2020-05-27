import * as moment from "moment";

const Util = Backbone.Model.extend(/** @lends Util.prototype */{
    defaults: {
        config: "",
        ignoredKeys: ["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH", "GEOM"],
        uiStyle: "DEFAULT",
        proxy: true,
        proxyHost: "",
        loaderOverlayTimeoutReference: null,
        loaderOverlayTimeout: 40,
        // the loaderOverlayCounter has to be set to 1 initialy, because it is shown on start and hidden at the end of app.js
        loaderOverlayCounter: 1,
        fadeOut: 2000
    },
    /**
     * @class Util
     * @extends Backbone.Model
     * @memberof Core
     * @constructs
     * @property {String} config="" todo
     * @property {String[]} ignoredKeys=["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH", "GEOM"] List of ignored attribute names when displaying attribute information of all layer types.
     * @property {String} uiStyle="DEFAULT" Controls the layout of the controls.
     * @property {String} proxy=true Specifies whether points should be replaced by underscores in URLs. This prevents CORS errors. Attention: A reverse proxy must be set up on the server side.
     * @property {String} proxyHost="" Hostname of a remote proxy (CORS must be activated there).
     * @property {String} loaderOverlayTimeoutReference=null todo
     * @property {String} loaderOverlayTimeout="20" Timeout for the loadergif.
     * @listens Core#RadioRequestUtilChangeTimeZone
     * @listens Core#RadioRequestUtilIsViewMobile
     * @listens Core#RadioRequestUtilGetProxyURL
     * @listens Core#RadioRequestUtilIsApple
     * @listens Core#RadioRequestUtilIsAndroid
     * @listens Core#RadioRequestUtilIsOpera
     * @listens Core#RadioRequestUtilIsWindows
     * @listens Core#RadioRequestUtilIsChrome
     * @listens Core#RadioRequestUtilIsInternetExplorer
     * @listens Core#RadioRequestUtilIsAny
     * @listens Core#RadioRequestUtilGetConfig
     * @listens Core#RadioRequestUtilGetUiStyle
     * @listens Core#RadioRequestUtilGetIgnoredKeys
     * @listens Core#RadioRequestUtilPunctuate
     * @listens Core#RadioRequestUtilSort
     * @listens Core#RadioRequestUtilConvertArrayOfObjectsToCsv
     * @listens Core#RadioRequestUtilGetPathFromLoader
     * @listens Core#RadioRequestUtilGetMasterPortalVersionNumber
     * @listens Core#RadioRequestUtilRenameKeys
     * @listens Core#RadioRequestUtilRenameValues
     * @listens Core#RadioRequestUtilDifferenceJs
     * @listens Core#RadioRequestUtilSortBy
     * @listens Core#RadioRequestUtilUniqueId
     * @listens Core#RadioTriggerUtilHideLoader
     * @listens Core#RadioTriggerUtilShowLoader
     * @listens Core#RadioTriggerUtilSetUiStyle
     * @listens Core#RadioTriggerUtilCopyToClipboard
     * @listens Core#event:changeIsViewMobile
     * @fires Core#RadioTriggerIsViewMobileChanged
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires Core#RadioTriggerUtilHideLoader
     */
    initialize: function () {
        const channel = Radio.channel("Util");

        channel.reply({
            "isViewMobile": function () {
                return this.get("isViewMobile");
            },
            "getMasterPortalVersionNumber": this.getMasterPortalVersionNumber,
            "getProxyURL": this.getProxyURL,
            "isApple": this.isApple,
            "isAndroid": this.isAndroid,
            "isOpera": this.isOpera,
            "isWindows": this.isWindows,
            "isChrome": this.isChrome,
            "isInternetExplorer": this.isInternetExplorer,
            "isAny": this.isAny,
            "getConfig": function () {
                return this.get("config");
            },
            "getUiStyle": function () {
                return this.get("uiStyle");
            },
            "getIgnoredKeys": function () {
                return this.get("ignoredKeys");
            },
            "punctuate": this.punctuate,
            "sort": this.sort,
            "convertArrayOfObjectsToCsv": this.convertArrayOfObjectsToCsv,
            "getPathFromLoader": this.getPathFromLoader,
            "renameKeys": this.renameKeys,
            "renameValues": this.renameValues,
            "pickKeyValuePairs": this.pickKeyValuePairs,
            "groupBy": this.groupBy,
            "sortBy": this.sortBy,
            "uniqueId": this.uniqueId,
            "pick": this.pick,
            "omit": this.omit,
            "findWhereJs": this.findWhereJs,
            "whereJs": this.whereJs,
            "isEqual": this.isEqual,
            "differenceJs": this.differenceJs,
            "toObject": this.toObject,
            "isEmpty": this.isEmpty,
            "setUrlQueryParams": this.setUrlQueryParams,
            "searchNestedObject": this.searchNestedObject,
            "changeTimeZone": this.changeTimeZone
        }, this);

        channel.on({
            "hideLoader": this.hideLoader,
            "hideLoadingModule": this.hideLoadingModule,
            "showLoader": this.showLoader,
            "setUiStyle": this.setUiStyle,
            "copyToClipboard": this.copyToClipboard
        }, this);

        // initial isMobileView setzen
        this.toggleIsViewMobile();

        this.listenTo(this, {
            "change:isViewMobile": function () {
                channel.trigger("isViewMobileChanged", this.get("isViewMobile"));
            }
        });

        $(window).on("resize", _.bind(this.toggleIsViewMobile, this));
        this.parseConfigFromURL();
    },

    /**
     * Returns current Master Portal Version Number
     * @returns {string} Masterportal version number
     */
    getMasterPortalVersionNumber: function () {
        return require("../../package.json").version;
    },

    /**
     * converts value to String and rewrites punctuation rules. The 1000 separator is "." and the decimal separator is a ","
     * @param  {String} value - feature attribute values
     * @returns {string} punctuated value
     */
    punctuate: function (value) {
        const pattern = /(-?\d+)(\d{3})/,
            stringValue = value.toString();

        let decimals,
            predecimals = stringValue;

        if (stringValue.indexOf(".") !== -1) {
            predecimals = stringValue.split(".")[0];
            decimals = stringValue.split(".")[1];
        }
        while (pattern.test(predecimals)) {
            predecimals = predecimals.replace(pattern, "$1.$2");
        }
        if (decimals) {
            return predecimals + "," + decimals;
        }
        return predecimals;
    },

    /**
     * This sort function sorts arrays, objects and strings. This is a replacement for underscores sortBy
     * @param {(Array|Object|String)} [list=undefined] the array, object or string to sort
     * @param {(String|Number|Function)} [iteratee=undefined] may be a function (value, key, list) returning a number to sort by or the name of the key to sort objects with
     * @param {Object} [context=undefined] the context to be used for iteratee, if iteratee is a function
     * @returns {Array}  a new list as array
     */
    sortBy: function (list, iteratee, context) {
        let sortArray = list,
            mapToSort = [];

        if (sortArray === null || typeof sortArray !== "object" && typeof sortArray !== "string") {
            return [];
        }

        if (typeof sortArray === "string") {
            sortArray = sortArray.split("");
        }

        if (typeof iteratee !== "function") {
            if (!Array.isArray(sortArray)) {
                sortArray = Object.values(sortArray);
            }

            // it is important to work with concat() on a copy of sortArray
            return sortArray.concat().sort((a, b) => {
                if (a === undefined) {
                    return 1;
                }
                else if (b === undefined) {
                    return -1;
                }
                else if (iteratee !== undefined) {
                    if (typeof a !== "object" || !a.hasOwnProperty(iteratee)) {
                        return 1;
                    }
                    else if (typeof b !== "object" || !b.hasOwnProperty(iteratee)) {
                        return -1;
                    }
                    else if (a[iteratee] > b[iteratee]) {
                        return 1;
                    }
                    else if (a[iteratee] < b[iteratee]) {
                        return -1;
                    }

                    return 0;
                }
                else if (a > b) {
                    return 1;
                }
                else if (a < b) {
                    return -1;
                }

                return 0;
            });
        }

        if (!Array.isArray(sortArray)) {
            let key;

            for (key in sortArray) {
                mapToSort.push({
                    idx: iteratee.call(context, sortArray[key], key, list),
                    obj: sortArray[key]
                });
            }
        }
        else {
            mapToSort = sortArray.map((value, key) => {
                return {
                    idx: iteratee.call(context, value, key, list),
                    obj: value
                };
            }, context);
        }

        mapToSort.sort((a, b) => {
            if (a.idx > b.idx) {
                return 1;
            }
            else if (a.idx < b.idx) {
                return -1;
            }

            return 0;
        });

        return mapToSort.map((value) => {
            return value.obj;
        });
    },

    /**
     * Sorting alorithm that distinguishes between array[objects] and other arrays.
     * arrays[objects] can be sorted by up to 2 object attributes
     * @param {String} type Type of sortAlgorithm
     * @param {array} input array that has to be sorted
     * @param {String} first first attribute an array[objects] has to be sorted by
     * @param {String} second second attribute an array[objects] has to be sorted by
     * @returns {array} sorted array
     */
    sort: function (type, input, first, second) {
        let sorted = input;
        const isArray = Array.isArray(sorted),
            isArrayOfObjects = isArray ? sorted.every(element => typeof element === "object") : false;

        if (isArray && !isArrayOfObjects) {
            sorted = this.sortArray(sorted);
        }
        else if (isArray && isArrayOfObjects) {
            sorted = this.sortObjects(type, sorted, first, second);
        }

        return sorted;
    },

    /**
     * Sorts an array.
     * @param {Array} input array to sort.
     * @returns {Array} sorted array
     */
    sortArray: function (input) {
        return input.sort(this.sortAlphaNum);
    },

    /**
     * Sorting function for alphanumeric sorting. First sorts alphabetically, then numerically.
     * @param {*} a First comparator.
     * @param {*} b Secons comparator.
     * @returns {Number} Sorting index.
     */
    sortAlphaNum: function (a, b) {
        const regExAlpha = /[^a-zA-Z]/g,
            regExNum = /[^0-9]/g,
            aAlpha = String(a).replace(regExAlpha, ""),
            bAlpha = String(b).replace(regExAlpha, "");
        let aNum,
            bNum,
            returnVal = -1;

        if (aAlpha === bAlpha) {
            aNum = parseInt(String(a).replace(regExNum, ""), 10);
            bNum = parseInt(String(b).replace(regExNum, ""), 10);
            if (aNum === bNum) {
                returnVal = 0;
            }
            else if (aNum > bNum) {
                returnVal = 1;
            }
        }
        else {
            returnVal = aAlpha > bAlpha ? 1 : -1;
        }
        return returnVal;
    },

    /**
     * Sorting function for numalpha sorting. First sorts numerically, then alphabetically.
     * @param {*} a First comparator.
     * @param {*} b Secons comparator.
     * @returns {Number} Sorting index.
     */
    sortNumAlpha: function (a, b) {
        const regExAlpha = /[^a-zA-Z]/g,
            regExNum = /[^0-9]/g,
            aAlpha = String(a).replace(regExAlpha, ""),
            bAlpha = String(b).replace(regExAlpha, ""),
            aNum = parseInt(String(a).replace(regExNum, ""), 10),
            bNum = parseInt(String(b).replace(regExNum, ""), 10);
        let returnVal = -1;

        if (aNum === bNum) {
            if (aAlpha === bAlpha) {
                returnVal = 0;
            }
            else if (aAlpha > bAlpha) {
                returnVal = 1;
            }
        }
        else {
            returnVal = aNum > bNum ? 1 : -1;
        }

        return returnVal;
    },

    /**
     * Sorting Function to sort address.
     * Expected string format to be "STREETNAME HOUSENUMBER_WITH_OR_WITHOUT_SUFFIX, *"
     * @param {String} aObj First comparator.
     * @param {String} bObj Secons comparator.
     * @returns {Number} Sorting index.
     */
    sortAddress: function (aObj, bObj) {
        const a = aObj.name,
            b = bObj.name,
            aIsValid = this.isValidAddressString(a, ",", " "),
            bIsValid = this.isValidAddressString(b, ",", " "),
            aSplit = this.splitAddressString(a, ",", " "),
            bSplit = this.splitAddressString(b, ",", " "),
            aFirstPart = aIsValid ? aSplit[0] : a,
            aSecondPart = aIsValid ? aSplit[1] : a,
            bFirstPart = bIsValid ? bSplit[0] : b,
            bSecondPart = bIsValid ? bSplit[1] : b;
        let returnVal = -1;

        if (aFirstPart > bFirstPart) {
            returnVal = 1;
        }
        if (aFirstPart === bFirstPart) {
            returnVal = this.sortNumAlpha(aSecondPart, bSecondPart);
        }

        return returnVal;
    },

    /**
     * Splits the address string.
     * @param {String} string Address string.
     * @param {String} separator Separator to separate the Address and Housenumber from other info such as zipCode or City.
     * @param {String} lastOccurrenceChar Character to separate the streetname from the housenumber.
     * @returns {String[]} - Array containing the splitted parts.
     */
    splitAddressString: function (string, separator, lastOccurrenceChar) {
        const splitBySeparator = string.split(separator),
            splittedString = [];

        splitBySeparator.forEach(split => {
            const lastOccurrence = split.lastIndexOf(lastOccurrenceChar),
                firstPart = split.substr(0, lastOccurrence).trim(),
                secondPart = split.substr(lastOccurrence).trim();

            splittedString.push(firstPart);
            splittedString.push(secondPart);
        });
        return splittedString;
    },

    /**
     * Checks if address string is valid for address sorting.
     * The string gets splitted by "separator". The occurrence of the "lastOcccurrenceChar" is checked.
     * @param {String} string String to check.
     * @param {String} separator Separator to separate Address (streetname and housenumber) from additional information (postal code, etc.).
     * @param {String} lastOccurrenceChar Charactor to separate the streetname from the housenumber.
     * @returns {Boolean} - Flag if string is valid.
     */
    isValidAddressString: function (string, separator, lastOccurrenceChar) {
        let isValidAddressString = false;
        const separatedString = string.split(separator),
            firstPartOfSeparatedString = separatedString[0];

        if (string.indexOf(separator) !== -1 && firstPartOfSeparatedString && firstPartOfSeparatedString.indexOf(lastOccurrenceChar) !== -1) {
            isValidAddressString = true;
        }

        return isValidAddressString;
    },

    /**
     * Sorts array of objects basend on the given type.
     * @param {String} type Type of sort algorithm.
     * @param {Object[]} input Array with object to be sorted.
     * @param {String} first First attribute to sort by.
     * @param {String} second Second attribute to sort by.
     * @returns {Object[]} - Sorted array of objects.
     */
    sortObjects: function (type, input, first, second) {
        let sortedObj = input;

        if (type === "address") {
            sortedObj = this.sortObjectsAsAddress(sortedObj, first);
        }
        else {
            sortedObj = this.sortObjectsNonAddress(sortedObj, first, second);
        }

        return sortedObj;
    },

    /**
     * Sorts Objects not as address.
     * @param {Object[]} input Array with object to be sorted.
     * @param {String} first First attribute to sort by.
     * @param {String} second Second attribute to sort by.
     * @returns {Object[]} - Sorted array of objects.
     */
    sortObjectsNonAddress: function (input, first, second) {
        let sortedObj = input;

        sortedObj = _.chain(input)
            .sortBy(function (element) {
                return element[second];
            })
            .sortBy(function (element) {
                return parseInt(element[first], 10);
            })
            .value();

        return sortedObj;
    },

    /**
     * Sorts array of objects as address using a special sorting alorithm
     * @param {Object[]} input Array with object to be sorted.
     * @returns {Object[]} - Sorted array of objects.
     */
    sortObjectsAsAddress: function (input) {
        return input.sort(this.sortAddress.bind(this));
    },

    /**
     * Kopiert den Inhalt des Event-Buttons in die Zwischenablage, sofern der Browser das Kommando akzeptiert.
     * behaviour of ios strange used solution from :
     * https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
     * @param  {el} el element to copy
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires Alerting#RadioTriggerAlertAlert
     * @returns {void}
     */
    copyToClipboard: function (el) {
        const oldReadOnly = el.readOnly,
            oldContentEditable = el.contentEditable,
            range = document.createRange(),
            selection = window.getSelection();

        el.readOnly = false;
        el.contentEditable = true;

        range.selectNodeContents(el);
        selection.removeAllRanges();
        if (!this.isInternetExplorer()) {
            selection.addRange(range);
        }
        el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

        el.readOnly = oldReadOnly;
        el.contentEditable = oldContentEditable;

        try {
            document.execCommand("copy");
            Radio.trigger("Alert", "alert", {
                text: i18next.t("common:modules.tools.saveSelection.contentSaved"),
                kategorie: "alert-info",
                position: "top-center",
                fadeOut: 5000
            });
        }
        catch (e) {
            Radio.trigger("Alert", "alert", {
                text: i18next.t("common:modules.tools.saveSelection.contenNotSaved"),
                kategorie: "alert-info",
                position: "top-center"
            });
        }
    },

    /**
     * Searches the userAgent for the string android.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isAndroid: function () {
        return navigator.userAgent.match(/Android/i);
    },

    /**
     * Searches the userAgent for the string iPhone, iPod or iPad.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isApple: function () {
        return navigator.userAgent.match(/iPhone|iPod|iPad/i);
    },

    /**
     * Searches the userAgent for the string opera.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isOpera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },

    /**
     * Searches the userAgent for the string windows.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isWindows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },

    /**
     * Searches the userAgent for the string chrome.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isChrome: function () {
        let isChrome = false;

        if ((/Chrome/i).test(navigator.userAgent)) {
            isChrome = true;
        }
        return isChrome;
    },

    /**
     * todo
     * @returns {*} todo
     */
    isAny: function () {
        return this.isAndroid() || this.isApple() || this.isOpera() || this.isWindows();
    },

    /**
     * Searches the userAgent for the string internet explorer.
     * @return {Array|null} Returns an array with the results. Returns zero if nothing is found.
     */
    isInternetExplorer: function () {
        let ie = false;

        if ((/MSIE 9/i).test(navigator.userAgent)) {
            ie = "IE9";
        }
        else if ((/MSIE 10/i).test(navigator.userAgent)) {
            ie = "IE10";
        }
        else if ((/rv:11.0/i).test(navigator.userAgent)) {
            ie = "IE11";
        }
        return ie;
    },

    /**
     * shows the loader gif
     * @fires Core#RadioTriggerUtilHideLoader
     * @returns {void}
     */
    showLoader: function () {
        this.incLoaderOverlayCounter();
        clearTimeout(this.get("loaderOverlayTimeoutReference"));
        this.setLoaderOverlayTimeoutReference(setTimeout(function () {
            Radio.trigger("Util", "hideLoader");
            this.setLoaderOverlayCounter(0);
        }.bind(this), 1000 * this.get("loaderOverlayTimeout")));
        $("#loader").show();
    },

    /**
     * hides the loder gif until the timeout has expired
     * @returns {void}
     */
    hideLoader: function () {
        this.decLoaderOverlayCounter();
        if (this.get("loaderOverlayCounter") <= 0) {
            $("#loader").hide();
        }
    },

    /**
     * hides the loading module until the timeout has expired
     * @returns {void}
     */
    hideLoadingModule: function () {
        $(".loading").fadeOut(this.get("fadeOut"));
    },

    /**
     * Setter for loaderOverlayTimeoutReference
     * @param {*} timeoutReference todo
     * @returns {void}
     */
    setLoaderOverlayTimeoutReference: function (timeoutReference) {
        this.set("loaderOverlayTimeoutReference", timeoutReference);
    },

    /**
     * search the path from the loader gif
     * @returns {String} path to loader gif
     */
    getPathFromLoader: function () {
        return $("#loader").children("img").first().attr("src");
    },

    /**
     * rewrites the URL by replacing the dots with underlined
     * @param {Stirng} url url to rewrite
     * @returns {String} proxy URL
     */
    getProxyURL: function (url) {
        const parser = document.createElement("a");
        let protocol = "",
            result = url,
            hostname = "",
            port = "";

        if (this.get("proxy")) {
            parser.href = url;
            protocol = parser.protocol;

            if (protocol.indexOf("//") === -1) {
                protocol += "//";
            }

            port = parser.port;

            if (!parser.hostname) {
                parser.hostname = window.location.hostname;
            }

            if (parser.hostname === "localhost" || !parser.hostname) {
                return url;
            }

            if (port) {
                result = url.replace(":" + port, "");
            }

            result = url.replace(protocol, "");
            // www und www2 usw. raus
            // hostname = result.replace(/www\d?\./, "");
            hostname = parser.hostname.split(".").join("_");
            result = this.get("proxyHost") + "/" + result.replace(parser.hostname, hostname);

        }
        return result;
    },

    /**
     * Setter for attribute isViewMobile
     * @param {boolean} value visibility
     * @return {void}
     */
    setIsViewMobile: function (value) {
        this.set("isViewMobile", value);
    },

    /**
     * Toggled the isViewMobile attribute when the window width exceeds or falls below 768px
     * @return {void}
     */
    toggleIsViewMobile: function () {
        if (window.innerWidth >= 768) {
            this.setIsViewMobile(false);
        }
        else {
            this.setIsViewMobile(true);
        }
    },

    /**
     * todo
     * @fires Alerting#RadioTriggerAlertAlert
     * @returns {void}
     */
    parseConfigFromURL: function () {
        const query = location.search.substr(1), // URL --> alles nach ? wenn vorhanden
            result = {};

        let config;

        query.split("&").forEach(function (keyValue) {
            const item = keyValue.split("=");

            result[item[0].toUpperCase()] = decodeURIComponent(item[1]); // item[0] = key; item[1] = value;
        });

        if (_.has(result, "CONFIG")) {
            config = _.values(_.pick(result, "CONFIG"))[0];

            if (config.slice(-5) === ".json") {
                this.setConfig(config);
            }
            else {
                Radio.trigger("Alert", "alert", {
                    text: "<strong>Der Parametrisierte Aufruf des Portals ist leider schief gelaufen!</strong>"
                        + "<br> Der URL-Paramater <strong>Config</strong> verlangt eine Datei mit der Endung \".json\"."
                        + "<br> Es wird versucht die config.json unter dem Standardpfad zu laden",
                    kategorie: "alert-warning"
                });
            }
        }
    },

    /**
     * converts an array of objects to csv
     * @param {object[]} data - array of object (no nested objects)
     * @param {string} colDeli - column delimiter
     * @param {string} lineDeli - line delimiter
     * @returns {string} csv
     */
    convertArrayOfObjectsToCsv: function (data, colDeli, lineDeli) {
        const keys = Object.keys(data[0]),
            columnDelimiter = colDeli || ",",
            lineDelimiter = lineDeli || "\n";

        // header line
        let result = keys.join(columnDelimiter) + lineDelimiter;

        data.forEach(function (item) {
            let colCounter = 0;

            keys.forEach(function (key) {
                if (colCounter > 0) {
                    result += columnDelimiter;
                }
                result += item[key];
                colCounter++;
            }, this);
            result += lineDelimiter;
        }, this);

        return result;
    },

    /**
     * replaces the names of object keys with the values provided.
     * @param {object} keysMap - keys mapping object
     * @param {object} obj - the original object
     * @returns {object} the renamed object
     */
    renameKeys: function (keysMap, obj) {
        return Object.keys(obj).reduce((acc, key) => {
            return {
                ...acc,
                ...{[keysMap[key] || key]: obj[key]}
            };
        },
        {});
    },

    /**
     * recursively replaces the names of object values with the values provided.
     * @param {object} valuesMap - values mapping object
     * @param {object} obj - the original object
     * @returns {object} the renamed object
     */
    renameValues: function (valuesMap, obj) {
        return Object.keys(obj).reduce((acc, key) => {
            if (obj[key]) {
                if (obj[key].constructor === Object) {
                    return {
                        ...acc,
                        ...{[key]: this.renameValues(valuesMap, obj[key])}
                    };
                }
            }
            return {
                ...acc,
                ...{[key]: valuesMap[obj[key]] || obj[key]}
            };
        },
        {});
    },

    /**
     * picks the key-value pairs corresponding to the given keys from an object.
     * @param {object} obj - the original object
     * @param {string[]} keys - the given keys to be returned
     * @returns {object} the picked object
     */
    pickKeyValuePairs: function (obj, keys) {
        const result = {};

        keys.forEach(function (key) {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
        });

        return result;
    },

    /**
     * Groups the elements of an array based on the given function.
     * Use Array.prototype.map() to map the values of an array to a function or property name.
     * Use Array.prototype.reduce() to create an object, where the keys are produced from the mapped results.
     * @param {array} arr - elements to group
     * @param {function} fn - reducer function
     * @returns {object} - the grouped object
     */
    groupBy: function (arr, fn) {
        return arr.map(typeof fn === "function" ? fn : val => val[fn]).reduce((acc, val, i) => {
            acc[val] = (acc[val] || []).concat(arr[i]);
            return acc;
        }, {});
    },

    /**
     * Generate a globally-unique id for client-side models or DOM elements that need one. If prefix is passed, the id will be appended to it.
     * @param {String} [prefix=""] prefix for the id
     * @returns {String}  a globally-unique id
     */
    uniqueId: function (prefix) {
        const idCounter = String(this.getIdCounter());

        this.incIdCounter();

        return prefix ? prefix + idCounter : idCounter;
    },

    /**
     * gets the current idCounter
     * @returns {Integer}  the current idCounter
     */
    getIdCounter: function () {
        return Util.idCounter;
    },

    /**
     * increments the idCounter
     * @post the static idCounter (Util.idCounter) is incremented by 1
     * @returns {Void}  -
     */
    incIdCounter: function () {
        Util.idCounter++;
    },

    /**
     * Setter for config
     * @param {*} value todo
     * @returns {void}
     */
    setConfig: function (value) {
        this.set("config", value);
    },

    /**
     * Setter for uiStyle
     * @param {*} value todo
     * @returns {void}
     */
    setUiStyle: function (value) {
        this.set("uiStyle", value);
    },

    /**
     * sets the loaderOverlayCounter to a specific number
     * @param {Integer} value the value to set the loaderOverlayCounter to
     * @returns {Void}  -
     */
    setLoaderOverlayCounter: function (value) {
        this.set("loaderOverlayCounter", value);
    },

    /**
     * increments the loaderOverlayCounter
     * @pre the loaderOverlayCounter is n
     * @post the loaderOverlayCounter is n + 1
     * @returns {Void}  -
     */
    incLoaderOverlayCounter: function () {
        this.setLoaderOverlayCounter(this.get("loaderOverlayCounter") + 1);
    },

    /**
     * decrements the loaderOverlayCounter
     * @pre the loaderOverlayCounter is n
     * @post the loaderOverlayCounter is n - 1
     * @returns {Void}  -
     */
    decLoaderOverlayCounter: function () {
        this.setLoaderOverlayCounter(this.get("loaderOverlayCounter") - 1);
    },
    /**
     * Refresh LayerTree dependant on TreeType
     * supports light and custom
     * @returns {void}
     */
    refreshTree: () => {
        let collection = null;

        switch (Radio.request("Parser", "getTreeType")) {
            case "classic":
                collection = Radio.request("ModelList", "getCollection");

                collection.trigger("updateClassicTree");
                break;
            case "light":
                Radio.trigger("ModelList", "refreshLightTree");
                break;
            default:
                Radio.trigger("ModelList", "renderTree");
        }
    },

    /**
     * Return a copy of the object, filtered to only have values for the whitelisted keys
     * (or array of valid keys).
     * @param {Object} object - the object.
     * @param {Number[]|String[]} keys - the key(s) to search for.
     * @returns {Object} - returns the entry/entries with the right key/keys.
     */
    pick: function (object, keys) {
        return keys.reduce((obj, key) => {
            if (object && object.hasOwnProperty(key)) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    },

    /**
     * Returns a copy of the object, filtered to omit the keys specified
     * (or array of blacklisted keys).
     * @param {Object} object - the object.
     * @param {Number[]} blacklist - blacklisted keys
     * @returns {Object} - returns the entry/entries without the blacklisted key/keys.
     */
    omit: function (object, blacklist) {
        const keys = Object.keys(object ? object : {}),
            filteredKeys = keys.filter(key => !blacklist.includes(key)),
            filteredObj = filteredKeys.reduce((result, key) => {
                result[key] = object[key];
                return result;
            }, {});

        return filteredObj;
    },

    /**
     *  Looks through the list and returns the first value that matches all of the key-value pairs listed in properties
     * @param {Object[]} [list=[]] - the list.
     * @param {Object} properties property/entry to search for.
     * @returns {Object} - returns the first value/entry, that matches.
     */
    findWhereJs: function (list = [], properties = "") {
        return list.find(
            item => Object.keys(properties).every(
                key => item[key] === properties[key]
            )
        );
    },

    /**
     *  Looks through each value in the list, returning an array of all the values that matches the key-value pairs listed in properties
     * @param {Object[]} [list=[]] - the list.
     * @param {Object} properties property/entry to search for.
     * @returns {array} - returns an array of all the values that matches.
     */
    whereJs: function (list = [], properties = "") {
        return list.filter(
            item => Object.keys(properties).every(
                key => item[key] === properties[key]
            )
        );
    },

    /**
     * Looks through each value in the array a, returning an array of all the values that are not present in the array b
     * @param {array} [a=[]] - elements to check
     * @param {array} [b=[]] - elements to check
     * @returns {array} - returns diffrence between array a and b
     */
    differenceJs: function (a = [], b = []) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0) {
            return [];
        }
        if (b.length === 0) {
            return a;
        }
        return a.filter(e => !b.includes(e));
    },

    /**
     * Check if two objects are same
     * @param {Object} first the first object
     * @param {Object} second the second object
     * @returns {Boolean} true or false
     */
    isEqual: function (first, second) {
        // If the value of either variable is empty, we can instantly compare them and check for equality.
        if (first === null || first === undefined || second === null || second === undefined) {
            return first === second;
        }

        // If neither are empty, we can check if their constructors are equal. Because constructors are objects, if they are equal, we know the objects are of the same type (though not necessarily of the same value).
        if (first.constructor !== second.constructor) {
            return false;
        }

        // If we reach this point, we know both objects are of the same type so all we need to do is check what type one of the objects is, and then compare them
        if (first instanceof Function || first instanceof RegExp) {
            return first === second;
        }

        // Throught back to the equlity check we started with. Just incase we are comparing simple objects.
        if (first === second || first.valueOf() === second.valueOf()) {
            return true;
        }

        // If the value of check we saw above failed and the objects are Dates, we know they are not Dates because Dates would have equal valueOf() values.
        if (first instanceof Date) {
            return false;
        }

        // If the objects are arrays, we know they are not equal if their lengths are not the same.
        if (Array.isArray(first) && first.length !== second.length) {
            return false;
        }

        // If we have gotten to this point, we need to just make sure that we are working with objects so that we can do a recursive check of the keys and values.
        if (!(first instanceof Object) || !(second instanceof Object)) {
            return false;
        }

        // We now need to do a recursive check on all children of the object to make sure they are deeply equal
        const firstKeys = Object.keys(first),
            // Here we just make sure that all the object keys on this level of the object are the same.
            allKeysExist = Object.keys(second).every(
                i => firstKeys.indexOf(i) !== -1
            ),

            // Finally, we pass all the values of our of each object into this function to make sure everything matches
            allKeyValuesMatch = firstKeys.every(
                i => this.isEqual(first[i], second[i])
            );

        return allKeysExist && allKeyValuesMatch;
    },

    /**
     * Converts lists into objects
     * @param {Array} list to be converted
     * @param {Array} values the corresponding values of parallel array
     * @returns {Object} result
     */
    toObject: function (list, values) {
        const result = {};

        for (let i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            }
            else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    },

    /**
     * Checks if value is an empty object or collection.
     * @param {Object} obj the object to be checked
     * @returns {boolean} true or false
     */
    isEmpty: function (obj) {
        return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
    },

    /**
     * helper function to find a key in nested object
     * @param {object} obj object to search
     * @param {string} key name of key to search for
     * @return {mixed} returns value for the given key or null if not found
     */
    searchNestedObject: function (obj, key) {
        let result;

        if (obj instanceof Array) {
            for (let i = 0; i < obj.length; i++) {
                result = this.searchNestedObject(obj[i], key);
                if (result) {
                    break;
                }
            }
        }
        else {
            for (const prop in obj) {
                if (prop === key) {
                    return obj;
                }
                if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
                    result = this.searchNestedObject(obj[prop], key);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    },

    /*
     * change the timzone for the historicalData
     *
     * @param  {Object[]} historicalData data from feature
     * @param  {Object[]} utc timezone
     * @return {Object[]} data
     */
    changeTimeZone: function (historicalData, utc) {
        const data = historicalData === undefined ? [] : historicalData;

        data.forEach(loadingPointData => {
            if (loadingPointData.Observations !== undefined) {
                loadingPointData.Observations.forEach(obs => {
                    const phenomenonTime = obs.phenomenonTime,
                        utcAlgebraicSign = utc.substring(0, 1),
                        utcString = utc === undefined ? "+1" : utc;
                    let utcSub,
                        utcNumber;

                    if (utcString.length === 2) {
                        // check for winter- and summertime
                        utcSub = parseInt(utcString.substring(1, 2), 10);
                        utcSub = moment(phenomenonTime).isDST() ? utcSub + 1 : utcSub;
                        utcNumber = "0" + utcSub + "00";
                    }
                    else if (utcString.length > 2) {
                        utcSub = parseInt(utcString.substring(1, 3), 10);
                        utcSub = moment(phenomenonTime).isDST() ? utcSub + 1 : utcSub;
                        utcNumber = utc.substring(1, 3) + "00";
                    }

                    obs.phenomenonTime = moment(phenomenonTime).utcOffset(utcAlgebraicSign + utcNumber).format("YYYY-MM-DDTHH:mm:ss");
                });
            }
        });
        return data;
    }
}, {
    // globally-unique id for Util.uniqueId([prefix]) - this is a static backbone variable (Util.idCounter)
    idCounter: 1
});

export default Util;

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
        var channel = Radio.channel("Util");

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
            "convertArrayElementsToString": this.convertArrayElementsToString,
            "getPathFromLoader": this.getPathFromLoader,
            "renameKeys": this.renameKeys,
            "renameValues": this.renameValues,
            "pickKeyValuePairs": this.pickKeyValuePairs,
            "groupBy": this.groupBy,
            "pick": this.pick,
            "omit": this.omit,
            "findWhereJs": this.findWhereJs
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
        var pattern = /(-?\d+)(\d{3})/,
            stringValue = value.toString(),
            decimals,
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
        var oldReadOnly = el.readOnly,
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
        var isChrome = false;

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
        var ie = false;

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
        var parser = document.createElement("a"),
            protocol = "",
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
        var query = location.search.substr(1), // URL --> alles nach ? wenn vorhanden
            result = {},
            config;

        query.split("&").forEach(function (keyValue) {
            var item = keyValue.split("=");

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
        var result = {};

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
     * Return a copy of the object, filtered to only have values for the whitelisted keys
     * (or array of valid keys).
     * @param {Object} object - the object.
     * @param {Number[]} keys - the key(s) to search for.
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
     * @param {Object} object - The object.
     * @param {Number[]|String[]|Boolean[]} blacklist - Blacklisted keys.
     * @returns {Object} - returns the entry/entries without the blacklisted key/keys.
     */
    omit: function (object, blacklist) {
        const keys = Object.keys(object ? object : {}),
            blacklistWithStrings = this.convertArrayElementsToString(blacklist),
            filteredKeys = keys.filter(key => !blacklistWithStrings.includes(key)),
            filteredObj = filteredKeys.reduce((result, key) => {
                result[key] = object[key];
                return result;
            }, {});

        return filteredObj;
    },

    /**
     * Converts elements of an array to strings.
     * @param {Number[]|String[]|Boolean[]} [array=[]] - Array with elements.
     * @returns {String[]} Array with elements as string.
     */
    convertArrayElementsToString: function (array = []) {
        let realArray = [];
        const arrayWithStrings = [];

        if (!Array.isArray(array)) {
            realArray = [array];
        }
        else {
            realArray = array;
        }
        realArray.forEach(element => arrayWithStrings.push(String(element)));

        return arrayWithStrings;
    },

    /** Looks through the list and returns the firts value that matches all of the key-value pairs
     * listed in hitId.
     * @param {Object[]} [list=[]] - the list.
     * @param {Object} [findId=""] - the id/entry to search for.
     * @returns {Object} - returns the first value/entry, that matches.
     */
    findWhereJs: function (list = [], findId = "") {
        return list.find(
            item => Object.keys({id: findId}).every(
                key => item[key] === {id: findId}[key]
            )
        );
    }
});

export default Util;

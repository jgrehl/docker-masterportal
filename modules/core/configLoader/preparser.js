import DefaultTreeParser from "./parserDefaultTree";
import CustomTreeParser from "./parserCustomTree";

const Preparser = Backbone.Model.extend(/** @lends Preparser.prototype */{
    defaults: {
        defaultConfigPath: "config.json"
    },
    /**
     * @class Preparser
     * @extends Backbone.Model
     * @memberof Core.ConfigLoader
     * @constructs
     * @fires Core#RadioRequestUtilGetConfig
     * @fires Alerting#RadioTriggerAlertAlert
     * @description Loading and preperation for parsing (calls parser for default or custom tree) of the configuration file (config.json).
     * @param {*} attributes todo
     * @param {*} options todo
     */
    initialize: function (attributes, options) {
        const defaultConfigPath = this.get("defaultConfigPath");

        this.url = this.getUrlPath(options.url, this.requestConfigFromUtil(), defaultConfigPath);
        this.fetchData(defaultConfigPath);
    },

    /**
     * Fetches the Data from the config.json.
     * @param {string} defaultConfigPath The default path to config.json
     * @returns {void}
     */
    fetchData: function (defaultConfigPath) {
        this.fetch({async: false,
            error: function (model, xhr, error) {
                const statusText = xhr.statusText;
                let message,
                    position,
                    snippet,
                    textStatus;

                // SyntaxError for consoletesting, propably because of older version.
                if (statusText === "Not Found" || statusText.indexOf("SyntaxError") !== -1) {
                    Radio.trigger("Alert", "alert", {
                        text: "<strong>Die Datei \"" + model.url + "\" ist nicht vorhanden!</strong>"
                        + "<br> Es wird versucht die config.json unter dem Standardpfad zu laden",
                        kategorie: "alert-warning"
                    });
                    if (this.url !== defaultConfigPath) {
                        this.url = defaultConfigPath;
                        this.fetchData(defaultConfigPath);
                    }
                }
                else {
                    message = error.errorThrown.message;
                    position = parseInt(message.substring(message.lastIndexOf(" ")), 10);
                    snippet = xhr.responseText.substring(position - 30, position + 30);
                    textStatus = error.textStatus;
                    Radio.trigger("Alert", "alert", {
                        text: "<strong>Die Datei '" + model.url + "' konnte leider nicht geladen werden!</strong> <br> " +
                        "<small>Details: " + textStatus + " - " + error.errorThrown.message + ".</small><br>" +
                        "<small>Auszug:" + snippet + "</small>",
                        kategorie: "alert-warning"
                    });
                    if (textStatus === "parsererror") {
                        // reload page once
                        if (window.localStorage) {
                            if (!localStorage.getItem("firstLoad")) {
                                localStorage.firstLoad = true;
                                window.location.reload();
                            }
                            else {
                                localStorage.removeItem("firstLoad");
                            }
                        }
                    }
                }
            }.bind(this)
        });
    },

    /**
    * Request config path from util.
    * This seperate helper method enables unit tests of the getUrlPath-method.
    * @fires Util#RadioRequestGetConfig
    * @return {string} relative path or absolute url to config file
    */
    requestConfigFromUtil: function () {
        return Radio.request("Util", "getConfig");
    },

    /**
    * Build url to config file. Decide between absolute or relative path.
    * @param {string} [configJsonPathFromConfig=""] - url for the config.json configured in config.js
    * @param {string} [configJsonPathFromUrl=""] - The config parameter from the url, which parsed in util.
    * @param {string} [defaultConfigPath="config.json"] The default path to config.json
    * @return {string} url to config file
    */
    getUrlPath: function (configJsonPathFromConfig = "", configJsonPathFromUrl = "", defaultConfigPath = "config.json") {
        const defaultFormat = ".json";
        let targetPath = defaultConfigPath;

        if (configJsonPathFromConfig.slice(-5) !== defaultFormat && configJsonPathFromUrl.slice(-5) === defaultFormat && configJsonPathFromUrl.slice(0, 4) !== "http") {
            targetPath = configJsonPathFromConfig + configJsonPathFromUrl;
        }
        else if (configJsonPathFromUrl.slice(-5) === defaultFormat) {
            targetPath = configJsonPathFromUrl;
        }
        else if (configJsonPathFromConfig.slice(-5) === defaultFormat) {
            targetPath = configJsonPathFromConfig;
        }

        return targetPath;
    },

    /**
    * todo
    * @param {*} response todo
    * @returns {*} todo
    */
    parse: function (response) {
        var attributes = {
            portalConfig: response.Portalconfig,
            baselayer: response.Themenconfig.Hintergrundkarten,
            overlayer: response.Themenconfig.Fachdaten,
            overlayer_3d: response.Themenconfig.Fachdaten_3D,
            treeType: _.has(response.Portalconfig, "treeType") ? response.Portalconfig.treeType : "light",
            isFolderSelectable: this.parseIsFolderSelectable(_.property(["tree", "isFolderSelectable"])(Config)),
            snippetInfos: this.requestSnippetInfos()
        };

        /**
         * this.updateTreeType
         * @deprecated in 3.0.0
         */
        attributes = this.updateTreeType(attributes, response);

        if (attributes.treeType === "default") {
            new DefaultTreeParser(attributes);
        }
        else {
            new CustomTreeParser(attributes);
        }

        /**
         * changeLgvContainer
         * @deprecated in 3.0.0
         */
        this.changeLgvContainer();
    },

    /**
     * Update the preparsed treeType from attributes to be downward compatible.
     * @param {Object} attributes Preparased portalconfig attributes.
     * @param {Object} response  Config from config.json.
     * @returns {Object} - Attributes with mapped treeType
     * @deprecated in 3.0.0. Remove whole function and call!
     */
    updateTreeType: function (attributes, response) {
        if (_.has(response.Portalconfig, "treeType")) {
            attributes.treeType = response.Portalconfig.treeType;
        }
        else if (_.has(response.Portalconfig, "Baumtyp")) {
            attributes.treeType = response.Portalconfig.Baumtyp;
            console.warn("Attribute 'Baumtyp' is deprecated. Please use 'treeType' instead.");
        }
        else {
            attributes.treeType = "light";
        }
        return attributes;
    },

    /**
     * Changing the lgv-container to masterportal-container
     * @returns {void} - no returned value
     * @deprecated in 3.0.0. Remove whole function and call!
     */
    changeLgvContainer: function () {
        var container = $("div.lgv-container");

        if (container.length) {
            container.removeClass("lgv-container").addClass("masterportal-container");
            console.warn("Div container 'lgv-container' is deprecated. Please use 'masterportal-container' instead.");
        }
        return false;
    },
    /**
    * todo
    * @param {*} globalFlag todo
    * @returns {*} todo
    */
    parseIsFolderSelectable: function (globalFlag) {
        if (globalFlag === false) {
            return false;
        }
        return true;
    },

    /**
    * todo
    * @returns {*} todo
    */
    requestSnippetInfos: function () {
        var infos,
            url;

        if (_.has(Config, "infoJson")) {
            url = Config.infoJson;
        }

        if (!_.isUndefined(url)) {
            $.ajax({
                url: url,
                async: false,
                success: function (data) {
                    infos = data;
                }
            });
        }
        return infos;
    }
});

export default Preparser;

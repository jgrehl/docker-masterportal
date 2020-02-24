import Layer from "./model";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import VectorLayer from "ol/layer/Vector.js";
import {GeoJSON} from "ol/format.js";

const GeoJSONLayer = Layer.extend(/** @lends GeoJSONLayer.prototype */{
    defaults: _.extend({}, Layer.prototype.defaults, {
        supported: ["2D", "3D"],
        isClustered: false,
        altitudeMode: "clampToGround"
    }),

    /**
     * @class GeoJSONLayer
     * @description Module to represent GeoJSONLayer
     * @extends Layer
     * @constructs
     * @memberof Core.ModelList.Layer
     * @property {String[]} supported=["2D", "3D"] Supported modes "2D" and / or "3D"
     * @property {Boolean} isClustered=[false] Distance to group features to clusters
     * @fires StyleList#RadioRequestReturnModelById
     * @fires MapView#RadioRequestGetProjection
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires Util#RadioTriggerUtilHideLoader
     * @fires RemoteInterface#RadioTriggerPostMessage
     * @fires Layer#RadioTriggerVectorLayerResetFeatures
     * @listens Layer#RadioRequestVectorLayerGetFeatures
     */
    initialize: function () {

        this.checkForScale(Radio.request("MapView", "getOptions"));

        if (!this.get("isChildLayer")) {
            Layer.prototype.initialize.apply(this);
        }

        if (this.has("clusterDistance")) {
            this.set("isClustered", true);
        }
    },

    /**
     * Triggert by Layer to create a layerSource respectively a clusterLayerSource
     * @returns {void}
     */
    createLayerSource: function () {
        this.setLayerSource(new VectorSource());
        if (this.has("clusterDistance")) {
            this.createClusterLayerSource();
        }
    },

    /**
     * Triggert by createLayerSource to create a clusterLayerSource
     * @returns {void}
     */
    createClusterLayerSource: function () {
        this.setClusterLayerSource(new Cluster({
            source: this.get("layerSource"),
            distance: this.get("clusterDistance")
        }));
    },

    /**
     * Triggert by Layer to create a ol/layer/Vector
     * @fires MapView#RadioRequestGetProjection
     * @returns {void}
     */
    createLayer: function () {
        this.setLayer(new VectorLayer({
            source: this.has("clusterDistance") ? this.get("clusterLayerSource") : this.get("layerSource"),
            name: this.get("name"),
            typ: this.get("typ"),
            gfiAttributes: this.get("gfiAttributes"),
            routable: this.get("routable"),
            gfiTheme: this.get("gfiTheme"),
            id: this.get("id"),
            altitudeMode: this.get("altitudeMode"),
            hitTolerance: this.get("hitTolerance")
        }));

        if (_.isUndefined(this.get("geojson"))) {
            this.updateSource();
        }
        else {
            this.handleData(this.get("geojson"));
        }
    },

    /**
     * Setter for clusterLayerSource
     * @param {ol.source.vector} value clusterLayerSource
     * @returns {void}
     */
    setClusterLayerSource: function (value) {
        this.set("clusterLayerSource", value);
    },

    /**
     * Sends GET request with or without wfs parameter according to typ
     * @param  {boolean} [showLoader=false] shows loader div
     * @returns {void}
     */
    updateSource: function (showLoader) {
        const typ = this.get("typ"),
            url = Radio.request("Util", "getProxyURL", this.get("url")),
            xhr = new XMLHttpRequest(),
            that = this;

        let paramUrl;

        if (typ === "WFS") {
            paramUrl = url + "?REQUEST=GetFeature&SERVICE=WFS&TYPENAME=" + this.get("featureType") + "&OUTPUTFORMAT=application/geo%2Bjson&VERSION=" + this.get("version");
        }
        else if (typ === "GeoJSON") {
            paramUrl = url;
        }

        if (showLoader) {
            Radio.trigger("Util", "showLoader");
        }

        xhr.open("GET", paramUrl, true);
        xhr.timeout = 10000;
        xhr.onload = function (event) {
            that.handleResponse(event.currentTarget.responseText, xhr.status, showLoader);
            that.expandFeaturesBySubTyp(that.get("subTyp"));
        };
        xhr.ontimeout = function () {
            that.handleResponse({}, "timeout", showLoader);
        };
        xhr.onabort = function () {
            that.handleResponse({}, "abort", showLoader);
        };
        xhr.send();
    },

    /**
     * Handles the xhr response
     * @fires MapView#RadioRequestGetProjection
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires Util#RadioTriggerUtilHideLoader
     * @param {string} responseText response as GeoJson
     * @param {integer|string} status status of xhr-request
     * @param {boolean} [showLoader=false] Flag to show Loader
     * @returns {void}
     */
    handleResponse: function (responseText, status, showLoader) {
        if (status === 200) {
            this.handleData(responseText);
        }
        else {
            Radio.trigger("Alert", "alert", "Datenabfrage fehlgeschlagen. (Technische Details: " + status + ")");
        }

        if (showLoader) {
            Radio.trigger("Util", "hideLoader");
        }
    },

    /**
     * Takes the response, parses the geojson and creates ol.features.
     * @fires RemoteInterface#RadioTriggerPostMessage
     * @param   {string} data   response as GeoJson
     * @returns {void}
     */
    handleData: function (data) {
        var mapCrs = Radio.request("MapView", "getProjection"),
            jsonCrs = this.getJsonProjection(data),
            features = this.parseDataToFeatures(data, mapCrs, jsonCrs),
            newFeatures = [],
            isClustered = this.has("clusterDistance");

        if (!features) {
            return;
        }

        this.addId(features);
        this.get("layerSource").clear(true);
        this.get("layerSource").addFeatures(features);
        this.get("layer").setStyle(this.get("styleFunction"));

        // für it-gbm
        if (!this.has("autoRefresh")) {
            features.forEach(function (feature) {
                feature.set("extent", feature.getGeometry().getExtent());
                newFeatures.push(_.omit(feature.getProperties(), ["geometry", "geometry_EPSG_25832", "geometry_EPSG_4326"]));
            });
            Radio.trigger("RemoteInterface", "postMessage", {"allFeatures": JSON.stringify(newFeatures), "layerId": this.get("id")});
        }
        this.prepareFeaturesFor3D(features);
        this.featuresLoaded(features);
        if (!_.isUndefined(features)) {
            this.styling(isClustered);
            this.get("layer").setStyle(this.get("style"));
        }
    },

    /**
     * create style, function triggers to style_v2.json
     * @param  {boolean} isClustered - should
     * @fires VectorStyle#RadioRequestStyleListReturnModelById
     * @returns {void}
     */
    styling: function (isClustered) {
        var stylelistmodel = Radio.request("StyleList", "returnModelById", this.get("styleId"));

        if (!_.isUndefined(stylelistmodel)) {
            this.setStyle(function (feature) {
                return stylelistmodel.createStyle(feature, isClustered);
            });
        }
    },

    /**
     * Takes the data string to extract the crs definition. According to the GeoJSON Specification (RFC 7946) the geometry is expected to be in EPSG:4326.
     * For downward compatibility a crs tag can be used.
     * @see https://tools.ietf.org/html/rfc7946
     * @see https://geojson.org/geojson-spec#named-crs
     * @param   {string} data   response as GeoJson
     * @returns {string} epsg definition
     */
    getJsonProjection: function (data) {
        // using indexOf method to increase performance
        const dataString = data.replace(/\s/g, ""),
            startIndex = dataString.indexOf("\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"");

        if (startIndex !== -1) {
            const endIndex = dataString.indexOf("\"", startIndex + 43);

            return dataString.substring(startIndex + 43, endIndex);
        }

        return "EPSG:4326";
    },

    /**
     * Tries to parse data string to ol.format.GeoJson
     * @param   {string} data string to parse
     * @param   {ol/proj/Projection} mapProjection target projection to parse features into
     * @param   {string} jsonProjection projection of the json
     * @throws Will throw an error if the argument cannot be parsed.
     * @returns {object} ol/format/GeoJSON/features
     */
    parseDataToFeatures: function (data, mapProjection, jsonProjection) {
        const geojsonReader = new GeoJSON({
            featureProjection: mapProjection,
            dataProjection: jsonProjection
        });
        let jsonObjects;

        try {
            jsonObjects = geojsonReader.readFeatures(data);
        }
        catch (err) {
            console.error("GeoJSON cannot be parsed.");
        }
        return jsonObjects;
    },

    /**
     * Requests the latest sensorValues from OpenSenseMap.
     * @param {String} subTyp SubTyp of layer.
     * @returns {void}
     */
    expandFeaturesBySubTyp: function (subTyp) {
        const expandedFeatures = this.get("layerSource").getFeatures();

        if (subTyp === "OpenSenseMap") {
            expandedFeatures.forEach(feature => {
                const sensors = feature.get("sensors");

                sensors.forEach(sensor => {
                    const sensorId = sensor._id,
                        name = sensor.title.toLowerCase() || "unnamedSensor",
                        unit = sensor.unit || "",
                        type = sensor.sensorType || "unnamedSensorType";

                    this.getValueFromOpenSenseMapSensor(feature, sensorId, name, unit, type);
                });
            });
        }
        else if (subTyp !== undefined) {
            console.error("Subtype " + subTyp + " is not yet supported for GeoJSON-Layer.");
        }
    },

    /**
     * Sends async request to get the newest measurement of each sensor per feature.
     * Async so that the user can already navigate in the map without waiting for all sensorvalues for all features.
     * @param {Feature} feature The current Feature.
     * @param {String} sensorId Id of sensor.
     * @param {String} name Name of sensor.
     * @param {String} unit Unit of sensor.
     * @param {String} type Type of sensor.
     * @returns {void}
     */
    getValueFromOpenSenseMapSensor: function (feature, sensorId, name, unit, type) {
        const xhr = new XMLHttpRequest(),
            async = true,
            that = this,
            boxId = feature.get("_id");
        let url = "https://api.opensensemap.org/boxes/" + boxId + "/data/" + sensorId;

        url = Radio.request("Util", "getProxyURL", url);
        xhr.open("GET", url, async);
        xhr.onload = function (event) {
            let response = JSON.parse(event.currentTarget.responseText);

            response = response.length > 0 ? response[0] : undefined;
            that.setOpenSenseMapSensorValues(feature, response, name, unit, type);
        };
        xhr.send();
    },

    /**
     * Sets the latest measurements of the opensensemap sensors at the feature.
     * @param {Feature} feature The feature.
     * @param {JSON} response The parsed response as JSON.
     * @param {String} name Name of sensor.
     * @param {String} unit Unit of sensor.
     * @param {String} type Type of sensor.
     * @returns {void}
     */
    setOpenSenseMapSensorValues: function (feature, response, name, unit, type) {
        if (response) {
            feature.set(name, response.value + " " + unit);
            feature.set(name + "_createdAt", response.createdAt);
            feature.set(name + "_sensorType", type);
        }
    },

    /**
     * Ensures all given features have an id
     * @param {ol/feature[]} features features
     * @returns {void}
     */
    addId: function (features) {
        features.forEach(function (feature) {
            const id = feature.get("id") || _.uniqueId();

            feature.setId(id);
        });
    },

    /**
     * creates the legendUrl used by layerinformation
     * @fires StyleList#RadioRequestReturnModelById
     * @returns {void}
     */
    createLegendURL: function () {
        let style;

        if (!_.isUndefined(this.get("legendURL")) && !this.get("legendURL").length) {
            style = Radio.request("StyleList", "returnModelById", this.get("styleId"));

            if (!_.isUndefined(style)) {
                this.setLegendURL([style.get("imagePath") + style.get("imageName")]);
            }
        }
    },

    /**
     * Filters the visibility of features by ids.
     * @param  {String[]} featureIdList Feature ids to be shown.
     * @fires Layer#RadioTriggerVectorLayerResetFeatures
     * @return {void}
     */
    showFeaturesByIds: function (featureIdList) {
        const features = [];

        this.hideAllFeatures();
        _.each(featureIdList, function (id) {
            var feature = this.get("layerSource").getFeatureById(id);

            if (feature !== null) {
                feature.setStyle(undefined);
                features.push(feature);
            }
        }, this);
        Radio.trigger("VectorLayer", "resetFeatures", this.get("id"), features);
    },

    /**
     * sets null style (=no style) for all features
     * @return {void}
     */
    hideAllFeatures: function () {
        var collection = this.get("layerSource").getFeatures();

        collection.forEach(function (feature) {
            feature.setStyle(function () {
                return null;
            });
        }, this);
    },

    /**
     * sets undefined style for all features so the layer style will be used
     * @returns {void}
     */
    showAllFeatures: function () {
        var collection = this.get("layerSource").getFeatures();

        collection.forEach(function (feature) {
            feature.setStyle(undefined);
        }, this);
    },

    // setter for style
    setStyle: function (value) {
        this.set("style", value);
    },

    // setter for legendURL
    setLegendURL: function (value) {
        this.set("legendURL", value);
    }
});

export default GeoJSONLayer;

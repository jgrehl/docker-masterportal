import Layer from "./model";
import mqtt from "mqtt";
import moment from "moment";
import {Cluster, Vector as VectorSource} from "ol/source.js";
import VectorLayer from "ol/layer/Vector.js";
import {transformToMapProjection} from "masterportalAPI/src/crs";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";

const SensorLayer = Layer.extend({
    defaults: _.extend({}, Layer.prototype.defaults,
        {
            epsg: "EPSG:4326",
            utc: "+1",
            version: "1.0",
            useProxyURL: false,
            mqttPath: "/mqtt"
        }),

    initialize: function () {

        this.checkForScale(Radio.request("MapView", "getOptions"));

        if (!this.get("isChildLayer")) {
            Layer.prototype.initialize.apply(this);
        }

        // change language from moment.js to german
        moment.locale("de");
    },

    /**
     * creates ol.source.Vector as LayerSource
     * @returns {void}
     */
    createLayerSource: function () {
        this.setLayerSource(new VectorSource());
        if (this.has("clusterDistance")) {
            this.createClusterLayerSource();
        }
    },

    /**
     * creates the layer and trigger to updateData
     * @returns {void}
     */
    createLayer: function () {
        this.setLayer(new VectorLayer({
            source: this.has("clusterDistance") ? this.get("clusterLayerSource") : this.get("layerSource"),
            name: this.get("name"),
            typ: this.get("typ"),
            gfiAttributes: this.get("gfiAttributes"),
            gfiTheme: _.isObject(this.get("gfiTheme")) ? this.get("gfiTheme").name : this.get("gfiTheme"),
            routable: this.get("routable"),
            id: this.get("id")
        }));

        this.updateData();

        Radio.trigger("HeatmapLayer", "loadInitialData", this.get("id"), this.get("layerSource").getFeatures());
    },

    /**
     * create ClusterLayerSourc
     * @returns {void}
     */
    createClusterLayerSource: function () {
        this.setClusterLayerSource(new Cluster({
            source: this.get("layerSource"),
            distance: this.get("clusterDistance")
        }));
    },

    /**
     * initial loading of sensor data function
     * differences by subtypes
     * @returns {void}
     */
    updateData: function () {
        var sensorData,
            features,
            isClustered = this.has("clusterDistance"),
            url = this.get("useProxyURL") ? Radio.request("Util", "getProxyURL", this.get("url")) : this.get("url"),
            version = this.get("version"),
            urlParams = this.get("urlParameter"),
            epsg = this.get("epsg"),
            mergeThingsByCoordinates = this.get("mergeThingsByCoordinates") || false;

        sensorData = this.loadSensorThings(url, version, urlParams, mergeThingsByCoordinates);
        features = this.createFeatures(sensorData, epsg);

        // Add features to vectorlayer
        if (!_.isEmpty(features)) {
            this.get("layerSource").addFeatures(features);
        }

        // connection to live update
        this.createMqttConnectionToSensorThings(features);

        if (!_.isUndefined(features)) {
            this.styling(isClustered);
            this.get("layer").setStyle(this.get("style"));
        }
    },

    /**
     * get response from a given URL
     * @param  {String} requestUrl - to request sensordata
     * @return {objects} response with sensorObjects
     */
    getResponseFromRequestUrl: function (requestUrl) {
        var response;

        Radio.trigger("Util", "showLoader");
        $.ajax({
            dataType: "json",
            url: requestUrl,
            async: false,
            type: "GET",
            context: this,

            // handling response
            success: function (resp) {
                Radio.trigger("Util", "hideLoader");
                response = resp;
            },
            error: function () {
                Radio.trigger("Util", "hideLoader");
                Radio.trigger("Alert", "alert", {
                    text: "<strong>Unerwarteter Fehler beim Laden der Sensordaten des Layers " +
                        this.get("name") + " aufgetreten</strong>",
                    kategorie: "alert-danger"
                });
            }
        });

        return response;
    },
    /**
     * draw points on the map
     * @param  {array} sensorData - sensor with location and properties
     * @param  {Sting} epsg - from Sensortype
     * @return {Ol.Features} feature to draw
     */
    createFeatures: function (sensorData, epsg) {
        var features = [];

        _.each(sensorData, function (data, index) {
            var xyTransform,
                feature;

            if (data.hasOwnProperty("location") && data.location && !_.isUndefined(epsg)) {
                xyTransform = transformToMapProjection(Radio.request("Map", "getMap"), epsg, data.location);
                feature = new Feature({
                    geometry: new Point(xyTransform)
                });
            }
            else {
                return;
            }

            feature.setId(index);
            feature.setProperties(data.properties);

            // for a special theme
            if (_.isObject(this.get("gfiTheme"))) {
                feature.set("gfiParams", this.get("gfiTheme").params);
                feature.set("utc", this.get("utc"));
            }

            features.push(feature);
        }, this);

        // only features with geometry
        features = features.filter(function (feature) {
            return !_.isUndefined(feature.getGeometry());
        });

        return features;
    },

    /**
     * change time zone by given UTC-time
     * @param  {String} phenomenonTime - time of measuring a phenomenon
     * @param  {String} utc - timezone (default +1)
     * @return {String} phenomenonTime converted with UTC
     */
    changeTimeZone: function (phenomenonTime, utc) {
        var utcAlgebraicSign,
            utcNumber,
            utcSub,
            time = "";

        if (_.isUndefined(phenomenonTime)) {
            return "";
        }
        else if (!_.isUndefined(utc) && (_.includes(utc, "+") || _.includes(utc, "-"))) {
            utcAlgebraicSign = utc.substring(0, 1);

            if (utc.length === 2) {
                // check for winter- and summertime
                utcSub = parseInt(utc.substring(1, 2), 10);
                utcSub = moment(phenomenonTime).isDST() ? utcSub + 1 : utcSub;
                utcNumber = "0" + utcSub + "00";
            }
            else if (utc.length > 2) {
                utcSub = parseInt(utc.substring(1, 3), 10);
                utcSub = moment(phenomenonTime).isDST() ? utcSub + 1 : utcSub;
                utcNumber = utc.substring(1, 3) + "00";
            }

            time = moment(phenomenonTime).utcOffset(utcAlgebraicSign + utcNumber).format("DD MMMM YYYY, HH:mm:ss");
        }

        return time;
    },

    /**
     * load SensorThings by
     * @param  {String} url - url to service
     * @param  {String} version - version from service
     * @param  {String} urlParams - url parameters
     * @param  {Boolean} mergeThingsByCoordinates - Flag if things should be merged if they have the same Coordinates
     * @return {array} all things with attributes and location
     */
    loadSensorThings: function (url, version, urlParams, mergeThingsByCoordinates) {
        var allThings = [],
            requestUrl = this.buildSensorThingsUrl(url, version, urlParams),
            things = this.getResponseFromRequestUrl(requestUrl),
            thingsCount,
            thingsbyOneRequest,
            thingsRequestUrl,
            index;

        if (_.isUndefined(things) || !_.has(things, "value")) {
            // Return witout data to prevent crashing
            console.warn("Sensor-Layer: Result of query was undefined or malformed.");
            return [];
        }

        thingsCount = _.isUndefined(things) ? 0 : things["@iot.count"]; // count of all things
        thingsbyOneRequest = things.value.length; // count of things on one request

        allThings.push(things.value);
        for (index = thingsbyOneRequest; index < thingsCount; index += thingsbyOneRequest) {
            thingsRequestUrl = requestUrl + "&$skip=" + index;

            things = this.getResponseFromRequestUrl(thingsRequestUrl);

            if (_.isUndefined(things) || !_.has(things, "value")) {
                // Return witout data to prevent crashing
                console.warn("Sensor-Layer: Result of sub-query was undefined or malformed.");
                continue;
            }
            allThings.push(things.value);
        }

        allThings = allThings.flat();

        allThings = this.getNewestSensorData(allThings);
        if (mergeThingsByCoordinates) {
            allThings = this.mergeByCoordinates(allThings);
        }

        allThings = this.aggregatePropertiesOfThings(allThings);

        return allThings;
    },

    getNewestSensorData: function (allThings) {
        const allThingsWithSensorData = allThings;

        allThingsWithSensorData.forEach(thing => {
            const dataStreams = thing.Datastreams;

            dataStreams.forEach((dataStream, i) => {
                const dataStreamId = dataStream["@iot.id"],
                    key = dataStream.hasOwnProperty("unitOfMeasurement") && dataStream.unitOfMeasurement.hasOwnProperty("name") ? dataStream.unitOfMeasurement.name : "unknown_datatream_" + i,
                    value = dataStream.hasOwnProperty("Observations") && dataStream.Observations.length > 0 ? dataStream.Observations[0].result : undefined,
                    phenomenonTime = dataStream.hasOwnProperty("Observations") && dataStream.Observations.length > 0 ? dataStream.Observations[0].phenomenonTime : undefined;

                if (value) {
                    thing.properties[key] = value;
                    thing.properties[key + "_phenomenonTime"] = phenomenonTime;
                    thing.properties.dataStreamId = dataStreamId;
                }
            });
        });
        return allThingsWithSensorData;
    },
    /**
     * build SensorThings URL
     * @param  {String} url - url to service
     * @param  {String} version - version from service
     * @param  {String} urlParams - url parameters
     * @return {String} URL to request sensorThings
     */
    buildSensorThingsUrl: function (url, version, urlParams) {
        var requestUrl,
            and = "$",
            versionAsString = version;

        if (_.isNumber(version)) {
            versionAsString = version.toFixed(1);
        }

        requestUrl = url + "/v" + versionAsString + "/Things?";

        if (urlParams) {
            _.each(urlParams, function (value, key) {
                requestUrl = requestUrl + and + key + "=" + value;
                and = "&$";
            });
        }

        return requestUrl;
    },

    /**
     * merge things with equal coordinates
     * @param  {array} allThings - contains all loaded Things
     * @return {array} merged things
     */
    mergeByCoordinates: function (allThings) {
        var mergeAllThings = [],
            indices = [],
            things,
            xy,
            xy2;

        _.each(allThings, function (thing, index) {
            // if the thing was assigned already
            if (!_.contains(indices, index)) {
                things = [];
                xy = this.getCoordinates(thing);

                // if no datastream exists
                if (_.isEmpty(thing.Datastreams)) {
                    return;
                }

                _.each(allThings, function (thing2, index2) {
                    xy2 = this.getCoordinates(thing2);

                    if (_.isEqual(xy, xy2)) {
                        things.push(thing2);
                        indices.push(index2);
                    }
                }, this);

                mergeAllThings.push(things);
            }
        }, this);

        return mergeAllThings;
    },

    /**
     * retrieves coordinates by different geometry types
     * @param  {object} thing - thing
     * @return {array} coordinates
     */
    getCoordinates: function (thing) {
        var xy;

        if (!_.isUndefined(thing) && !_.isEmpty(thing.Locations)) {
            if (thing.Locations[0].location.type === "Feature" &&
                !_.isUndefined(thing.Locations[0].location.geometry) &&
                !_.isUndefined(thing.Locations[0].location.geometry.coordinates)) {

                xy = thing.Locations[0].location.geometry.coordinates;
            }
            else if (thing.Locations[0].location.type === "Point" &&
                !_.isUndefined(thing.Locations[0].location.coordinates)) {

                xy = thing.Locations[0].location.coordinates;
            }
        }

        return xy;
    },
    aggregatePropertiesOfThings: function (allThings) {
        const aggregatedArray = [];

        allThings.forEach(thing => {
            const aggregatedThing = {};

            if (Array.isArray(thing)) {
                let keys = [];

                aggregatedThing.location = this.getCoordinates(thing[0]);
                thing.forEach(thing2 => {
                    keys.push(Object.keys(thing2.properties));
                });
                keys = [...new Set(keys.flat())];

                aggregatedThing.properties = this.aggregateProperties(thing, keys);
            }
            else {
                aggregatedThing.location = this.getCoordinates(thing);
                aggregatedThing.properties = thing.properties;
            }
            aggregatedThing.properties.requestUrl = this.get("url");
            aggregatedThing.properties.versionUrl = this.get("version");
            aggregatedArray.push(aggregatedThing);
        });

        return aggregatedArray;
    },

    aggregateProperties: function (thingArray, keys) {
        const aggregatedProperties = {};

        keys.forEach(key => {
            const valuesArray = thingArray.map(thing => thing.properties[key]);

            aggregatedProperties[key] = valuesArray.join(" | ");
        });
        return aggregatedProperties;
    },

    /**
     * create style, function triggers to style_v2.json
     * @param  {boolean} isClustered - should
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
     * create connection to a given MQTT-Broker
     * this must be passes this as a context to call the updateFromMqtt function
     * @param {array} features - features with DatastreamID
     * @returns {void}
     */
    createMqttConnectionToSensorThings: function (features) {
        var dataStreamIds = this.getDataStreamIds(features),
            client = mqtt.connect({
                host: this.get("url").split("/")[2],
                protocol: "wss",
                path: this.get("mqttPath"),
                context: this
            });

        client.on("connect", function () {
            var version = this.options.context.get("version");

            _.each(dataStreamIds, function (id) {
                client.subscribe("v" + version + "/Datastreams(" + id + ")/Observations");
            });
        });

        // messages from the server
        client.on("message", function (topic, payload) {
            var jsonData = JSON.parse(payload),
                regex = /\((.*)\)/; // search value in chlich, that represents the datastreamid on position 1

            jsonData.dataStreamId = topic.match(regex)[1];
            this.options.context.updateFromMqtt(jsonData);
        });
    },

    /**
     * update the phenomenontime and states of the Feature
     * this function is triggerd from MQTT
     * @param  {json} thing - thing contains a new observation and accompanying topic
     * @returns {void}
     */
    updateFromMqtt: function (thing) {
        var thingToUpdate = !_.isUndefined(thing) ? thing : {},
            dataStreamId = thingToUpdate.dataStreamId,
            features = this.get("layerSource").getFeatures(),
            featureArray = this.getFeatureByDataStreamId(dataStreamId, features),
            thingResult = String(thingToUpdate.result),
            utc = this.get("utc"),
            thingPhenomenonTime = this.changeTimeZone(thingToUpdate.phenomenonTime, utc);

        this.liveUpdate(featureArray, thingResult, thingPhenomenonTime);
    },

    /**
     * performs the live update
     * @param  {Array} featureArray - contains the and index and feature which should be updates
     * @param  {String} thingResult - the new state
     * @param  {String} thingPhenomenonTime - the new phenomenonTime
     * @returns {void}
     */
    liveUpdate: function (featureArray, thingResult, thingPhenomenonTime) {
        var itemNumber = featureArray[0],
            feature = featureArray[1],
            datastreamStates = feature.get("state"),
            datastreamPhenomenonTime = feature.get("phenomenonTime");

        if (_.contains(datastreamStates, "|")) {
            datastreamStates = datastreamStates.split(" | ");
            datastreamPhenomenonTime = datastreamPhenomenonTime.split(" | ");

            datastreamStates[itemNumber] = thingResult;
            datastreamPhenomenonTime[itemNumber] = thingPhenomenonTime;

            feature.set("state", datastreamStates.join(" | "));
            feature.set("phenomenonTime", datastreamPhenomenonTime.join(" | "));
        }
        else {
            feature.set("state", thingResult);
            feature.set("phenomenonTime", thingPhenomenonTime);
        }

        // trigger the heatmap and gfi to update them
        Radio.trigger("HeatmapLayer", "loadupdateHeatmap", this.get("id"), feature);
        Radio.trigger("GFI", "changeFeature", feature);
    },

    /**
     * get DataStreamIds
     * @param  {Array} features - features with datastreamids
     * @return {Array} dataStreamIdsArray - contains all ids from this layer
     */
    getDataStreamIds: function (features) {
        var dataStreamIdsArray = [];

        _.each(features, function (feature) {
            var dataStreamIds = _.isUndefined(feature.get("dataStreamId")) ? "" : feature.get("dataStreamId");

            if (_.contains(dataStreamIds, "|")) {
                dataStreamIds = dataStreamIds.split(" | ");

                _.each(dataStreamIds, function (id) {
                    dataStreamIdsArray.push(id);
                });
            }
            else {
                dataStreamIdsArray.push(String(dataStreamIds));
            }
        });

        return dataStreamIdsArray;
    },

    /**
     * get feature by a given id
     * @param  {number} id - the if from examined feature
     * @param  {array} features - features to seacrh for
     * @return {array} featureArray
     */
    getFeatureByDataStreamId: function (id, features) {
        var featureArray = [];

        _.each(features, function (feature) {
            var datastreamIds = feature.get("dataStreamId");

            if (_.contains(datastreamIds, "|")) {
                datastreamIds = datastreamIds.split(" | ");

                _.each(datastreamIds, function (thingsId, index) {
                    if (parseInt(id, 10) === parseInt(thingsId, 10)) {
                        featureArray.push(index);
                        featureArray.push(feature);
                    }
                });
            }
            else if (parseInt(id, 10) === parseInt(datastreamIds, 10)) {
                featureArray.push(0);
                featureArray.push(feature);
            }
        });

        return featureArray;
    },

    /**
     * create legend
     * @returns {void}
     */
    createLegendURL: function () {
        var style;

        if (!_.isUndefined(this.get("LegendURL")) && !this.get("LegendURL").length) {
            style = Radio.request("StyleList", "returnModelById", this.get("styleId"));

            if (!_.isUndefined(style)) {
                this.setLegendURL([style.get("imagePath") + style.get("imageName")]);
            }
        }
    },

    setStyle: function (value) {
        this.set("style", value);
    },

    setClusterLayerSource: function (value) {
        this.set("clusterLayerSource", value);
    },

    setWssUrl: function (value) {
        this.set("wssUrl", value);
    },

    setStreamId: function (value) {
        this.set("streamId", value);
    },

    setEpsg: function (value) {
        this.set("epsg", value);
    }

});

export default SensorLayer;

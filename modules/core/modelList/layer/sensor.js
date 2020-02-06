import Layer from "./model";
import mqtt from "mqtt";
import moment from "moment";
import {Cluster, Vector as VectorSource} from "ol/source.js";
import VectorLayer from "ol/layer/Vector.js";
import {transformToMapProjection} from "masterportalAPI/src/crs";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import {buffer, containsExtent} from "ol/extent";

const SensorLayer = Layer.extend(/** @lends SensorLayer.prototype */{
    defaults: _.extend({}, Layer.prototype.defaults,
        {
            supported: ["2D", "3D"],
            epsg: "EPSG:4326",
            utc: "+1",
            version: "1.0",
            useProxyURL: false,
            mqttPath: "/mqtt",
            mergeThingsByCoordinates: false,
            showNoDataValue: true,
            noDataValue: "no data",
            altitudeMode: "clampToGround",
            isSubscribed: false,
            mqttClient: null,
            subscriptionTopics: {},
            moveendListener: null
        }),
    /**
     * @class SensorLayer
     * @extends Layer
     * @memberof Core.ModelList.Layer
     * @constructs
     * @property {String} epsg="EPSG:4326" EPSG-Code for incoming sensor geometries.
     * @property {String} utc="+1" UTC-Timezone to calulate correct time.
     * @property {String} version="1.0" Version the SensorThingsAPI is requested.
     * @property {Boolean} useProxyUrl="1.0" Flag if url should be proxied.
     * @fires Core#RadioRequestMapViewGetOptions
     * @fires Core#RadioRequestUtilGetProxyURL
     * @fires Core#RadioTriggerUtilShowLoader
     * @fires Core#RadioTriggerUtilHideLoader
     * @fires Alerting#RadioTriggerAlertAlert
     * @fires VectorStyle#RadioRequestStyleListReturnModelById
     * @fires GFI#RadioTriggerGFIChangeFeature
     * @listens Layer#RadioRequestVectorLayerGetFeatures
     * @description This layer type requests its data from the SensorThinsgAPI (STA).
     * The layer reacts to changes of the own features triggered by the STA.
     * The technology used therefore is WebSocketSecure (wss) and the MessageQueuingTelemetryTransport(MQTT)-Protocol.
     * This makes it possible to update vector-data in the application without reloading the entire page.
     * The newest observation data of each attribute is set as follows:
     * name = If "datastream.properties.type" is not undefined, take this. Otherwise take the value in "datastream.unitOfMeasurment.name"
     * The attribute key is "dataStream_[dataStreamId]_[name]".
     * All available dataStreams, their ids, their latest observation and values are separately aggregated and stored (separated by " | ") in the following attributes:
     * dataStreamId, dataStreamName, dataStreamValue, dataStreamPhenomenonTime
     * The "name" and the "description" of each thing are also taken as "properties".
     */
    initialize: function () {
        this.createMqttConnectionToSensorThings();

        if (!this.get("isChildLayer")) {
            Layer.prototype.initialize.apply(this);
        }

        // change language from moment.js to german
        moment.locale("de");
    },

    /**
     * Start or stop subscription according to its conditions.
     * Because of usage of serveral listeners it's necessary to create a "isSubscribed" flag to prevent multiple executions.
     * @returns {void}
     */
    changedConditions: function () {
        const features = this.get("layerSource").getFeatures(),
            state = this.checkConditionsForSubscription();

        if (state === true) {
            this.setIsSubscribed(true);
            if (Array.isArray(features) && !features.length) {
                this.initializeConnection();
            }
            // call subscriptions
            this.updateSubscription();
            // create listener of moveend event
            this.setMoveendListener(Radio.request("Map", "registerListener", "moveend", this.updateSubscription.bind(this)));
        }
        else if (state === false) {
            this.setIsSubscribed(false);
            // remove listener of moveend event
            Radio.trigger("Map", "unregisterListener", this.get("moveendListener"));
            this.setMoveendListener(null);
            // remove connection to live update
            this.unsubscribeFromSensorThings();
        }
    },

    /**
     * Check if layer is whithin range and selected to determine if all conditions are fullfilled.
     * @returns {void}
     */
    checkConditionsForSubscription: function () {
        if (this.get("isOutOfRange") === false && this.get("isSelected") === true && this.get("isSubscribed") === false) {
            return true;
        }
        else if ((this.get("isOutOfRange") === true || this.get("isSelected") === false) && this.get("isSubscribed") === true) {
            return false;
        }

        return undefined;
    },

    /**
     * Creates the vectorSource.
     * @returns {void}
     */
    createLayerSource: function () {
        this.setLayerSource(new VectorSource());
        if (this.has("clusterDistance")) {
            this.createClusterLayerSource();
        }
    },

    /**
     * Creates the layer.
     * @listens Core#RadioTriggerMapViewChangedCenter
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
            id: this.get("id"),
            altitudeMode: this.get("altitudeMode")
        }));

        // subscription / unsubscription to mmqt only happens by this change events
        this.listenTo(this, {
            "change:isVisibleInMap": this.changedConditions,
            "change:isOutOfRange": this.changedConditions
        });
    },

    /**
     * Creates ClusterLayerSource.
     * @returns {void}
     */
    createClusterLayerSource: function () {
        this.setClusterLayerSource(new Cluster({
            source: this.get("layerSource"),
            distance: this.get("clusterDistance")
        }));
    },

    /**
     * Initial loading of sensor data function
     * @fires Core#RadioRequestUtilGetProxyURL
     * @returns {void}
     */
    initializeConnection: function () {
        var sensorData,
            features,
            isClustered = this.has("clusterDistance"),
            url = this.get("useProxyUrl") ? Radio.request("Util", "getProxyURL", this.get("url")) : this.get("url"),
            version = this.get("version"),
            urlParams = this.get("urlParameter"),
            epsg = this.get("epsg"),
            mergeThingsByCoordinates = this.get("mergeThingsByCoordinates");

        sensorData = this.loadSensorThings(url, version, urlParams, mergeThingsByCoordinates);
        features = this.createFeatures(sensorData, epsg);

        // Add features to vectorlayer
        if (!_.isEmpty(features)) {
            this.get("layerSource").addFeatures(features);
            this.prepareFeaturesFor3D(features);
            this.featuresLoaded(features);
        }

        if (!_.isUndefined(features)) {
            this.styling(isClustered);
            this.get("layer").setStyle(this.get("style"));
        }
    },

    /**
     * get response from a given URL
     * @param  {String} requestUrl - to request sensordata
     * @fires Core#RadioTriggerUtilShowLoader
     * @fires Core#RadioTriggerUtilHideLoader
     * @fires Alerting#RadioTriggerAlertAlert
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
            feature = this.aggregateDataStreamValue(feature);
            feature = this.aggregateDataStreamPhenomenonTime(feature);
            features.push(feature);
        }, this);

        // only features with geometry
        features = features.filter(function (feature) {
            return !_.isUndefined(feature.getGeometry());
        });

        return features;
    },

    /**
     * Aggregates the values and adds them as property "dataStreamValues".
     * @param {ol/feature} feature OL-feature.
     * @returns {ol/feature} - Feature with new attribute "dataStreamValues".
     */
    aggregateDataStreamValue: function (feature) {
        const modifiedFeature = feature,
            dataStreamValues = [];

        if (feature && feature.get("dataStreamId")) {
            feature.get("dataStreamId").split(" | ").forEach((id, i) => {
                const dataStreamName = feature.get("dataStreamName").split(" | ")[i];

                if (this.get("showNoDataValue") && !feature.get("dataStream_" + id + "_" + dataStreamName)) {
                    dataStreamValues.push(this.get("noDataValue"));
                }
                else if (feature.get("dataStream_" + id + "_" + dataStreamName)) {
                    dataStreamValues.push(feature.get("dataStream_" + id + "_" + dataStreamName));
                }
            });
            modifiedFeature.set("dataStreamValue", dataStreamValues.join(" | "));
        }
        return modifiedFeature;
    },

    /**
     * Aggregates the phenomenonTimes and adds them as property "dataStreamPhenomenonTime".
     * @param {ol/feature} feature OL-feature.
     * @returns {ol/feature} - Feature with new attribute "dataStreamPhenomenonTime".
     */
    aggregateDataStreamPhenomenonTime: function (feature) {
        const modifiedFeature = feature,
            dataStreamPhenomenonTimes = [];

        if (feature && feature.get("dataStreamId")) {
            feature.get("dataStreamId").split(" | ").forEach((id, i) => {
                const dataStreamName = feature.get("dataStreamName").split(" | ")[i];

                if (this.get("showNoDataValue") && !feature.get("dataStream_" + id + "_" + dataStreamName + "_phenomenonTime")) {
                    dataStreamPhenomenonTimes.push(this.get("noDataValue"));
                }
                else if (feature.get("dataStream_" + id + "_" + dataStreamName + "_phenomenonTime")) {
                    dataStreamPhenomenonTimes.push(feature.get("dataStream_" + id + "_" + dataStreamName + "_phenomenonTime"));
                }
            });
            modifiedFeature.set("dataStreamPhenomenonTime", dataStreamPhenomenonTimes.join(" | "));
        }
        return modifiedFeature;
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

        allThings = this.flattenArray(allThings);
        allThings = this.getNewestSensorData(allThings);
        if (mergeThingsByCoordinates) {
            allThings = this.mergeByCoordinates(allThings);
        }

        allThings = this.aggregatePropertiesOfThings(allThings);

        return allThings;
    },

    /**
     * Iterates over the dataStreams and creates for each datastream the attributes:
     * "dataStream_[dataStreamId]_[dataStreamName]" and
     * "dataStream_[dataStreamId]_[dataStreamName]_phenomenonTime".
     * @param {Object[]} allThings All things.
     * @returns {Object[]} - All things with the newest observation for each dataStream.
     */
    getNewestSensorData: function (allThings) {
        const allThingsWithSensorData = allThings;

        allThingsWithSensorData.forEach(thing => {
            const dataStreams = thing.Datastreams;

            thing.properties.dataStreamId = [];
            thing.properties.dataStreamName = [];
            dataStreams.forEach(dataStream => {
                const dataStreamId = String(dataStream["@iot.id"]),
                    propertiesType = dataStream.hasOwnProperty("ObservedProperty") && dataStream.ObservedProperty.hasOwnProperty("name") ? dataStream.ObservedProperty.name : undefined,
                    unitOfMeasurementName = dataStream.hasOwnProperty("unitOfMeasurement") && dataStream.unitOfMeasurement.hasOwnProperty("name") ? dataStream.unitOfMeasurement.name : "unknown",
                    dataStreamName = propertiesType ? propertiesType : unitOfMeasurementName,
                    key = "dataStream_" + dataStreamId + "_" + dataStreamName,
                    value = dataStream.hasOwnProperty("Observations") && dataStream.Observations.length > 0 ? dataStream.Observations[0].result : undefined;
                let phenomenonTime = dataStream.hasOwnProperty("Observations") && dataStream.Observations.length > 0 ? dataStream.Observations[0].phenomenonTime : undefined;

                phenomenonTime = this.changeTimeZone(phenomenonTime, this.get("utc"));

                if (this.get("showNoDataValue") && !value) {
                    thing.properties[key] = this.get("noDataValue");
                    thing.properties[key + "_phenomenonTime"] = this.get("noDataValue");
                    thing.properties.dataStreamId.push(dataStreamId);
                    thing.properties.dataStreamName.push(dataStreamName);
                }
                else if (value) {
                    thing.properties[key] = value;
                    thing.properties[key + "_phenomenonTime"] = phenomenonTime;
                    thing.properties.dataStreamId.push(dataStreamId);
                    thing.properties.dataStreamName.push(dataStreamName);
                }
            });
            thing.properties.dataStreamId = thing.properties.dataStreamId.join(" | ");
            thing.properties.dataStreamName = thing.properties.dataStreamName.join(" | ");
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

    /**
     * Aggregates the properties of the things.
     * @param {Object[]} allThings - all things
     * @returns {Object[]} - aggregatedThings
     */
    aggregatePropertiesOfThings: function (allThings) {
        const aggregatedArray = [];

        allThings.forEach(thing => {
            const aggregatedThing = {};

            if (Array.isArray(thing)) {
                let keys = [],
                    props = {};

                aggregatedThing.location = this.getCoordinates(thing[0]);
                thing.forEach(thing2 => {
                    keys.push(Object.keys(thing2.properties));
                    props = Object.assign(props, thing2.properties);
                });
                keys = [...new Set(this.flattenArray(keys))];
                keys = this.excludeDataStreamKeys(keys, "dataStream_");
                keys.push("name");
                keys.push("description");
                aggregatedThing.properties = Object.assign({}, props, this.aggregateProperties(thing, keys));
            }
            else {
                aggregatedThing.location = this.getCoordinates(thing);
                aggregatedThing.properties = thing.properties;
                aggregatedThing.properties.name = thing.name;
                aggregatedThing.properties.description = thing.description;
            }
            aggregatedThing.properties.requestUrl = this.get("url");
            aggregatedThing.properties.versionUrl = this.get("version");
            aggregatedArray.push(aggregatedThing);
        });

        return aggregatedArray;
    },

    /**
     * flattenArray creates a new array with all sub-array elements concatenated
     * @info this is equivalent to Array.flat() - except no addition for testing is needed for this one
     * @param {*} array the array to flatten its sub-arrays or anything else
     * @returns {*}  the flattened array if an array was given, the untouched input otherwise
     */
    flattenArray: function (array) {
        return Array.isArray(array) ? array.reduce((acc, val) => acc.concat(val), []) : array;
    },

    /**
     * Excludes the keys starting with the given startsWithString
     * @param {String[]} keys  - keys
     * @param {String} startsWithString - startsWithString
     * @returns {String[]} - reducedKeys
     */
    excludeDataStreamKeys: function (keys, startsWithString) {
        let keysToIgnore,
            reducedKeys;

        if (keys && startsWithString) {
            keysToIgnore = keys.filter(key => key.startsWith(startsWithString));
            reducedKeys = keys.filter(key => !keysToIgnore.includes(key));
        }

        return reducedKeys;
    },

    /**
     * Aggregates the properties of the given keys and joins them by  " | "
     * @param {Object} thingArray - Array of things to aggregate
     * @param {String[]} keys - Keys to aggregate
     * @returns {Object} - aggregatedProperties
     */
    aggregateProperties: function (thingArray, keys) {
        const aggregatedProperties = {};

        keys.forEach(key => {
            const valuesArray = thingArray.map(thing => key === "name" || key === "description" ? thing[key] : thing.properties[key]);

            aggregatedProperties[key] = valuesArray.join(" | ");
        });
        return aggregatedProperties;
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
     * create connection to a given MQTT-Broker
     * this must be passes this as a context to call the updateFromMqtt function
     * @param {array} features - features with DatastreamID
     * @returns {void}
     */
    createMqttConnectionToSensorThings: function () {
        if (!this.get("url")) {
            return;
        }

        const client = mqtt.connect({
            host: this.get("url").split("/")[2],
            protocol: "wss",
            path: this.get("mqttPath"),
            context: this
        });

        this.setMqttClient(client);

        // messages from the server
        client.on("message", function (topic, payload) {
            var jsonData = JSON.parse(payload),
                regex = /\((.*)\)/; // search value in chlich, that represents the datastreamid on position 1

            jsonData.dataStreamId = topic.match(regex)[1];
            this.options.context.updateFromMqtt(jsonData);
        });
    },

    /**
     * subscribes to the mqtt client with the features in the current extent
     * @returns {Void}  -
     */
    subscribeToSensorThings: function () {
        const features = this.getFeaturesInExtent(),
            dataStreamIds = this.getDataStreamIds(features),
            version = this.get("version"),
            client = this.get("mqttClient"),
            subscriptionTopics = this.get("subscriptionTopics");

        dataStreamIds.forEach(function (id) {
            if (!subscriptionTopics[id]) {
                client.subscribe("v" + version + "/Datastreams(" + id + ")/Observations");
                subscriptionTopics[id] = true;
            }
        });
    },

    /**
     * unsubscribes from the mqtt client with topics formerly subscribed
     * @returns {Void}  -
     */
    unsubscribeFromSensorThings: function () {
        const features = this.getFeaturesInExtent(),
            dataStreamIds = this.getDataStreamIds(features),
            dataStreamIdsInverted = {},
            subscriptionTopics = this.get("subscriptionTopics"),
            version = this.get("version"),
            isSelected = this.get("isSelected"),
            client = this.get("mqttClient");
        let id;

        dataStreamIds.forEach(function (id) {
            dataStreamIdsInverted[id] = true;
        });

        for (id in subscriptionTopics) {
            if (isSelected === false || isSelected === true && subscriptionTopics[id] === true && !dataStreamIdsInverted.hasOwnProperty(id)) {
                client.unsubscribe("v" + version + "/Datastreams(" + id + ")/Observations");
                subscriptionTopics[id] = false;
            }
        };
    },

    /**
     * Refresh all connections by ending all established connections and creating new ones
     * @returns {void}
     */
    updateSubscription: function () {
        this.unsubscribeFromSensorThings();
        this.subscribeToSensorThings();
    },

    /**
     * Returns features in enlarged extent (enlarged by 5% to make sure moving features close to the extent can move into the mapview)
     * @returns {ol/featre[]} features
     */
    getFeaturesInExtent: function () {
        const features = this.get("layerSource").getFeatures(),
            currentExtent = Radio.request("MapView", "getCurrentExtent"),
            enlargedExtent = this.enlargeExtent(currentExtent, 0.05),
            featuresInExtent = [];

        features.forEach(feature => {
            if (containsExtent(enlargedExtent, feature.getGeometry().getExtent())) {
                featuresInExtent.push(feature);
            }
        });

        return featuresInExtent;
    },

    /**
     * enlarge given extent by factor
     * @param   {ol/extent} extent extent to enlarge
     * @param   {float} factor factor to enlarge extent
     * @returns {ol/extent} enlargedExtent
     */
    enlargeExtent: function (extent, factor) {
        const bufferAmount = (extent[2] - extent[0]) * factor;

        return buffer(extent, bufferAmount);
    },

    /**
     * update the phenomenontime and states of the Feature
     * this function is triggerd from MQTT
     * @param  {json} thing - thing contains a new observation and accompanying topic
     * @returns {void}
     */
    updateFromMqtt: function (thing) {
        var thingToUpdate = !_.isUndefined(thing) ? thing : {},
            dataStreamId = String(thingToUpdate.dataStreamId),
            features = this.get("layerSource").getFeatures(),
            feature = this.getFeatureByDataStreamId(features, dataStreamId),
            result = String(thingToUpdate.result),
            utc = this.get("utc"),
            phenomenonTime = this.changeTimeZone(thingToUpdate.phenomenonTime, utc);

        this.liveUpdate(feature, dataStreamId, result, phenomenonTime);
    },

    /**
     * performs the live update
     * @param  {ol/feature} feature - feature to be updated
     * @param  {String} dataStreamId - dataStreamId
     * @param  {String} result - the new state
     * @param  {String} phenomenonTime - the new phenomenonTime
     * @fires GFI#RadioTriggerGFIChangeFeature
     * @returns {void}
     */
    liveUpdate: function (feature, dataStreamId, result, phenomenonTime) {
        let updatedFeature = feature;

        updatedFeature.set("dataStream_" + dataStreamId + "_Status", result);
        updatedFeature.set("dataStream_" + dataStreamId + "_phenomenonTime", phenomenonTime);
        updatedFeature = this.aggregateDataStreamValue(feature);
        updatedFeature = this.aggregateDataStreamPhenomenonTime(feature);
        this.featureUpdated(updatedFeature);
        Radio.trigger("GFI", "changeFeature", updatedFeature);
    },

    /**
     * helper function for getDataStreamIds: pushes the datastream ids into the given array
     * @param {ol/Feature} feature the feature containing datastream ids
     * @param {String[]} dataStreamIdsArray the array to push the datastream ids into
     * @returns {Void}  -
     */
    getDataStreamIdsHelper: function (feature, dataStreamIdsArray) {
        let dataStreamIds = feature && feature.get("dataStreamId") !== undefined ? feature.get("dataStreamId") : "";

        if (dataStreamIds.indexOf("|") >= 0) {
            dataStreamIds = dataStreamIds.split("|");

            dataStreamIds.forEach(function (id) {
                dataStreamIdsArray.push(id.trim());
            });
        }
        else {
            dataStreamIdsArray.push(String(dataStreamIds));
        }
    },

    /**
     * get DataStreamIds for this layer - using dataStreamId property with expected pipe delimitors
     * @param  {ol/Feature[]} features - features with datastream ids or features with features (see clustering) with datastreamids
     * @return {String[]} dataStreamIdsArray - contains all datastream ids from this layer
     */
    getDataStreamIds: function (features) {
        const dataStreamIdsArray = [];

        if (!Array.isArray(features)) {
            return [];
        }

        features.forEach(function (feature) {
            if (Array.isArray(feature.get("features"))) {
                // obviously clustered featuers are activated
                feature.get("features").forEach(function (subfeature) {
                    this.getDataStreamIdsHelper(subfeature, dataStreamIdsArray);
                }.bind(this));
            }
            else {
                this.getDataStreamIdsHelper(feature, dataStreamIdsArray);
            }
        }.bind(this));

        return dataStreamIdsArray;
    },

    /**
     * get feature by a given id
     * @param  {array} features - features to seacrh for
     * @param  {number} id - the if from examined feature
     * @return {array} featureArray
     */
    getFeatureByDataStreamId: function (features, id) {
        let feature;

        if (features && features.length > 0 && id) {
            feature = features.filter(feat => {
                return feat.get("dataStreamId") ? feat.get("dataStreamId").includes(id) : false;
            })[0];
        }
        return feature;
    },

    /**
     * create legend
     * @fires VectorStyle#RadioRequestStyleListReturnModelById
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

    /**
     * Setter for style
     * @param {function}  value Stylefunction.
     * @returns {void}
     */
    setStyle: function (value) {
        this.set("style", value);
    },

    /**
     * Setter for clusterLayerSource
     * @param {ol/source/cluster} value clusterLayerSource
     * @returns {void}
     */
    setClusterLayerSource: function (value) {
        this.set("clusterLayerSource", value);
    },

    /**
     * Setter for isSubscribed
     * @param {boolean} value isSubscribed
     * @returns {void}
     */
    setIsSubscribed: function (value) {
        this.set("isSubscribed", value);
    },

    /**
     * Setter for mqttClient
     * @param {boolean} value mqttClient
     * @returns {void}
     */
    setMqttClient: function (value) {
        this.set("mqttClient", value);
    },

    /**
     * Setter for moveendListener
     * @param {boolean} value moveendListener
     * @returns {void}
     */
    setMoveendListener: function (value) {
        this.set("moveendListener", value);
    }

});

export default SensorLayer;

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Layer from "./layer";
import LoaderOverlay from "../../utils/loaderOverlay";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import * as bridge from "./RadioBridge";
// import Cluster from "ol/source/Cluster";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// import {buffer, containsExtent} from "ol/extent";
// import {GeoJSON} from "ol/format";
// import changeTimeZone from "../../utils/changeTimeZone";
import getProxyUrl from "../../utils/getProxyUrl";
// import isObject from "../../utils/isObject";
// import {SensorThingsMqtt} from "../../utils/sensorThingsMqtt";
// import {SensorThingsHttp} from "../../utils/sensorThingsHttp";
// import store from "../../app-store";
// import moment from "moment";
// import "moment-timezone";

dayjs.extend(dayjsTimezone);
dayjs.extend(localizedFormat);

/**
 * Creates a layer for the SensorThings API.
 * @param {Object} attrs attributes of the layer
 * @returns {void}
 */
export default function STALayer (attrs) {
    const defaults = {
        supported: ["2D", "3D"],
        // epsg: "EPSG:4326",
        // showSettings: true,
        isSecured: false,
        // altitudeMode: "clampToGround",
        useProxy: false
        // sourceUpdated: false,
        // subscriptionTopics: {},
        // mqttClient: null,
        // timezone: "Europe/Berlin",
        // utc: "+1",
        // version: "1.1",
        // showNoDataValue: true,
        // noDataValue: "no data",
        // loadThingsOnlyInCurrentExtent: false,
        // isSubscribed: false,
        // mqttRh: 2,
        // mqttQos: 2,
        // mqttOptions: {},
        // datastreamAttributes: [
        //     "@iot.id",
        //     "@iot.selfLink",
        //     "Observations",
        //     "description",
        //     "name",
        //     "observationType",
        //     "observedArea",
        //     "phenomenonTime",
        //     "properties",
        //     "resultTime",
        //     "unitOfMeasurement"
        // ],
        // thingAttributes: [
        //     "@iot.id",
        //     "@iot.selfLink",
        //     "Locations",
        //     "description",
        //     "name",
        //     "properties"
        // ]
    };

    this.onceEvents = {
        "featuresloadend": []
    };
    this.mqttClient = null;
    this.options = {};

    this.createLayer(Object.assign(defaults, attrs));
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.initStyle(attrs);
    this.styleRules = [];

    this.intervallRequest = null;
    this.keepUpdating = false;
    this.moveLayerRevisible = "";
    this.subscribedDataStreamIds = {};
    this.showHistoricalFeatures = true;
    this.locationUpdating = {};
    this.eventKeys = {};
    this.lastScale = null;

    this.registerInteractionMapResolutionListeners(this.get("scaleStyleByZoom"));
    require("dayjs/locale/de.js");
    dayjs.locale("de");
    this.registerInteractionMapScaleListeners();
}
// Link prototypes and add prototype methods, means STALayer uses all methods and properties of Layer
STALayer.prototype = Object.create(Layer.prototype);

/**
 * Creates a layer for SensorThings.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attrs params of the raw layer
 * @returns {void}
 */
STALayer.prototype.createLayer = function (attrs) {
    let initialLoading = true;
    const rawLayerAttributes = {
            // id: attrs.id,
            // url: attrs.url,
            // clusterDistance: attrs.clusterDistance,
            featureNS: attrs.featureNS,
            featureType: attrs.featureType
            // version: attrs.version
        },
        layerParams = {
            // name: attrs.name,
            // typ: attrs.typ,
            gfiAttributes: attrs.gfiAttributes,
            gfiTheme: attrs.gfiTheme,
            hitTolerance: attrs.hitTolerance,
            altitudeMode: attrs.altitudeMode,
            alwaysOnTop: attrs.alwaysOnTop,
            layerSequence: attrs.layerSequence
        },
        options = {
            // clusterGeometryFunction: (feature) => {
            //     if (feature.get("hideInClustering") === true) {
            //         return null;
            //     }
            //     return feature.getGeometry();
            // },
            // featuresFilter: this.getFeaturesFilterFunction(attrs),
            beforeLoading: () => {
                if (this.get("isSelected") || attrs.isSelected) {
                    LoaderOverlay.show();
                }
            },
            afterLoading: features => {
                if (!initialLoading) {
                    return;
                }
                initialLoading = false;
                this.featuresLoaded(attrs.id, features);
                if (this.get("isSelected") || attrs.isSelected) {
                    LoaderOverlay.hide();
                }
                while (this.onceEvents.featuresloadend.length) {
                    this.onceEvents.featuresloadend.shift()();
                }
            },
            onLoadingError: () => {
                store.dispatch("Alerting/addSingleAlert", i18next.t("modules.core.modelList.layer.sensor.httpOnError", {name: this.get("name")}));
                // console.warn("masterportal SensorThingsAPI loading error:", error);
            }
        };

    this.layer = this.createVectorLayer(rawLayerAttributes, {layerParams, options});
    this.options = options;
};

/**
 * Creates a complete ol/Layer from rawLayer containing all required children.
 * @param {Object} rawLayer layer specification as in services.json
 * @param {Object} [optionalParams] optional params
 * @param {Object} [optionalParams.layerParams] additional layer params
 * @param {Object} [optionalParams.options] additional options
 * @returns {ol/Layer} layer that can be added to map
 */
STALayer.prototype.createVectorLayer = function (rawLayer = {}, {layerParams = {}, options = {}} = {}) {
    const source = new VectorSource(),
        layer = new VectorLayer(Object.assign({
            source: rawLayer.clusterDistance ? new Cluster({
                source,
                distance: rawLayer.clusterDistance,
                geometryFunction: options.clusterGeometryFunction
            }) : source,
            id: rawLayer.id
        }, layerParams));

    if (options.style) {
        layer.setStyle(options.style);
    }
    else if (rawLayer.style) {
        layer.setStyle(rawLayer.style);
    }

    return layer;
};

/**
 * Getter of style for layer.
 * @param {Object} attrs params of the raw layer
 * @returns {Function} a function to get the style with or null plus console error if no style model was found
 */
STALayer.prototype.initStyle = function (attrs) {
    if (store.getters.styleListLoaded) {
        this.createStyle(attrs);
        this.createLegend(attrs);
    }
    else {
        store.watch((state, getters) => getters.styleListLoaded, value => {
            if (value) {
                this.createStyle(attrs);
                this.createLegend(attrs);
            }
        });
    }
};

/**
 * Creates the style function and sets it at layer.
 * @param {Object} attrs  attributes of the raw layer
 * @returns {void}
 */
STALayer.prototype.createStyle = function (attrs) {
    const styleObject = styleList.returnStyleObject(attrs?.styleId);
    let styleFunction = null;

    if (typeof styleObject !== "undefined") {
        this.styleRule = styleObject.rules ? styleObject.rules : null;
        styleFunction = function (feature, resolution) {
            const feat = typeof feature !== "undefined" ? feature : this,
                isClusterFeature = typeof feat.get("features") === "function" || typeof feat.get("features") === "object" && Boolean(feat.get("features").length > 1),
                style = createStyle.createStyle(styleObject, feat, isClusterFeature, Config.wfsImgPath),
                styleElement = Array.isArray(style) ? style[0] : style,
                zoomLevel = store.getters["Maps/getView"].getZoomForResolution(resolution) + 1,
                zoomLevelCount = store.getters["Maps/getView"].getResolutions().length;

            if (styleElement?.getImage() !== null && attrs.scaleStyleByZoom) {
                styleElement.getImage().setScale(styleElement.getImage().getScale() * zoomLevel / zoomLevelCount);
            }
            return style;
        };
        this.set("style", styleFunction);
        this.layer?.setStyle(styleFunction);
    }
    else {
        this.set("style", null);
        console.warn(i18next.t("common:core.layers.errorHandling.wrongStyleId", {styleId: attrs?.styleId}));
    }
};

/**
 * Returns the style function of this layer to be called with feature.
 * @returns {Object} the style function
 */
STALayer.prototype.getStyleFunction = function () {
    return this.get("style");
};
/**


/**
 * Updates the layers source by calling refresh at source. Depending on attribute 'sourceUpdated'.
 * @returns {void}
 */
STALayer.prototype.updateSource = function () {
    if (this.get("sourceUpdated") === false) {
        this.set("sourceUpdated", true);
        this.layer.getSource().refresh();
    }
};

/**
 * Creates the legend.
 * @returns {void}
 */
STALayer.prototype.createLegend = function () {
    const styleObject = styleList.returnStyleObject(this.attributes.styleId);
    let legend = this.get("legend");

    /**
     * @deprecated in 3.0.0
     */
    if (this.get("legendURL") === "ignore") {
        legend = false;
    }
    else if (this.get("legendURL")) {
        legend = this.get("legendURL");
    }

    if (Array.isArray(legend)) {
        this.set("legend", legend);
    }
    else if (styleObject && legend === true) {
        createStyle.returnLegendByStyleId(styleObject.styleId).then(legendInfos => {
            this.setLegend(legendInfos.legendInformation);
        });
    }
    else if (typeof legend === "string") {
        this.set("legend", [legend]);
    }
};

/**
 * Hides all features by setting style=null for all features.
 * @returns {void}
 */
STALayer.prototype.hideAllFeatures = function () {
    const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
        features = layerSource.getFeatures();

    layerSource.clear();
    features.forEach((feature) => {
        feature.set("hideInClustering", true);
        feature.setStyle(() => null);
    });
    layerSource.addFeatures(features);
};

/**
 * Shows all features by setting their style.
 * @returns {void}
 */
STALayer.prototype.showAllFeatures = function () {
    const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
        collection = layerSource.getFeatures();

    collection.forEach((feature) => {
        const style = this.getStyleAsFunction(this.get("style"));

        feature.setStyle(style(feature));
    });
};

/**
 * Only shows features that match the given ids.
 * @param {String[]} featureIdList List of feature ids.
 * @returns {void}
 */
STALayer.prototype.showFeaturesByIds = function (featureIdList) {
    const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
        allLayerFeatures = layerSource.getFeatures(),
        featuresToShow = featureIdList.map(id => layerSource.getFeatureById(id));

    this.hideAllFeatures();
    featuresToShow.forEach(feature => {
        const style = this.getStyleAsFunction(this.get("style"));

        if (feature && feature !== null) {
            feature.set("hideInClustering", false);
            feature.setStyle(style(feature));
        }
    });

    layerSource.addFeatures(allLayerFeatures);
    bridge.resetVectorLayerFeatures(this.get("id"), allLayerFeatures);
};

/**
 * Returns the style as a function.
 * @param {Function|Object} style ol style object or style function.
 * @returns {Function} style as function.
 */
STALayer.prototype.getStyleAsFunction = function (style) {
    if (typeof style === "function") {
        return style;
    }
    return function () {
        return style;
    };
};
/**
 * Sets Style for layer.
 * @returns {void}
 */
STALayer.prototype.styling = function () {
    this.layer.setStyle(this.getStyleAsFunction(this.get("style")));
};

/**
 * Creates features and initializes connections.
 * @returns {void}
 * */
STALayer.prototype.initializeSensorThings = function () {
    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    const url = this.get("useProxy") ? getProxyUrl(this.get("url")) : this.get("url");

    // try {
    //     this.createMqttConnectionToSensorThings(url, this.get("mqttOptions"), this.get("timezone"), this.get("showNoDataValue"), this.get("noDataValue"));
    // }
    // catch (err) {
    //     console.error("Connecting to mqtt-broker failed. Won't receive live updates. Reason:", err);
    // }

    // if (typeof this.options.beforeLoading === "function") {
    //     this.options.beforeLoading();
    // }

    bridge.listenToLayerVisibility(this, () => {
        // this.toggleSubscriptionsOnMapChanges();
    });
    bridge.listenToIsOutOfRange(this, () => {
        this.toggleSubscriptionsOnMapChanges();
    });
    if (this.get("isVisibleInMap")) {
        this.toggleSubscriptionsOnMapChanges();
    }
    if (store.getters["Maps/scale"] > this.get("maxScaleForHistoricalFeatures")) {
        this.showHistoricalFeatures = false;
    }
};

/**
 * Initial loading of sensor data
 * @param {Function} onsuccess a function to call on success
 * @param {Boolean} updateOnly set to true to avoid clearing the source
 * @fires Core#RadioRequestUtilGetProxyURL
 * @returns {void}
 */
STALayer.prototype.initializeConnection = function (onsuccess, updateOnly = false) {
    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    const url = this.get("useProxy") ? getProxyUrl(this.get("url")) : this.get("url"),
        version = this.get("version"),
        urlParams = this.get("urlParameter"),
        currentExtent = {
            extent: store.getters["Maps/getCurrentExtent"],
            sourceProjection: mapCollection.getMapView("2D").getProjection().getCode(),
            targetProjection: this.get("epsg")
        },
        intersect = typeof this.get("intersect") === "boolean" ? this.get("intersect") : true,
        mapProjection = mapCollection.getMapView("2D").getProjection(),
        epsg = this.get("epsg"),
        gfiTheme = this.get("gfiTheme"),
        utc = this.get("utc"),
        isClustered = this.has("clusterDistance"),
        datastreamIds = this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]);

    this.callSensorThingsAPI(url, version, urlParams, currentExtent, intersect, sensorData => {
        const filteredSensorData = !updateOnly ? sensorData : sensorData.filter(data => !datastreamIds.includes(data?.properties?.dataStreamId)),
            features = this.createFeaturesFromSensorData(filteredSensorData, mapProjection, epsg, gfiTheme, utc),
            layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
            oldHistoricalFeatures = layerSource.getFeatures().filter(f => typeof f.get("dataStreamId") === "undefined"),
            copyFeatures = {};

        if (this.get("loadThingsOnlyInCurrentExtent")) {
            oldHistoricalFeatures.forEach(oldFeature => {
                copyFeatures[oldFeature.getId()] = oldFeature.clone();
            });
        }

        if (!updateOnly) {
            layerSource.clear();
        }

        if (Array.isArray(features) && features.length) {
            // layerSource.addFeatures(features);
            if (isObject(features[0]) && typeof features[0].getGeometry === "function" && (features[0].getGeometry().getType() === "Point" || features[0].getGeometry().getType() === "MultiPoint")) {
                this.prepareFeaturesFor3D(features);
            }
            layerSource.addFeatures(features);

            bridge.resetVectorLayerFeatures(this.get("id"), features);
        }

        if (typeof features !== "undefined") {
            this.styling(isClustered);
            this.get("layer").setStyle(this.get("style"));
        }

        // features.forEach(feature => {
            bridge.changeFeatureGFI(feature);
        });

        if (typeof onsuccess === "function") {
            onsuccess(features);
        }
        if (typeof this.options.afterLoading === "function") {
            this.options.afterLoading(features);
        }
        // if (typeof this.get("historicalLocations") === "number") {
        //     this.getHistoricalLocationsOfFeatures();
        // }
    // }, error => {
    //     if (typeof this.options.onLoadingError === "function") {
    //         this.options.onLoadingError(error);
    //     }
    });
};

/**
 * Starts or stops subscription according to its conditions.
 * Because of usage of several listeners it's necessary to create a "isSubscribed" flag to prevent multiple executions.
 * @returns {void}
 */
STALayer.prototype.toggleSubscriptionsOnMapChanges = function () {
    const state = this.getStateOfSTALayer(this.get("isOutOfRange"), this.get("isVisibleInMap"), this.get("isSubscribed"));

    if (state === true) {
        this.createLegend();
        // this.startSubscription(this.get("layer").getSource().getFeatures());
    }
    else if (state === false) {
        this.stopSubscription();
    }
};

/**
 * Returns the state of the layer based on out of range value, isVisibleInMap and isSubscribed.
 * @param {Boolean} isOutOfRange If map Scale is out of defined layer minScale and maxScale.
 * @param {Boolean} isVisibleInMap If value model is visible or not.
 * @param {Boolean} isSubscribed To prevent multiple executions.
 * @returns {Boolean} true if layer should be subscribed, false if not
 */
STALayer.prototype.getStateOfSTALayer = function (isOutOfRange, isVisibleInMap, isSubscribed) {
    if (!isOutOfRange && isVisibleInMap && !isSubscribed) {
        return true;
    }
    else if ((isOutOfRange || !isVisibleInMap) && isSubscribed) {
        return false;
    }
    return undefined;
};

/**
 * Starts mqtt subscriptions based on the layers state.
 * @param {ol/Feature[]} features all features of the Layer
 * @returns {void}
 */
STALayer.prototype.startSubscription = function (features) {
    this.set("isSubscribed", true);
    if (!this.get("loadThingsOnlyInCurrentExtent") && Array.isArray(features) && !features.length) {
        this.initializeConnection(function () {
            this.updateSubscription();
            store.dispatch("Maps/registerListener", {type: "moveend", listener: this.updateSubscription.bind(this)});
            this.keepUpdating = true;
            if (this.get("enableContinuousRequest")) {
                this.startIntervalUpdate(typeof this.get("factor") === "number" ? this.get("factor") * 1000 : undefined);
            }
        }.bind(this));
    }
    else {
        this.updateSubscription();
        store.dispatch("Maps/registerListener", {type: "moveend", listener: this.updateSubscription.bind(this)});
        this.keepUpdating = true;
        if (this.get("enableContinuousRequest")) {
            this.startIntervalUpdate(typeof this.get("factor") === "number" ? this.get("factor") * 1000 : undefined);
        }
    }
};

/**
 * Stops mqtt subscriptions based on the layers state.
 * @returns {void}
 */
// STALayer.prototype.stopSubscription = function () {
//     const subscriptionTopics = this.get("subscriptionTopics"),
//         version = this.get("version"),
//         isVisibleInMap = this.get("isVisibleInMap"),
//         mqttClient = this.mqttClient;

    this.set("isSubscribed", false);
    store.dispatch("Maps/unregisterListener", {type: "moveend", listener: this.updateSubscription.bind(this)});
    this.unsubscribeFromSensorThings([], subscriptionTopics, version, isVisibleInMap, mqttClient);
    clearInterval(this.intervallRequest);
    this.keepUpdating = false;
};

/**
 * Starts the interval for continous updating the features in the current extent.
 * @param {Number} timeout The timeout in milliseconds.
 * @returns {void}
 */
STALayer.prototype.startIntervalUpdate = function (timeout) {
    if (!this.keepUpdating || typeof timeout !== "number") {
        return;
    }
    if (this.intervallRequest !== null) {
        clearInterval(this.intervallRequest);
    }
    this.intervallRequest = setTimeout(() => {
        const datastreamIds = this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]),
            subscriptionTopics = this.get("subscriptionTopics"),
            version = this.get("version"),
            isVisibleInMap = this.get("isVisibleInMap"),
            mqttClient = this.mqttClient,
            rh = this.get("mqttRh"),
            qos = this.get("mqttQos");

        this.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, version, isVisibleInMap, mqttClient);
        this.initializeConnection(async features => {
            await this.subscribeToSensorThings(
                this.getDatastreamIdsInCurrentExtent(features, store.getters["Maps/getCurrentExtent"]),
                subscriptionTopics,
                version,
                mqttClient,
                {rh, qos}
            );
        }, true);
        this.startIntervalUpdate(timeout);
    }, timeout);
};

/**
 * Refreshes all subscriptions by ending all established subscriptions and creating new ones.
 * @returns {void}
 */
STALayer.prototype.updateSubscription = function () {
    // Timout to avoid display issues with url params see FLS-299 ticket. Issue has to be resolved without timeout.
    setTimeout(() =>{
        // const datastreamIds = this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]),
        //     subscriptionTopics = this.get("subscriptionTopics"),
        //     version = this.get("version"),
        //     isVisibleInMap = this.get("isVisibleInMap"),
        //     mqttClient = this.mqttClient,
        //     rh = this.get("mqttRh"),
        //     qos = this.get("mqttQos");

        if (!this.get("loadThingsOnlyInCurrentExtent") && !this.moveLayerRevisible) {
            this.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, version, isVisibleInMap, mqttClient);
            await this.subscribeToSensorThings(datastreamIds, subscriptionTopics, version, mqttClient, {rh, qos});
        }
        else {
            this.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, version, isVisibleInMap, mqttClient);
            this.initializeConnection(async () => {
                await this.subscribeToSensorThings(
                    this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]),
                    subscriptionTopics,
                    version,
                    mqttClient,
                    {rh, qos}
                );
            });
        }
        this.moveLayerRevisible = false;
    }, 2000);
};

// /**
//  * Updates feature properties.
//  * @param {ol/Feature} feature feature to be updated
//  * @param {String} dataStreamId the datastream id
//  * @param {String} result the new state
//  * @param {String} phenomenonTime the new phenomenonTime
//  * @param {Boolean} showNoDataValue true if "nodata" value should be shown, false if not
//  * @param {String} noDataValue the value to use for "nodata"
//  * @param {Function} funcChangeFeatureGFI a function to change feature gfi with
//  * @returns {Boolean} true on success, false if something went wrong
//  */
STALayer.prototype.updateFeatureProperties = function (feature, dataStreamId, result, phenomenonTime, showNoDataValue, noDataValue, funcChangeFeatureGFI) {
//     if (
//         typeof feature?.get !== "function"
//         || typeof feature?.set !== "function"
//         || typeof feature.get("dataStreamId") !== "string"
//         || typeof feature.get("dataStreamName") !== "string"
//     ) {
//         return false;
//     }
//     const dataStreamIdIdx = feature.get("dataStreamId").split(" | ").indexOf(String(dataStreamId)),
//         dataStreamNameArray = feature.get("dataStreamName").split(" | "),
//         dataStreamName = Object.prototype.hasOwnProperty.call(dataStreamNameArray, dataStreamIdIdx) ? dataStreamNameArray[dataStreamIdIdx] : "",
//         preparedResult = result === "" && showNoDataValue ? noDataValue : result;

    // feature.set("dataStream_" + dataStreamId + "_" + dataStreamName, preparedResult, true);
    // feature.set("dataStream_" + dataStreamId + "_" + dataStreamName + "_phenomenonTime", phenomenonTime, true);
    // feature.set("dataStreamValue", this.replaceValueInPipedProperty(feature, "dataStreamValue", dataStreamId, preparedResult));
    // feature.set("dataStreamPhenomenonTime", this.replaceValueInPipedProperty(feature, "dataStreamPhenomenonTime", dataStreamId, phenomenonTime));

    if (typeof feature.get("rotation") !== "undefined" && typeof preparedResult !== "undefined") {
        feature.set("rotation", {
            isDegree: true,
            value: preparedResult
        });
    }

    if (typeof funcChangeFeatureGFI === "function") {
        funcChangeFeatureGFI(feature);
    }

    // return true;
};

/**
 * Once function which registers given handler by event name.
 * @param {String} eventName The event name.
 * @param {Function} handler The handler.
 * @returns {void}
 */
STALayer.prototype.once = function (eventName, handler) {
    if (typeof handler !== "function") {
        return;
    }

    if (eventName === "featuresloadend") {
        this.onceEvents.featuresloadend.push(handler);
    }
};

/**
 * Fetches historical locations and return it to callback function.
 * Only for the current extent to minimize the traffic.
 * @param {String} url The base url.
 * @param {Object} urlParams The url parameter.
 * @param {String} version The version.
 * @param {Function} onsuccess The callback function to return the data.
 * @returns {void}
 */
STALayer.prototype.fetchHistoricalLocations = function (url, urlParams, version, onsuccess) {
    if (typeof url !== "string" || typeof version !== "string" || !isObject(urlParams)) {
        return;
    }

    const requestUrl = this.buildSensorThingsUrl(url, version, urlParams),
        http = new SensorThingsHttp({
            rootNode: urlParams?.root
        });

    http.getInExtent(requestUrl, {
        extent: store.getters["Maps/getCurrentExtent"],
        sourceProjection: store.getters["Maps/projection"].getCode(),
        targetProjection: this.get("epsg")
    }, true, result => {
        if (typeof onsuccess === "function") {
            onsuccess(result);
        }
    }, null, null, error => {
        console.warn(error);
    });
};

/**
 * Calls the sta api to get historical locations.
 * @returns {void}
 */
STALayer.prototype.getHistoricalLocationsOfFeatures = function () {
    const allFeatures = (this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource")).getFeatures(),
        featuresWithoutHistoricalIds = allFeatures.filter(feature => typeof feature.get("dataStreamId") !== "undefined" && !Array.isArray(feature.get("historicalFeatureIds"))),
        datastreamIds = this.getDatastreamIdsInCurrentExtent(featuresWithoutHistoricalIds, store.getters["Maps/getCurrentExtent"]),
        url = this.get("url"),
        urlParam = {
            orderby: "time+desc",
            expand: "Locations"
        },
        version = this.get("version"),
        amount = parseInt(this.get("historicalLocations"), 10);

    datastreamIds.forEach(datastreamId => {
        this.fetchHistoricalLocationsByDatastreamId(allFeatures, datastreamId, amount, url, urlParam, version);
    });
};
/**
 * Fetches the historical locations by given datastream id.
 * @param {ol/Feature[]} allFeatures All features on the map
 * @param {Number} datastreamId Datastream id to to fetch for
 * @param {Number} amount The amount of locations to fetch
 * @param {String} url The base url
 * @param {Object} urlParam Url params i.e.: {orderby: "time+desc"}
 * @param {String} version The version
 * @param {Function} onsuccess The function to call on success
 * @returns {void}
 */
STALayer.prototype.fetchHistoricalLocationsByDatastreamId = function (allFeatures, datastreamId, amount, url, urlParam, version, onsuccess) {
    if (!Array.isArray(allFeatures) || typeof datastreamId === "undefined" || isNaN(amount) || typeof url !== "string" || !isObject(urlParam) || typeof version !== "string") {
        return;
    }
    const feature = this.getFeatureByDatastreamId(allFeatures, datastreamId);

    urlParam.root = `Datastreams(${datastreamId})/Thing/HistoricalLocations`;
    urlParam.top = amount + 1;
    if (this.subscribedDataStreamIds[datastreamId]?.subscribed && feature.get("historicalFeatureIds")) {
        return;
    }
    this.fetchHistoricalLocations(url, urlParam, version, historicalSensorData => {
        this.resetHistoricalLocations(datastreamId);
        if (this.locationUpdating[datastreamId]) {
            this.parseSensorDataToFeature(feature, historicalSensorData, urlParam, url, version);
            return;
        }
        if (!Array.isArray(historicalSensorData) || !Array.isArray(historicalSensorData[0]?.Locations) || !historicalSensorData[0].Locations.length) {
            return;
        }
        this.updateFeatureLocation(feature, historicalSensorData[0].Locations[0], () => {
            this.parseSensorDataToFeature(feature, historicalSensorData, urlParam, url, version);
            unByKey(this.eventKeys[datastreamId]);
            if (typeof onsuccess === "function") {
                onsuccess();
            }
            this.locationUpdating[feature.get("dataStreamId")] = false;
        });
    });
};
/**
 * Parses the given sensor data to features and adds their ids to the given feature.
 * @param {ol/Feature} feature The feature.
 * @param {Object[]} sensorData The sensor data to create features for.
 * @param {Object} urlParam The url param object.
 * @param {String} url The base url.
 * @param {String} version The version.
 * @returns {void}
 */
STALayer.prototype.parseSensorDataToFeature = function (feature, sensorData, urlParam, url, version) {
    if (typeof feature?.get !== "function" || Array.isArray(feature.get("historicalFeatureIds"))) {
        return;
    }

    const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
        mapProjection = store.getters["Maps/projection"].getCode(),
        epsg = this.get("epsg"),
        gfiTheme = this.get("gfiTheme"),
        utc = this.get("utc"),
        things = this.getAllThings(sensorData, urlParam, url, version),
        historicalFeatures = this.createFeaturesFromSensorData(things, mapProjection, epsg, gfiTheme, utc, true),
        historicalFeatureIds = [];

    historicalFeatures.shift();
    historicalFeatures.forEach(hFeature => {
        historicalFeatureIds.push(hFeature.getId());
        this.setStyleOfHistoricalFeature(hFeature, hFeature.get("scale"), this.styleRule);
    });
    layerSource.addFeatures(historicalFeatures);
    feature.set("historicalFeatureIds", historicalFeatureIds);
    if (isObject(this.subscribedDataStreamIds[feature.get("dataStreamId")])) {
        Object.assign(this.subscribedDataStreamIds[feature.get("dataStreamId")], {
            historicalFeatureIds
        });
    }
};

/**
 * Resets the historical locations of the feature which is found by the given datastream id.
 * @param {Number} datastreamId The datastream id to get the feature for.
 * @returns {void}
 */
STALayer.prototype.resetHistoricalLocations = function (datastreamId) {
    const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
        feature = layerSource.getFeatures().filter(layerFeature => typeof layerFeature?.get === "function" && layerFeature.get("dataStreamId") === datastreamId)[0];

    if (typeof feature?.get === "function" && Array.isArray(feature.get("historicalFeatureIds"))) {
        feature.get("historicalFeatureIds").forEach(featureId => layerSource.removeFeature(layerSource.getFeatureById(featureId)));
        feature.unset("historicalFeatureIds");
    }
};

/**
 * Gets the individual scale of the feature according to the index of historical feature and amount of historical features.
 * The first historical fature has a scale 0.8 and the last one has a scale 0.2.
 * @param {Number} index The index of the historical feature
 * @param {Number} amount The amount of the historical features
 * @param {Boolean} scaleStyleByZoom - Flag for the style to be dependent on the zoom level.
 * @param {Number} [zoomLevel=1] - The current zoom level.
 * @param {Number} [zoomLevelCount=1] - The number of zoom levels.
 * @returns {Number} scale
 */
STALayer.prototype.getScale = function (index, amount, scaleStyleByZoom = false, zoomLevel = 1, zoomLevelCount = 1) {
    if (scaleStyleByZoom) {
        return (0.7 - 0.5 * index / amount) * zoomLevel / zoomLevelCount;
    }
    return 0.7 - 0.5 * index / amount;
};
/**
 * Sets the style of historical feature
 * @param {ol/Feature} feature The feature.
 * @param {Number} scale the icon scale in style
 * @param {Object[]} styleRule the style rule of the sta features
 * @returns {void}
 */
STALayer.prototype.setStyleOfHistoricalFeature = function (feature, scale, styleRule) {
    if (!Array.isArray(styleRule) || !styleRule.length || !styleRule[0].style) {
        console.error("The style rule is not right");
        return;
    }

    const style = this.getStyleOfHistoricalFeature(styleRule[0].style, scale);

    feature.setStyle(() => style);
};

/**
 * Parses and gets the style of historical feature.
 * @param {Object} style The style object of current feature.
 * @param {Number} scale the icon scale in style
 * @returns {void}
 */
STALayer.prototype.getStyleOfHistoricalFeature = function (style, scale) {
    let circleRadius,
        circleFillColor,
        circleStrokeColor,
        circleStrokeWidth;

    if (style.type === "regularShape") {
        circleRadius = style.rsRadius;
        circleFillColor = style.rsFillColor;
        circleStrokeColor = style.rsStrokeColor;
        circleStrokeWidth = style.rsStrokeWidth;
    }
    else {
        circleRadius = style.circleRadius ? style.circleRadius : 10;
        circleFillColor = style.circleFillColor ? style.circleFillColor : [0, 153, 255, 1];
        circleStrokeColor = style.circleStrokeColor ? style.circleStrokeColor : [0, 0, 0, 1];
        circleStrokeWidth = style.circleStrokeWidth ? style.circleStrokeWidth : 2;
    }

    return new Style({
        image: new CircleStyle({
            radius: circleRadius,
            fill: new Fill({
                color: circleFillColor
            }),
            stroke: new Stroke({
                color: circleStrokeColor,
                width: circleStrokeWidth
            }),
            scale: scale
        })
    });
};

/**
 * Sets the scale of style for historical feature dynamically according to the zoom level
 * @param {ol/Feature[]} features the historical features
 * @param {Number} zoomLevel the current zoom level
 * @param {Number} zoomLevelCount the count of zoom level
 * @param {Boolean} observeLocation if the location is observed
 * @param {Boolean} scaleStyleByZoom if the scale of style is reset by zoom
 * @returns {void}
 */
STALayer.prototype.setDynamicalScaleOfHistoricalFeatures = function (features, zoomLevel, zoomLevelCount, observeLocation, scaleStyleByZoom) {
    if (!observeLocation || !scaleStyleByZoom || typeof zoomLevel !== "number" || zoomLevelCount < 1) {
        return;
    }
    features.forEach(feature => {
        const style = feature.getStyle()(feature);

        if (typeof style.getImage === "function" && style.getImage() !== null) {
            style.getImage().setScale(feature.get("originScale") * zoomLevel / zoomLevelCount);
            feature.setStyle(() => style);
        }
    });
};

/**
 * Register interaction of resolution in map view.
 * @param {Boolean} scaleStyleByZoom if the scale of style is reset by zoom
 * @returns {void}
 */
STALayer.prototype.registerInteractionMapResolutionListeners = function (scaleStyleByZoom) {
    if (!scaleStyleByZoom) {
        return;
    }
    store.watch((state, getters) => getters["Maps/resolution"], resolution => {
        const layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource"),
            allFeatures = layerSource.getFeatures(),
            historicalFeatures = allFeatures.filter(feature => typeof feature.get("dataStreamId") === "undefined" && typeof feature.get("originScale") !== "undefined"),
            zoomLevel = store.getters["Maps/getView"].getZoomForResolution(resolution) + 1,
            zoomLevelCount = store.getters["Maps/getView"].getResolutions().length;

        this.setDynamicalScaleOfHistoricalFeatures(historicalFeatures, zoomLevel, zoomLevelCount, this.get("observeLocation"), scaleStyleByZoom);
    });
};

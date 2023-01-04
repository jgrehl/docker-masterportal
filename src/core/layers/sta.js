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

    // this.intervallRequest = null;
    // this.keepUpdating = false;
    // this.moveLayerRevisible = "";

    moment.locale("de");
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
            // gfiAttributes: attrs.gfiAttributes,
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
        // version = this.get("version"),
        // urlParams = this.get("urlParameter"),
        // currentExtent = {
        //     extent: store.getters["Maps/getCurrentExtent"],
        //     sourceProjection: mapCollection.getMapView("2D").getProjection().getCode(),
        //     targetProjection: this.get("epsg")
        // },
        // intersect = typeof this.get("intersect") === "boolean" ? this.get("intersect") : true,
        // mapProjection = mapCollection.getMapView("2D").getProjection(),
        // epsg = this.get("epsg"),
        // gfiTheme = this.get("gfiTheme"),
        // utc = this.get("utc"),
        isClustered = this.has("clusterDistance");
        // datastreamIds = this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]);

    this.callSensorThingsAPI(url, version, urlParams, currentExtent, intersect, sensorData => {
        // const filteredSensorData = !updateOnly ? sensorData : sensorData.filter(data => !datastreamIds.includes(data?.properties?.dataStreamId)),
        //     features = this.createFeaturesFromSensorData(filteredSensorData, mapProjection, epsg, gfiTheme, utc),
        //     layerSource = this.get("layerSource") instanceof Cluster ? this.get("layerSource").getSource() : this.get("layerSource");

        // if (!updateOnly) {
        //     layerSource.clear();
        // }

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

        // if (typeof onsuccess === "function") {
        //     onsuccess(features);
        // }
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
    // });
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
        // if (this.get("observeLocation") && this.moveLayerRevisible === false) {
        //     this.moveLayerRevisible = state;
        // }
    }
    else if (state === false) {
        this.stopSubscription();
    }
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

        // if (!this.get("loadThingsOnlyInCurrentExtent") && !this.moveLayerRevisible) {
        //     this.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, version, isVisibleInMap, mqttClient);
        //     this.subscribeToSensorThings(datastreamIds, subscriptionTopics, version, mqttClient, {rh, qos});
        //     if (typeof this.get("historicalLocations") === "number") {
        //         this.getHistoricalLocationsOfFeatures();
        //     }
        // }
        // else {
        //     this.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, version, isVisibleInMap, mqttClient);
        //     this.initializeConnection(() => {
        //         this.subscribeToSensorThings(
        //             this.getDatastreamIdsInCurrentExtent(this.get("layer").getSource().getFeatures(), store.getters["Maps/getCurrentExtent"]),
        //             subscriptionTopics,
        //             version,
        //             mqttClient,
        //             {rh, qos}
        //         );
        //     });
        // }
        // this.moveLayerRevisible = false;
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

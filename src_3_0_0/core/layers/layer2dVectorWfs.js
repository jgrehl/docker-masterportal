
import {bbox, all} from "ol/loadingstrategy.js";
import {wfs} from "@masterportal/masterportalapi";
import Layer2dVector from "./layer2dVector";

/**
 * Creates a 2d vector wfs layer.
 * @constructs
 * @extends Layer2dVector
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dVectorWfs (attributes) {
    const defaultAttributes = {
        outputFormat: "XML",
        version: "1.1.0",
        loadingStrategy: "all"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2dVector.call(this, this.attributes);
}

Layer2dVectorWfs.prototype = Object.create(Layer2dVector.prototype);

/**
 * Creates a layer of type WFS by using wfs-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
Layer2dVectorWfs.prototype.createLayer = function (attributes) {
    const rawLayerAttributes = this.getRawLayerAttributes(attributes),
        layerParams = this.getLayerParams(attributes),
        options = this.getOptions(attributes);

    this.layer = wfs.createLayer(rawLayerAttributes, {layerParams, options});
};

/**
 * Gets raw layer attributes from attributes.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The raw layer attributes.
 */
Layer2dVectorWfs.prototype.getRawLayerAttributes = function (attributes) {
    return {
        clusterDistance: attributes.clusterDistance,
        featureNS: attributes.featureNS,
        featureType: attributes.featureType,
        id: attributes.id,
        url: attributes.url,
        version: attributes.version
    };
};

/**
 * Gets additional layer params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Obeject} The layer params.
 */
Layer2dVectorWfs.prototype.getLayerParams = function (attributes) {
    return {
        name: attributes.name,
        typ: attributes.typ
    };
};

/**
 * Gets additional options.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The options.
 */
Layer2dVectorWfs.prototype.getOptions = function (attributes) {
    const options = {
        clusterGeometryFunction: this.clusterGeometryFunction,
        doNotLoadInitially: attributes.doNotLoadInitially,
        featuresFilter: (features) => this.featuresFilter(attributes, features),
        loadingParams: this.loadingParams(attributes),
        loadingStrategy: attributes.loadingStrategy === "all" ? all : bbox,
        onLoadingError: this.onLoadingError,
        wfsFilter: attributes.wfsFilter
    };

    return options;
};

/**
 * Gets the cluster feature geometry.
 * Note: Do not cluster invisible features;
 * can't rely on style since it will be null initially.
 * @param {module:ol/Feature~Feature} feature The ol feature.
 * @returns {module:ol/geom/Point~Point} The feature geometry.
 */
Layer2dVectorWfs.prototype.clusterGeometryFunction = function (feature) {
    if (feature.get("hideInClustering") === true) {
        return null;
    }

    return feature.getGeometry();
};

/**
 * Returns a function to filter features with.
 * Note: only use features with a geometry.
 * @param {Object} attributes The attributes of the layer configuration.
 * @param {module:ol/Feature~Feature[]} features The ol features.
 * @returns {Function} to filter features with
 */
Layer2dVectorWfs.prototype.featuresFilter = function (attributes, features) {
    let filteredFeatures = features.filter(feature => feature.getGeometry() !== undefined);

    if (attributes.bboxGeometry) {
        filteredFeatures = filteredFeatures.filter((feature) => attributes.bboxGeometry.intersectsExtent(feature.getGeometry().getExtent()));
    }
    return filteredFeatures;
};

/**
 * Gets the loading params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The loading Params.
 */
Layer2dVectorWfs.prototype.loadingParams = function (attributes) {
    const loadingParams = {
        xhrParameters: attributes.isSecured ? {credentials: "include"} : undefined,
        propertyname: this.propertyNames(attributes),
        // only used if loading strategy is all
        bbox: attributes.bboxGeometry ? attributes.bboxGeometry.getExtent().toString() : undefined
    };

    return loadingParams;
};

/**
 * Returns the propertyNames as comma separated string.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {string} The propertynames as string.
 */
Layer2dVectorWfs.prototype.propertyNames = function (attributes) {
    let propertyname = "";

    if (Array.isArray(attributes.propertyNames)) {
        propertyname = attributes.propertyNames.join(",");
    }

    return propertyname;
};

/**
 * Print the on loading error message.
 * @param {Error} error The error message.
 * @returns {void}
 */
Layer2dVectorWfs.prototype.onLoadingError = function (error) {
    console.error("Masterportal wfs loading error: ", error);
};

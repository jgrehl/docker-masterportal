
import Layer2d from "./layer2d";

/**
 * Creates a 2d vector layer.
 * @abstract
 * @constructs
 * @extends Layer2d
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dVector (attributes) {
    const defaultAttributes = {
        altitudeMode: "clampToGround"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2d.call(this, this.attributes);
}

Layer2dVector.prototype = Object.create(Layer2d.prototype);

/**
 * Gets the cluster feature geometry.
 * Note: Do not cluster invisible features;
 * can't rely on style since it will be null initially.
 * @param {module:ol/Feature~Feature} feature The ol feature.
 * @returns {module:ol/geom/Point~Point} The feature geometry.
 */
Layer2dVector.prototype.clusterGeometryFunction = function (feature) {
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
Layer2dVector.prototype.featuresFilter = function (attributes, features) {
    let filteredFeatures = features.filter(feature => feature.getGeometry() !== undefined);

    if (attributes.bboxGeometry) {
        filteredFeatures = filteredFeatures.filter((feature) => attributes.bboxGeometry.intersectsExtent(feature.getGeometry().getExtent()));
    }
    return filteredFeatures;
};

/**
 * Print the on loading error message.
 * @param {Error} error The error message.
 * @returns {void}
 */
Layer2dVector.prototype.onLoadingError = function (error) {
    console.error("Masterportal wfs loading error: ", error);
};

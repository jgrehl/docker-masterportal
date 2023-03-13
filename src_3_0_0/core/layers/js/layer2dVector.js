import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import {getCenter} from "ol/extent";
import webgl from "./webglRenderer";
import Layer2d from "./layer2d";
import Cluster from "ol/source/Cluster";

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
        altitudeMode: "clampToGround",
        crs: mapCollection.getMapView("2D").getProjection().getCode(),
        renderer: "default",
        styleId: "default"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2d.call(this, this.attributes);
    // override class methods for webgl rendering
    // has to happen before setStyle
    if (attributes.renderer === "webgl") {
        webgl.setLayerProperties(this);
    }
    this.setStyle(this.getStyleFunction(attributes));
    this.prepareFeaturesFor3D(this.layer?.getSource().getFeatures());
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
 * @returns {module:ol/Feature~Feature[]} to filter features with
 */
Layer2dVector.prototype.featuresFilter = function (attributes, features) {
    let filteredFeatures = features.filter(feature => feature.getGeometry() !== undefined);

    if (attributes.bboxGeometry) {
        filteredFeatures = filteredFeatures.filter(
            (feature) => attributes.bboxGeometry.intersectsCoordinate(getCenter(feature.getGeometry().getExtent()))
        );
    }

    return filteredFeatures;
};

/**
 * Gets additional layer params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The layer params.
 */
Layer2dVector.prototype.getLayerParams = function (attributes) {
    return {
        altitudeMode: attributes.altitudeMode,
        gfiAttributes: attributes.gfiAttributes,
        gfiTheme: attributes.gfiTheme,
        name: attributes.name,
        opacity: (100 - attributes.transparency) / 100,
        typ: attributes.typ,
        zIndex: attributes.zIndex,
        renderer: attributes.renderer, // use "default" (canvas) or "webgl" renderer
        styleId: attributes.styleId, // styleId to pass to masterportalapi
        style: attributes.style, // style function to style the layer or WebGLPoints style syntax
        excludeTypesFromParsing: attributes.excludeTypesFromParsing, // types that should not be parsed from strings, only necessary for webgl
        isPointLayer: attributes.isPointLayer // whether the source will only hold point data, only necessary for webgl
    };
};

/**
 * Gets the loading params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The loading Params.
 */
Layer2dVector.prototype.loadingParams = function (attributes) {
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
 * @returns {String} The propertynames as string.
 */
Layer2dVector.prototype.propertyNames = function (attributes) {
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
Layer2dVector.prototype.onLoadingError = function (error) {
    console.error("Masterportal wfs loading error: ", error);
};

/**
 * Setter for style of ol layer.
 * @param {Object} value The style to set at ol layer. If value is null, undefined is set as style at layer to use defaultStyle.
 * @returns {void}
 */
Layer2dVector.prototype.setStyle = function (value) {
    const style = value === null ? undefined : value;

    this.set("style", value);
    this.getLayer()?.setStyle(style);
};

/**
 * Sets Style for layer.
 * @param {Object} attrs  params of the raw layer
 * @returns {void}
 */
Layer2dVector.prototype.getStyleFunction = function (attrs) {
    let style = null;

    if (typeof attrs.styleId !== "undefined") {
        const styleId = attrs.styleId,
            styleObject = styleList.returnStyleObject(styleId);
        let isClusterFeature = false;

        if (styleObject !== undefined) {
            style = (feature) => {
                const feat = feature !== undefined ? feature : this;

                isClusterFeature = typeof feat.get("features") === "function" || typeof feat.get("features") === "object" && Boolean(feat.get("features"));
                return createStyle.createStyle(styleObject, feat, isClusterFeature, Config.wfsImgPath);
            };
        }
        else {
            console.warn(i18next.t("common:modules.core.modelList.layer.wrongStyleId", {styleId}));
        }
    }
    return style;
};
/**
 * Only shows features that match the given ids.
 * @param {String[]} featureIdList List of feature ids.
 * @returns {void}
 */
Layer2dVector.prototype.showFeaturesByIds = function (featureIdList) {
    const layerSource = this.getLayerSource() instanceof Cluster ? this.getLayerSource().getSource() : this.getLayerSource(),
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
};

/**
 * Hides all features by setting style= null for all features.
 * @returns {void}
 */
Layer2dVector.prototype.hideAllFeatures = function () {
    const layerSource = this.getLayerSource() instanceof Cluster ? this.getLayerSource().getSource() : this.getLayerSource(),
        features = layerSource.getFeatures();

    // optimization - clear and re-add to prevent cluster updates on each change
    layerSource.clear();

    features.forEach((feature) => {
        feature.set("hideInClustering", true);
        feature.setStyle(() => null);
    });

    layerSource.addFeatures(features);
};

/**
 * Returns the style as a function.
 * @param {Function|Object} style ol style object or style function.
 * @returns {Function} - style as function.
 */
Layer2dVector.prototype.getStyleAsFunction = function (style) {
    if (typeof style === "function") {
        return style;
    }

    return function () {
        return style;
    };
};

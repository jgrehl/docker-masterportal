import layerCollection from "../../../core/layers/js/layerCollection";
import layerFactory from "../../../core/layers/js/layerFactory";
import store from "../../../app-store";
import SearchInterface from "./searchInterface";

import Cluster from "ol/source/Cluster";
import * as olExtent from "ol/extent";
import {Icon} from "ol/style.js";

/**
 * The search interface to the visible vector.
 * @constructs
 * @extends SearchInterface
 * @param {Object} [resultEvents] Actions that are executed when an interaction, such as hover or click, is performed with a result list item.
 * @param {String[]} [resultEvents.onClick=["openGetFeatureInfo", "setMarker", "zoomToResult"]] Actions that are fired when clicking on a result list item.
 * @param {String[]} [resultEvents.onHover=["setMarker"]] Actions that are fired when hovering on a result list item.
 * @param {String} [searchInterfaceId="visibleVector"] The id of the service interface.
 * @returns {void}
 */
export default function SearchInterfaceVisibleVector ({resultEvents, searchInterfaceId} = {}) {
    SearchInterface.call(this,
        "client",
        searchInterfaceId || "visibleVector",
        resultEvents || {
            onClick: ["openGetFeatureInfo", "setMarker", "zoomToResult"],
            onHover: ["setMarker"]
        });
}

SearchInterfaceVisibleVector.prototype = Object.create(SearchInterface.prototype);

/**
 * Search in visible vector search interface.
 * @override
 * @param {String} searchInput The search input.
 * @returns {void}
 */
SearchInterfaceVisibleVector.prototype.search = async function (searchInput) {
    this.searchState = "running";

    const vectorLayerTypes = layerFactory.getVectorLayerTypes(),
        visibleVectorLayerConfigs = store.getters.visibleLayerConfigs.filter(layerConfig => {
            return vectorLayerTypes.includes(layerConfig.typ) && layerConfig.searchField && layerConfig.searchField !== "";
        }),
        foundFeatures = this.findMatchingFeatures(visibleVectorLayerConfigs, searchInput);

    this.pushHitsToSearchResults(foundFeatures);

    this.searchState = "finished";
    return this.searchResults;
};

/**
 * Filters features of all layers according to given search input. Searched fields are
 * defined in config.
 * @param {Object[]} visibleVectorLayerConfigs Contains visible vector layer configs with search field.
 * @param {String} searchInput The search input.
 * @returns {ol/Feature[]} Array of features containing searched input.
 */
SearchInterfaceVisibleVector.prototype.findMatchingFeatures = function (visibleVectorLayerConfigs, searchInput) {
    const foundFeatures = [];

    visibleVectorLayerConfigs.forEach(layerConfig => {
        const layer = layerCollection.getLayerById(layerConfig.id),
            layerSource = layer.getLayerSource() instanceof Cluster ? layer.getLayerSource().getSource() : layer.getLayerSource(),
            searchFields = Array.isArray(layerConfig.searchField) ? layerConfig.searchField : [layerConfig.searchField],
            features = layerSource.getFeatures();

        searchFields.forEach(searchField => {
            features.forEach(feature => {
                const upperSearchField = String(feature.get(searchField)).toUpperCase(),
                    upperSearchInput = searchInput.toUpperCase();

                if (upperSearchField.indexOf(upperSearchInput) !== -1) {
                    foundFeatures.push(this.normalizeResult(feature, layer, searchField));
                }
            });
        });
    });

    return foundFeatures;
};

/**
 * Normalizes the features to display them in a SearchResult.
 * @param {ol/Feature} feature The found feature.
 * @param {Object} layer The vector layer.
 * @param {String} searchField The search field.
 * @returns {Object} The normalized search result.
 */
SearchInterfaceVisibleVector.prototype.normalizeResult = function (feature, layer, searchField) {
    return {
        events: this.normalizeResultEvents(this.resultEvents, feature, layer),
        category: layer.attributes.name,
        displayedInfo: this.getAdditionalInfo(feature, layer),
        imagePath: this.getImageSource(feature, layer),
        id: feature.ol_uid,
        name: feature.get(searchField),
        toolTip: feature.get(searchField)
    };
};

/**
 * Get additional feature info.
 * @param {ol/Feature} feature The found feature.
 * @param {Object} layer The vector layer.
 * @returns {mixed} found additional info
 */
SearchInterfaceVisibleVector.prototype.getAdditionalInfo = function (feature, layer) {
    return feature.get(layer.attributes.additionalInfoField) || "";
};

/**
 * Returns an image source of a feature style.
 * @param {ol/Feature} feature The found feature.
 * @param {Object} layer The vector layer.
 * @return {String} Image source of image style.
 */
SearchInterfaceVisibleVector.prototype.getImageSource = function (feature, layer) {
    let imageSource = "";

    if (feature.getGeometry().getType() === "Point" || feature.getGeometry().getType() === "MultiPoint") {
        const layerStyle = layer.attributes.style(feature);

        if (Array.isArray(layerStyle)) {
            imageSource = this.getImageSourceFromStyle(layerStyle[0]);
        }
        else {
            imageSource = this.getImageSourceFromStyle(layerStyle);
        }
    }

    return imageSource;
};

/**
 * Checks if style is an image and then returns its image source.
 * @param {Style} layerStyle Style of layer.
 * @returns {String} Image source of image style.
 */
SearchInterfaceVisibleVector.prototype.getImageSourceFromStyle = function (layerStyle) {
    return layerStyle.getImage() instanceof Icon ? layerStyle.getImage().getSrc() : "";
};

/**
 * Creates the possible actions and fills them.
 * @param {Object} feature The search result feature of visibleVector.
 * @param {Object} layer The vector layer.
 * @returns {Object} The possible actions.
 */
SearchInterfaceVisibleVector.prototype.createPossibleActions = function (feature, layer) {
    const centerCoordinate = olExtent.getCenter(feature.getGeometry().getExtent());

    return {
        openGetFeatureInfo: {
            featureId: feature.getId(),
            layerId: layer.attributes.id,
            closeResults: true
        },
        setMarker: {
            coordinates: centerCoordinate,
            closeResults: true
        },
        zoomToFeature: {
            coordinates: centerCoordinate,
            closeResults: true
        }
    };
};

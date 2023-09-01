import receivePossibleProperties from "./receivePossibleProperties";

/**
 * Prepares the possible feature properties to be set for
 * a DescribeFeatureType request and joins this together
 * with the gfiAttributes configuration of the layer.
 *
 * @param {TransactionLayer} layer Layer to retrieve information for.
 * @returns {FeatureProperty[]} If layer.gfiAttributes !== "ignore", then an array of prepared feature properties; else and empty array.
 */
async function prepareFeatureProperties (layer) {
    if (layer.gfiAttributes === "ignore") {
        return [];
    }
    const properties = await receivePossibleProperties.receivePossibleProperties(layer);

    return layer.gfiAttributes === "showAll"
        ? properties
        : properties
            .reduce((array, property) => layer.gfiAttributes[property.key] !== undefined
                ? [...array, {...property, label: layer.gfiAttributes[property.key]}]
                : array,
            [properties.find(({type}) => type === "geometry")]);
}

export default {prepareFeatureProperties};

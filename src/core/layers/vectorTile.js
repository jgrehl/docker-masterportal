import Layer from "./layer";
import store from "../../app-store";

/**
 * Creates a layer of type vectorTile.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function VectorTileLayer (attrs) {
    const defaults = {
            selectedStyleID: undefined,
            useMpFonts: true,
            useProxy: false,
            sourceUpdate: false
        },
        mapEPSG = store.getters["Maps/projection"].getCode(),
        vtEPSG = attrs.epsg || mapEPSG;

    if (mapEPSG !== vtEPSG) {
        // console.warn(`VT Layer ${attrs.name}: Map (${mapEPSG}) and layer (${vtEPSG}) projection mismatch. View will be erroneous.`);
        attrs.isNeverVisibleInTree = true;
    }
    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.setConfiguredLayerStyle();
}

// Link prototypes and add prototype methods, means VTL uses all methods and properties of Layer
VectorTileLayer.prototype = Object.create(Layer.prototype);

/**
 * NOTE Legends are currently not supported.
 * Since the layer may be restyled frontend-side
 * without the backend knowing about it, no simple
 * legend URL link can be offered.
 * @returns {void}
 */
VectorTileLayer.prototype.createLegendURL = function () {
    this.setLegendURL([]);
};

/**
 * Shows the features by given feature id's or load features hidden if second param is true.
 * @param {String[]} ids The feature id's of the rendered features.
 * @param {Boolean} loadHidden true if all features should be hidden, false otherwise. Default is false.
 * @returns {void}
 */
VectorTileLayer.prototype.showFeaturesByIds = function (ids, loadHidden = false) {
    const source = this.layer.getSource();

    if (!source || !Array.isArray(ids)) {
        return;
    }
    source.setTileLoadFunction((tile, url) => {
        tile.setLoader((extent, resolution, projection) => {
            fetch(url).then((response) => {
                response.arrayBuffer().then((data) => {
                    const format = tile.getFormat(),
                        features = format.readFeatures(data, {
                            extent: extent,
                            featureProjection: projection
                        });

                    tile.setFeatures(loadHidden ? features : features.filter(feature => ids.includes(feature.get("id"))));
                });
            });
        });
    });
    if (!loadHidden && this.layer.getOpacity() === 0) {
        source.once("featuresloadend", () => {
            this.layer.setOpacity(1);
        });
    }
    source.refresh();
};

import {vectorTile} from "@masterportal/masterportalapi";
import Layer from "./layer";
import store from "../../app-store";
import getProxyUrl from "../../utils/getProxyUrl";
import axios from "axios";

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
        console.warn(`VT Layer ${attrs.name}: Map (${mapEPSG}) and layer (${vtEPSG}) projection mismatch. View will be erroneous.`);
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
 * Creates vector tile layer.
 * Also register a listener on the map which is triggert if all feauters
 * in current extent are loaded. This will fire a 'featuresloadend' event.
 * @param {Object} attrs the attributes for the layer
 * @return {void}
 */
VectorTileLayer.prototype.createLayer = function (attrs) {
    const layerParams = {
        gfiAttributes: attrs.gfiAttributes
    };

    this.layer = vectorTile.createLayer(attrs, {layerParams});
    store.dispatch("Maps/registerListener", {type: "loadend", listener: () => {
        if (typeof this.layer.getSource !== "function"
            || typeof this.layer.getSource()?.getFeaturesInExtent !== "function") {
            return;
        }
        this.layer.getSource().dispatchEvent({
            type: "featuresloadend",
            features: this.layer.getSource().getFeaturesInExtent(store.getters["Maps/getCurrentExtent"])
        });
        this.set("sourceUpdated", true);
    }});
};

/**
 * Initially reads style information in this order:
 *     1. If field styleId in config.json, use style from services.json with that id
 *     2. If services.json has a style marked with field "defaultStyle" to true, use that style
 *     3. If neither is available, use the first style in the services.json
 *     4. If none defined, OL default style will be used implicitly
 * @returns {void}
 */
VectorTileLayer.prototype.setConfiguredLayerStyle = function () {
    let stylingPromise;

    if (this.get("styleId") && this.get("styleId") !== "default") {
        this.set("selectedStyleID", this.get("styleId"));
        stylingPromise = this.setStyleById(this.get("styleId"));
    }
    else {

        if (typeof this.get("vtStyles") !== "undefined") {
            const style = this.get("vtStyles").find(({defaultStyle}) => defaultStyle) || this.get("vtStyles")[0];

            if (typeof style !== "undefined") {
                this.set("selectedStyleID", style.id);
                stylingPromise = this.setStyleByDefinition(style);
            }
        }
        if (!stylingPromise) {
            console.warn(`Rendering VT layer ${this.get("name")} without style; falls back to OL default styles.`);
            return;
        }
    }

    if (stylingPromise) {
        stylingPromise
            .then(() => this.layer.setVisible(this.get("isSelected")))
            .catch(err => console.error(err));
    }
};

/**
* Fetches a style defined for this layer in the services file.
* @param {String} styleID id of style as defined in services.json
* @returns {Promise} resolves void after style was set; may reject if no style found or received style invalid
*/
VectorTileLayer.prototype.setStyleById = function (styleID) {
    const styleDefinition = this.get("vtStyles").find(({id}) => id === styleID);

    if (!styleDefinition) {
        return Promise.reject(`No style found with ID ${styleID} for layer ${this.get("name")}.`);
    }
    return this.setStyleByDefinition(styleDefinition);
};

/**
 * Loads a style from a style definition's URL and sets it to be active.
 * @param {object} styleDefinition style definition as found in service.json file
 * @param {string} styleDefinition.url url where style is kept
 * @param {string} styleDefinition.id id of style
 * @param {Number[]} [styleDefinition.resolutions] resolutions to style zoom levels mapping
 * @returns {Promise} resolves void after style was set; may reject if received style is invalid
 */
VectorTileLayer.prototype.setStyleByDefinition = function ({id, url, resolutions}) {
    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    return axios.get(this.get("useProxy") ? getProxyUrl(url) : url)
        .then(response => response.data)
        .then(style => {
            let spriteUrl, spriteDataUrl, spriteImageUrl, addMpFonts;

            // check if style is defined and required fields exist
            if (!this.isStyleValid(style)) {
                throw new Error(
                    `Style set for VT layer is incomplete. Must feature layers, sources, and version. Received: "${JSON.stringify(style)}"`
                );
            }

            if (this.get("useMpFonts")) {
                addMpFonts = this.addMpFonts;
            }

            if (style.sprite) {
                spriteUrl = style.sprite;

                // support relative spriteUrls
                if (spriteUrl.includes("./")) {
                    spriteUrl = new URL(spriteUrl, url);
                }

                spriteDataUrl = spriteUrl.toString().concat(".json");
                spriteImageUrl = spriteUrl.toString().concat(".png");

                this.fetchSpriteData(spriteDataUrl)
                    .then(spriteData => {
                        vectorTile.setStyle(this.get("layer"), style, {options: {resolutions: resolutions, spriteData: spriteData, spriteImageUrl: spriteImageUrl, getFonts: addMpFonts}}, url);
                        this.set("selectedStyleID", id);
                    }
                    );
            }
            else {
                vectorTile.setStyle(this.get("layer"), style, {resolutions: resolutions, getFonts: addMpFonts}, url);
                this.set("selectedStyleID", id);
            }
        });
};

/**
 * Changes fontstack of VT-Style to MP-font if configured.
 * @param {String[]} fontstack text-font as found in VT-Style
 * @returns {String[]} returns relevant MP-font
 */
VectorTileLayer.prototype.addMpFonts = function (fontstack) {
    if (fontstack.includes("Bold") | fontstack.includes("bold")) {
        return "MasterPortalFont Bold";
    }
    else if (fontstack.includes("Italic") | fontstack.includes("italic")) {
        return "MasterPortalFont Italic";
    }
    return "MasterPortalFont";
};

/**
 * Checks required fields of a style for presence.
 * @param {object} style style object as fetched from a remote url
 * @returns {boolean} true if all expected fields at least exist
 */
VectorTileLayer.prototype.isStyleValid = function (style) {
    return Boolean(style) &&
        Boolean(style.layers) &&
        Boolean(style.sources) &&
        Boolean(style.version);
};

/**
 * Fetches SpriteData Object
 * @param {String} spriteUrl url to spriteData as found in StyleDefinition
 * @returns {Object} spriteData
 */
VectorTileLayer.prototype.fetchSpriteData = function (spriteUrl) {
    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    return axios.get(this.get("useProxy") ? getProxyUrl(spriteUrl) : spriteUrl)
        .then(resp => resp.data);
};

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

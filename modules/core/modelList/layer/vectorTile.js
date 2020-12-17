import MVT from "ol/format/MVT";
import OpenLayersVectorTileLayer from "ol/layer/VectorTile";
import OpenLayersVectorTileSource from "ol/source/VectorTile";
import TileGrid from "ol/tilegrid/TileGrid";
import {extentFromProjection} from "ol/tilegrid";
import stylefunction from "ol-mapbox-style/dist/stylefunction";
import store from "../../../../src/app-store/index";
import getProxyUrl from "../../../../src/utils/getProxyUrl";

import Layer from "./model";

const VectorTileLayer = Layer.extend(/** @lends VTLayer.prototype */{
    defaults: {
        ...Layer.prototype.defaults,
        selectedStyleID: undefined,
        useProxy: false
    },

    /**
     * @class VectorTileLayer
     * @extends Layer
     * @memberof Core.ModelList.Layer
     * @constructs
     * @property {string} selectedStyleID Currently active style by ID
     * @property {Boolean} useProxy=false Attribute to request the URL via a reverse proxy.
     * @fires Layer#RadioTriggerVectorLayerResetFeatures
     * @listens Layer#RadioRequestVectorLayerGetFeatures
     */
    initialize: function () {
        const mapEPSG = store.getters["Map/projection"].getCode(),
            vtEPSG = this.get("epsg");

        if (mapEPSG !== vtEPSG) {
            console.warn(`VT Layer ${this.get("name")}: Map (${mapEPSG}) and layer (${vtEPSG}) projection mismatch. View will be erroneous.`);
            this.set("isNeverVisibleInTree", true);
        }

        Layer.prototype.initialize.apply(this);
    },

    /**
     * Creates vector tile layer source.
     * @return {void}
     */
    createLayerSource: function () {
        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        const url = this.get("useProxy") ? getProxyUrl(this.get("url")) : this.get("url"),
            mapEpsg = store.getters["Map/projection"].getCode(),
            dataEpsg = this.get("epsg") || mapEpsg,
            params = {
                projection: dataEpsg,
                format: new MVT(),
                url: url
            };

        if (dataEpsg !== "EPSG:3857" || this.get("extent") || this.get("origin") || this.get("origins") || this.get("resolutions") || this.get("tileSize")) {
            const extent = this.get("extent") || extentFromProjection(dataEpsg),
                origin = this.get("origin") || [extent[0], extent[3]], // upper left corner = [minX, maxY]
                resolutions = this.get("resolutions") || store.getters["Map/map"].getView().getResolutions(),
                tileSize = this.get("tileSize") || 512,
                origins = this.get("origins");

            if (origins) {
                params.tileGrid = new TileGrid({
                    extent: extent,
                    origins: origins,
                    resolutions: resolutions,
                    tileSize: tileSize
                });
            }
            else {
                params.tileGrid = new TileGrid({
                    extent: extent,
                    origin: origin,
                    resolutions: resolutions,
                    tileSize: tileSize
                });
            }
        }

        this.setLayerSource(new OpenLayersVectorTileSource(params));
    },

    /**
     * Creates vector tile layer.
     * @return {void}
     */
    createLayer: function () {
        this.setLayer(new OpenLayersVectorTileLayer({
            source: this.get("layerSource"),
            id: this.get("id"),
            typ: this.get("typ"),
            name: this.get("name"),
            visible: this.get("visibility")
        }));
        this.setConfiguredLayerStyle();
    },

    /**
     * Initially reads style information in this order:
     *     1. If field styleId in config.json, use style from services.json with that id
     *     2. If services.json has a style marked with field "defaultStyle" to true, use that style
     *     3. If neither is available, use the first style in the services.json
     *     4. If none defined, OL default style will be used implicitly
     * @returns {void}
     */
    setConfiguredLayerStyle: function () {
        let stylingPromise;

        if (this.get("styleId") && this.get("styleId") !== "default") {
            this.set("selectedStyleID", this.get("styleId"));
            stylingPromise = this.setStyleById(this.get("styleId"));
        }
        else {
            const style = this.get("vtStyles").find(({defaultStyle}) => defaultStyle) ||
                this.get("vtStyles")[0];

            if (typeof style !== "undefined") {
                this.set("selectedStyleID", style.id);
                stylingPromise = this.setStyleByDefinition(style);
            }
            else {
                console.warn(`Rendering VT layer ${this.get("name")} without style; falls back to OL default styles.`);
            }
        }

        if (stylingPromise) {
            stylingPromise
                .then(() => this.setVisible(this.get("isSelected")))
                .catch(err => console.error(err));
        }
    },

    /**
     * Fetches a style defined for this layer in the services file.
     * @param {String} styleID id of style as defined in services.json
     * @returns {Promise} resolves void after style was set; may reject if no style found or received style invalid
     */
    setStyleById: function (styleID) {
        const styleDefinition = this
            .get("vtStyles")
            .find(({id}) => id === styleID);

        if (!styleDefinition) {
            return Promise.reject(`No style found with ID ${styleID} for layer ${this.get("name")}.`);
        }

        return this.setStyleByDefinition(styleDefinition);
    },

    /**
     * Loads a style from a style definition's URL and sets it to be active.
     * @param {object} styleDefinition style definition as found in service.json file
     * @param {string} styleDefinition.url url where style is kept
     * @param {string} styleDefinition.id id of style
     * @returns {Promise} resolves void after style was set; may reject if received style is invalid
     */
    setStyleByDefinition: function ({id, url}) {
        return fetch(url)
            .then(response => response.json())
            .then(style => {
                // check if style is defined and required fields exist
                if (!this.isStyleValid(style)) {
                    throw new Error(
                        `Style set for VT layer is incomplete. Must feature layers, sources, and version. Received: "${JSON.stringify(style)}"`
                    );
                }

                stylefunction(this.get("layer"), style, Object.keys(style.sources)[0]);
                this.set("selectedStyleID", id);
            });
    },

    /**
     * Checks required fields of a style for presence.
     * @param {object} style style object as fetched from a remote url
     * @returns {boolean} true if all expected fields at least exist
     */
    isStyleValid: function (style) {
        return Boolean(style) &&
            Boolean(style.layers) &&
            Boolean(style.sources) &&
            Boolean(style.version);
    },

    /**
     * NOTE Legends are currently not supported.
     * Since the layer may be restyled frontend-side
     * without the backend knowing about it, no simple
     * legend URL link can be offered.
     * @returns {void}
     */
    createLegendURL: function () {
        this.setLegendURL([]);
    }
});

export default VectorTileLayer;

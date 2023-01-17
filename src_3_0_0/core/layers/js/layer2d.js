import Cluster from "ol/source/Cluster";
import axios from "axios";

import store from "../../../app-store";
import Layer from "./layer";

/**
 * Creates a 2d layer.
 * @abstract
 * @constructs
 * @extends Layer
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2d (attributes) {
    const defaultAttributes = {
        crs: mapCollection.getMapView("2D").getProjection().getCode(),
        transparency: 0
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);

    this.setLayerSource(this.getLayer()?.getSource());
    this.controlAutoRefresh(attributes);
    this.addErrorListener();
}

Layer2d.prototype = Object.create(Layer.prototype);

/**
 * Controls the automatic refresh of the layer source.
 * @param {Object} attributes The attributes of the layer configuration
 * @returns {void}
 */
Layer2d.prototype.controlAutoRefresh = function (attributes) {
    const autoRefresh = attributes?.autoRefresh;

    if (typeof autoRefresh === "number" || typeof autoRefresh === "string") {
        if (attributes.visibility && typeof this.getIntervalAutoRefresh() === "undefined") {
            this.startAutoRefresh(parseInt(autoRefresh, 10));
        }
        else if (!attributes.visibility) {
            this.stopAutoRefresh();
        }
    }
};

/**
 * Creates and starts an interval to refresh the layer.
 * @param {Number} autoRefresh The interval in milliseconds.
 * @returns {void}
 */
Layer2d.prototype.startAutoRefresh = function (autoRefresh) {
    this.setIntervalAutoRefresh(setInterval(() => {
        const layerSource = this.getLayerSource() instanceof Cluster ? this.getLayerSource()?.getSource() : this.getLayerSource();

        layerSource?.refresh();
    }, autoRefresh));
};

/**
 * Clears running auto refresh interval.
 * @returns {void}
 */
Layer2d.prototype.stopAutoRefresh = function () {
    clearInterval(this.getIntervalAutoRefresh());
    this.setIntervalAutoRefresh(undefined);
};

/**
 * Sets values to the ol layer.
 * @param {Object} attributes The new attributes.
 * @returns {void}
 */
Layer2d.prototype.updateLayerValues = function (attributes) {
    this.getLayer()?.setOpacity((100 - attributes.transparency) / 100);
    this.getLayer()?.setVisible(attributes.visibility);
    this.getLayer()?.setZIndex(attributes.zIndex);
    this.controlAutoRefresh(attributes);
};

/**
 * Getter for interval auto refresh.
 * @returns {Number} The interval auto refresh.
 */
Layer2d.prototype.getIntervalAutoRefresh = function () {
    return this.intervalAutoRefresh;
};

/**
 * Getter for ol layer source.
 * @returns {ol/source/Source~Source} The ol layer source.
 */
Layer2d.prototype.getLayerSource = function () {
    return this.layerSource;
};

/**
 * Setter for interval auto refresh.
 * @param {Number} value The interval auto refresh.
 * @returns {void}
 */
Layer2d.prototype.setIntervalAutoRefresh = function (value) {
    this.intervalAutoRefresh = value;
};

/**
 * Setter for ol layer source.
 * @param {ol/source/Source~Source} value The ol layer source.
 * @returns {void}
 */
Layer2d.prototype.setLayerSource = function (value) {
    this.layerSource = value;
};

/**
 * Adds listener on 'featuresloaderror', 'tileloaderror' and 'imageloaderror' at layer source.
 * @returns {void}
 */
Layer2d.prototype.addErrorListener = function () {
    this.getLayerSource()?.on("featuresloaderror", async function () {
        const url = this.attributes.url
        + "&service="
        + this.attributes.typ
        + "&version="
        + this.attributes.version
        + "&request=describeFeatureType";

        await this.errorHandling(await axios.get(url, {withCredentials: true})
            .catch(function (error) {
                return error.toJSON().status;
            }), this.get("name"));
    }.bind(this));
    this.getLayerSource()?.on("tileloaderror", async function (evt) {
        await this.errorHandling(await axios.get(evt.tile.src_, {withCredentials: true})
            .catch(function (error) {
                return error.toJSON().status;
            }), this.get("name"));
    }.bind(this));
    this.getLayerSource()?.on("imageloaderror", async function (evt) {
        await this.errorHandling(await axios.get(evt.image.src_, {withCredentials: true})
            .catch(function (error) {
                return error.toJSON().status;
            }), this.get("name"));
    }.bind(this));
};

/**
 * Error handling for secure services when error 403 is thrown .
 * @param {Number} errorCode Error Number of the request
 * @param {String} layerName Name of the layer
 * @returns {void}
 */
Layer2d.prototype.errorHandling = function (errorCode, layerName) {
    let linkMetadata = "",
        alertingContent = "";

    if (this.get("datasets") && this.get("datasets")[0]) {
        linkMetadata = i18next.t("common:modules:core:modelList:layer.errorHandling:LinkMetadata",
            {linkMetadata: this.get("datasets")[0].show_doc_url + this.get("datasets")[0].md_id
            });
    }
    if (errorCode === 403) {
        alertingContent = i18next.t("common:modules.core.modelList.layer.errorHandling.403",
            {
                layerName: layerName
            })
            + linkMetadata;

        store.dispatch("Alerting/addSingleAlert", {content: alertingContent, multipleAlert: true});
    }
    store.watch((state, getters) => getters["Alerting/showTheModal"], showTheModal => {
        this.setIsSelected(showTheModal);
    });
};

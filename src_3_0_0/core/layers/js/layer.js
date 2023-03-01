import store from "../../../app-store";

/**
 * Creates a layer.
 * @abstract
 * @constructs
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer (attributes) {
    const defaultAttributes = {

    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    this.createLayer(this.attributes);
    this.createLegend();
}

/**
 * To be overwritten, does nothing.
 * @abstract
 * @returns {void}
 */
Layer.prototype.createLayer = function () {
    // do in children
    console.warn("Function Layer: 'createLayer' must be overwritten in extended layers!");
};

/**
 * To be overwritten, does nothing.
 * @abstract
 * @returns {void}
 */
Layer.prototype.updateLayerValues = function () {
    // do in children
    console.warn("Function Layer: 'updateLayerValues' must be overwritten in extended layers!");
};

/**
 * To be overwritten, does nothing.
 * @abstract
 * @returns {void}
 */
Layer.prototype.visibilityChanged = function () {
    // do in children
};

/**
 * Getter for attribute values.
 * @param {String} key The attribute key.
 * @returns {*} The attribute value
 */
Layer.prototype.get = function (key) {
    return this.attributes[key];
};

/**
 * Getter for layer.
 * @returns {ol/layer/Layer~Layer|Object} The ol layer
 */
Layer.prototype.getLayer = function () {
    return this.layer;
};

/**
 * Setter for attribute values.
 * @param {String} key The attribute key.
 * @param {*} value The attribute value
 * @returns {void}
 */
Layer.prototype.set = function (key, value) {
    this.attributes[key] = value;
};

/**
 * Setter for layer.
 * @param {ol/layer/Layer~Layer|Object} value The ol layer
 * @returns {void}
 */
Layer.prototype.setLayer = function (value) {
    this.layer = value;
};

/**
 * Setter for legend, commits the legend to vue store using "Legend/setLegendOnChanged"
 * @param {String} value legend
 * @returns {void}
 */
 Layer.prototype.setLegend = function (value) {
    this.set("legend", value);
    console.log("setLegend", value, this.get("id"));
    store.dispatch("Modules/Legend/setLegendOnChanged", value);
};

Layer.prototype.getLegend = function () {
    const legend = this.get("legend");

    return legend === undefined || legend === null ? true : legend;
};
/**
* If the parameter "legendURL" is empty, it is set to GetLegendGraphic.
* @return {void}
*/
Layer.prototype.createLegend = function () {
    const version = this.get("version");
    let legend = this.getLegend();
    // console.log("legend",legend);
    // console.log("legendURL",this.get("legendURL"));
    // console.log("this.get(url)",this.get("url"));

    if (this.get("legendURL") !== undefined) {
        if (this.get("legendURL") === "") {
            legend = true;
        }
        else if (this.get("legendURL") === "ignore") {
            legend = false;
        }
        else {
            legend = this.get("legendURL");
        }
    }
    if (!this.get("layers")) {
        console.log("field layers not filled", this);
    }

    if (Array.isArray(legend)) {
        this.setLegend(legend);
    }
    else if (legend === true && this.get("url") && this.get("layers")) {
        const layerNames = this.get("layers").split(","),
            legends = [];

        console.log("this.get(layers)", this.get("layers"));

        // Compose GetLegendGraphic request(s)
        layerNames.forEach(layerName => {
            const legendUrl = new URL(this.get("url"));

            legendUrl.searchParams.set("SERVICE", "WMS");
            legendUrl.searchParams.set("VERSION", version);
            legendUrl.searchParams.set("REQUEST", "GetLegendGraphic");
            legendUrl.searchParams.set("FORMAT", "image/png");
            legendUrl.searchParams.set("LAYER", layerName);

            legends.push(legendUrl.toString());
        });

        this.setLegend(legends);
    }
    else if (typeof legend === "string") {
        this.setLegend([legend]);
    }
};


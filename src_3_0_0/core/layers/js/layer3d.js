import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import Layer from "./layer";

/**
 * Creates a 3d layer.
 * @abstract
 * @constructs
 * @extends Layer
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer3d (attributes) {
    const defaultAttributes = {
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);
}

Layer3d.prototype = Object.create(Layer.prototype);

/**
 * Calls masterportalAPI's layer to set this layer visible.
 * @param {Boolean} visibility visibility of the layer
 * @param {Cesium} map The 3d map.
 * @param {Object} [attributes={}] The attributes of the layer configuration.
 * @returns {void}
 */
Layer3d.prototype.setVisible = function (visibility, map, attributes = {}) {
    this.getLayer()?.setVisible(visibility, attributes, map);
};

/**
 * Sets values to the cesium layer.
 * @param {Object} attributes The new attributes.
 * @returns {void}
 */
Layer3d.prototype.updateLayerValues = function (attributes) {
    if (this.get("visibility") !== attributes.visibility) {
        this.setVisible(attributes.visibility, mapCollection.getMap("3D"), attributes);
    }
};

/**
 * Creates the legend.
 * @returns {void}
 */
 Layer3d.prototype.createLegend = function () {
    const styleObject = styleList.returnStyleObject(this.get("styleId"));
    let legend = this.getLegend();

    if (this.get("legendURL")) {
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
    if (Array.isArray(legend)) {
        this.setLegend(legend);
    }
    else if (styleObject && legend === true) {
        createStyle.returnLegendByStyleId(styleObject.styleId).then(legendInfos => {
            const type = this.layer.getSource().getFeatures()[0].getGeometry().getType(),
                typeSpecificLegends = [];

            if (type === "MultiLineString") {
                typeSpecificLegends.push(legendInfos.legendInformation.find(element => element.geometryType === "LineString"));
                this.setLegend(typeSpecificLegends);
            }
            else {
                typeSpecificLegends.push(legendInfos.legendInformation.find(element => element.geometryType === type));
                this.setLegend(typeSpecificLegends);
            }
            this.setLegend(legendInfos.legendInformation);
        });
    }
    else if (typeof legend === "string") {
        this.setLegend([legend]);
    }
};
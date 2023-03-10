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
 * Prepares the given features and sets or/and overwrites the coordinates based on the configuration of "altitude" and "altitudeOffset".
 * @param {ol/Feature[]} features The olFeatures.
 * @returns {void}
 */
Layer.prototype.prepareFeaturesFor3D = function (features) {
    features.forEach(feature => {
        let geometry = feature.getGeometry();

        geometry = this.setAltitudeOnGeometry(geometry);
        feature.setGeometry(geometry);
    });
};
/**
 * Sets the altitude and AltitudeOffset as z coordinate.
 * @param {ol/geom} geometry Geometry of feature.
 * @returns {ol/geom} - The geometry with newly set coordinates.
 */
Layer.prototype.setAltitudeOnGeometry = function (geometry) {
    const type = geometry.getType(),
        coords = geometry.getCoordinates();

    if (type === "Point") {
        geometry.setCoordinates(this.getPointCoordinatesWithAltitude(coords));
    }
    else if (type === "MultiPoint") {
        geometry.setCoordinates(this.getMultiPointCoordinatesWithAltitude(coords));
    }
    else {
        console.error("Type: " + type + " is not supported yet for function \"setAltitudeOnGeometry\"!");
    }
    return geometry;
};
/**
 * Sets the altitude on multipoint coordinates.
 * @param {Number[]} coords Coordinates.
 * @returns {Number[]} - newly set cooordinates.
 */
Layer.prototype.getMultiPointCoordinatesWithAltitude = function (coords) {
    return coords.map(coord => this.getPointCoordinatesWithAltitude(coord));
};
/**
 * Sets the altitude on point coordinates.
 * @param {Number[]} coord Coordinates.
 * @returns {Number[]} - newly set cooordinates.
 */
Layer.prototype.getPointCoordinatesWithAltitude = function (coord) {
    const altitude = this.get("altitude"),
        altitudeOffset = this.get("altitudeOffset");

    if (typeof altitude === "number") {
        if (coord.length === 2) {
            coord.push(parseFloat(altitude));
        }
        else if (coord.length === 3) {
            coord[2] = parseFloat(altitude);
        }
    }
    if (typeof altitudeOffset === "number") {
        if (coord.length === 2) {
            coord.push(parseFloat(altitudeOffset));
        }
        else if (coord.length === 3) {
            coord[2] = coord[2] + parseFloat(altitudeOffset);
        }
    }
    return coord;
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

import stateMeasure from "./stateMeasure";
import {calculateLinesLength, calculatePolygonsArea} from "../util/measureCalculation";

import {MapMode} from "../../../map/store/enums";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
    ...generateSimpleGetters(stateMeasure),
    /**
     * @param {object} _ measure store state
     * @param {object} __ measure store getters
     * @param {object} ___ root state
     * @param {object} rootGetters root getters
     * @return {boolean} whether the portal is currently in 3D mode
     */
    is3d (_, __, ___, rootGetters) {
        return rootGetters["Map/mapMode"] === MapMode.MODE_3D;
    },
    /**
     * @param {object} state measure store state
     * @param {object} getters measure store getters
     * @returns {String[]} options for geometry selection
     */
    geometryValues ({geometryValues3d, geometryValues}, {is3d}) {
        return is3d
            ? geometryValues3d
            : geometryValues;
    },
    /**
     * @param {object} state measure store state
     * @param {object} getters measure store getters
     * @returns {String} selected geometry selection option
     */
    selectedGeometry ({geometryValues3d, selectedGeometry}, {is3d}) {
        return is3d
            ? geometryValues3d[0] // 3D mode only has one option
            : selectedGeometry;
    },
    /**
     * @param {object} state measure store state
     * @param {object} getters measure store getters
     * @returns {String[]} options for measurement units
     */
    currentUnits ({selectedGeometry, lineStringUnits, polygonUnits}, {is3d}) {
        return is3d || selectedGeometry === "LineString"
            ? lineStringUnits
            : polygonUnits;
    },
    /**
     * Calculates the length of lines.
     * @param {object} state measure store state
     * @param {object} _ measure store getters
     * @param {object} __ root state
     * @param {object} rootGetters root getters
     * @return {MeasureCalculation[]} calculated value for display
     */
    linesLength ({lines, earthRadius, lineStringUnits, selectedUnit}, _, __, rootGetters) {
        return calculateLinesLength(
            rootGetters["Map/scale"] / 1000,
            rootGetters["Map/projection"].getCode(),
            lineStringUnits[selectedUnit],
            lines,
            earthRadius,
            rootGetters.isTableStyle,
            selectedUnit
        );
    },
    /**
     * Calculates the area of a polygon.
     * @param {object} state measure store state
     * @param {object} _ measure store getters
     * @param {object} __ root state
     * @param {object} rootGetters root getters
     * @return {MeasureCalculation[]} calculated values for display, or false if none is available
     */
    polygonsArea ({polygons, earthRadius, polygonUnits, selectedUnit}, _, __, rootGetters) {
        return calculatePolygonsArea(
            rootGetters["Map/scale"] / 1000,
            rootGetters["Map/projection"].getCode(),
            polygonUnits[selectedUnit],
            polygons,
            earthRadius,
            rootGetters.isTableStyle,
            selectedUnit
        );
    }
};

export default getters;

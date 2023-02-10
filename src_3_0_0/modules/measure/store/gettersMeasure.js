import stateMeasure from "./stateMeasure";
import {calculateLineLengths, calculatePolygonAreas} from "../js/measureCalculation";

import {generateSimpleGetters} from "../../../shared/js/utils/generators";

const getters = {
    ...generateSimpleGetters(stateMeasure),

    /**
     * @param {object} state measure store state
     * @param {object} _ measure store getters
     * @param {object} __ root state
     * @param {object} rootGetters root getters
     * @returns {String[]} options for measurement units
     */
    currentUnits ({selectedGeometry, lineStringUnits, polygonUnits}) {
        return selectedGeometry === "LineString"
            ? lineStringUnits
            : polygonUnits;
    },
    /**
     * Calculates the length of lines.
     * @param {object} state measure store state
     * @param {object} _ measure store getters
     * @param {object} __ root state
     * @param {object} rootGetters root getters
     * @return {String[]} calculated display values
     */
    lineLengths ({lines, earthRadius, measurementAccuracy, selectedUnit, lineStringUnits}, _, __, rootGetters) {
        return calculateLineLengths(
            rootGetters["Maps/projection"].getCode(),
            lines,
            earthRadius,
            measurementAccuracy,
            selectedUnit,
            lineStringUnits
        );
    },
    /**
     * Calculates the area of a polygon.
     * @param {object} state measure store state
     * @param {object} _ measure store getters
     * @param {object} __ root state
     * @param {object} rootGetters root getters
     * @return {String[]} calculated display values
     */
    polygonAreas ({polygons, earthRadius, measurementAccuracy, selectedUnit, polygonUnits}, _, __, rootGetters) {
        return calculatePolygonAreas(
            rootGetters["Maps/projection"].getCode(),
            polygons,
            earthRadius,
            measurementAccuracy,
            selectedUnit,
            polygonUnits
        );
    },

    urlParams: state => {
        const params = {
            selectedGeometry: state.selectedGeometry,
            selectedUnit: state.selectedUnit
        };

        return JSON.stringify(params);
    }
};

export default getters;

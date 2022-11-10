import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateMaps from "./stateMaps";

const getters = {
    ...generateSimpleGetters(stateMaps),

    /**
     * Returns the corresponding resolution for the scale.
     * @param {Object} state the state
     * @param {String|Number} scale the scale
     * @param {String} scaleType min or max
     * @return {Number} resolution
     */
    getResolutionByScale: (state) => (scale, scaleType) => {
        const scales = state.scales;

        let index = "",
            unionScales = scales.concat([parseInt(scale, 10)].filter(item => scales.indexOf(item) < 0));

        unionScales = unionScales.sort((a, b) => b - a);

        index = unionScales.indexOf(parseInt(scale, 10));
        if (unionScales.length === scales.length || scaleType === "max") {
            return state.resolutions[index];
        }
        else if (scaleType === "min") {
            return state.resolutions[index - 1];
        }
        return null;
    },

    /**
     * Indicates if the maximum zoom level is displayed.
     * @param {Object} state the state
     * @returns {Boolean} whether current zoom level is the maximum zoom level
     */
    isMaxZoomDisplayed: (state) => {
        return state.zoom >= state.maxZoom;
    },

    /**
     * Indicates if the minimum zoom level is displayed.
     * @param {Object} state the state
     * @returns {Boolean} whether current zoom level is the minimal zoom level
     */
    isMinZoomDisplayed: (state) => {
        return state.zoom <= state.minZoom;
    }
};

export default getters;

import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateMaps from "./stateMaps";

const getters = {
    ...generateSimpleGetters(stateMaps),

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

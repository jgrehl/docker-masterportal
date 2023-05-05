import {generateSimpleGetters} from "../../../js/utils/generators";
import layerPreviewState from "./stateLayerPreview";

const getters = {
    /**
     * Creates from every state-key a getter.
     */
    ...generateSimpleGetters(layerPreviewState),

    /**
     * Returns the current component for a menu side.
     * @param {MenuNavigationState} state Local vuex state.
     * @param {string} side Menu Side.
     * @returns {Object} The current component.
     */
    previewCenter: state => {
        return state.center;
    },

    /**
     * Returns the current component for a menu side.
     * @param {MenuNavigationState} state Local vuex state.
     * @param {string} side Menu Side.
     * @returns {Object} The current component.
     */
    previewZoomLevel: state => {
        return state.zoomLevel;
    }
};

export default getters;

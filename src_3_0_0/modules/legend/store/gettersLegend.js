import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import legendState from "./stateLegend";

const getters = {
    /**
     * Returns an object of simple getters for a state object, where
     * simple means that they will just return an entry for any key.
     * For example, given a state object {key: value}, an object
     * {key: state => state[key]} will be returned.
     * This is useful to avoid writing basic operations.
     * @param {object} state state to generate getters for
     * @returns {object.<string, function>} object of getters
     */
    ...generateSimpleGetters(legendState),

     /**
    * Checks if given layerid is in the legend.
    * @param {String} layerId Id of layer.
    * @returns {Boolean} - Flag if layer is in the legend
    */
      isLayerInLegend : state => (layerId)  => {
        return state.legends.filter((legendObj) => {
            return legendObj.id === layerId;
        }).length > 0;
    },

    /**
     * Checks if the legend object of the layer has changed
     * @param {String} layerId Id of layer
     * @param {Object} legendObj The legend object to be checked.
     * @returns {Boolean} - Flag if the legendObject has changed
     */
    isLegendChanged: state => (legendObj) => {
        let isLegendChanged = false;
        const layerLegend = state.legends.filter((legend) => {
            return legend.id === legendObj.id;
        })[0];

        if (encodeURIComponent(JSON.stringify(layerLegend)) !== encodeURIComponent(JSON.stringify(legendObj))) {
            isLegendChanged = true;
        }
        return isLegendChanged;
    },

};

export default getters;

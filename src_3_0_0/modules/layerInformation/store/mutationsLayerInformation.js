import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateLayerInformation from "./stateLayerInformation";

const mutations = {
    ...generateSimpleMutations(stateLayerInformation),

    /**
     * Sets the layerinfo of the active layer.
     * @param {Object} state Context object.
     * @param {Object} layerConf The layer configuration.
     * @returns {void}
     */
    setLayerInfo (state, layerConf) {
        state.layerInfo = {
            cswUrl: layerConf.datasets[0].csw_url,
            id: layerConf.id,
            layername: layerConf.name,
            legendURL: layerConf.legendURL,
            metaID: layerConf.datasets[0].md_id,
            customMetadata: layerConf.datasets[0].customMetadata,
            attributes: layerConf.datasets[0].customMetadata,
            showDocUrl: layerConf.datasets[0].attributes,
            typ: layerConf.typ,
            url: layerConf.url,
            urlIsVisible: layerConf.urlIsVisible
        };
    }
};

export default mutations;

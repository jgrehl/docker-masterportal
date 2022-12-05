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
            customMetadata: null,
            attributes: null,
            showDocUrl: layerConf.datasets[0].show_doc_url,
            typ: layerConf.typ,
            url: layerConf.url,
            urlIsVisible: layerConf.urlIsVisible
        };
    }
};

export default mutations;

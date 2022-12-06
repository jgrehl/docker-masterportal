import layerCollection from "../../../core/layers/js/layerCollection";
import {createLayer, getLayerTypes3d} from "../../../core/layers/js/layerFactory";
import {rawLayerList} from "@masterportal/masterportalapi/src";

/**
 * checks if the given string is a phone number with a leading country dial-in code (e.g. +49 for germany)
 * @param {Object} context - The store's context
 * @param {String} id the layers id
 * @returns {Object}  layerConfig
 */
export default function getLayerConfigById (context, {id}) {
    if (id) {
        const layerInLayerCollection = layerCollection.getLayerById(id);
        let layerConfig = null;

        if (layerInLayerCollection === undefined) {
            layerConfig = context?.rootGetters?.layerConfigById(id);

            if (layerConfig === undefined) {
                const rawLayer = rawLayerList.getLayerWhere({id: id}),
                    rawLayerMapMode = getLayerTypes3d().includes(rawLayer?.typ) ? "3D" : "2D";

                if (rawLayer) {
                    const layer = createLayer(rawLayer, rawLayerMapMode);

                    return layer.attributes;
                }
            }
            else {
                return layerConfig;
            }
        }

        return layerInLayerCollection;
    }
    return null;
}


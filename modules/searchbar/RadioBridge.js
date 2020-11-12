/**
 * The Radio Channel GFI is no longer available in the "new" Gfi (src/modules/tools/gfi).
 * This file is used for communication between this module and the new Gfi.
 * It can be deleted, if this module has been refactored.
 */
import store from "../../src/app-store";
import {createGfiFeature} from "../../src/modules/map/store/actions/getWmsFeaturesByMimeType";

Radio.channel("VisibleVector").on({
    "gfiOnClick": function (hit) {
        const layerList = store.getters["Map/layerList"],
            foundLayer = layerList.find(function (layer) {
                return layer.get("id") === hit.layer_id;
            }),
            feature = createGfiFeature(
                hit.name,
                foundLayer.get("gfiTheme"),
                hit.gfiAttributes,
                hit.feature.getProperties(),
                null, // for gfiFormat
                hit.id
            );

        store.commit("Map/setClickCoord", [hit.coordinate[0], hit.coordinate[1]]);
        store.commit("Map/setGfiFeatures", [feature]);
    }
});

Radio.channel("GFI").on({
    "setIsVisible": function (isVisible) {
        if (!isVisible) {
            store.commit("Map/setGfiFeatures", null);
        }
    }
});

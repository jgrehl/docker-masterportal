export default {
    /**
     * Gets the Gfi Information
     * @param {Object} param.rootGetters the rootgetters
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    getGfiForPrint: function ({rootGetters, commit}) {
        if (rootGetters["Tools/Gfi/currentFeature"] !== null) {
            commit("setGfiForPrint", [rootGetters["Tools/Gfi/currentFeature"].getMappedProperties(), rootGetters["Tools/Gfi/currentFeature"].getTitle(), rootGetters["Maps/clickCoordinate"]]);
        }
        else {
            // commit("setGfiForPrint", []);
        }
    },

    /**
     * Getting und showing the layer which is visible in print scale
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {String} scale - the current print scale
     * @returns {void}
     */
    setPrintLayers: function ({state, rootGetters}, scale) {
        const visibleLayer = state.visibleLayerList,
            // eslint-disable-next-line new-cap
            resoByMaxScale = rootGetters["Maps/getResolutionByScale"](scale, "max"),
            // eslint-disable-next-line new-cap
            resoByMinScale = rootGetters["Maps/getResolutionByScale"](scale, "min"),
            invisibleLayer = [];

        // let invisibleLayerNames = "",
        //     hintInfo = "";

        visibleLayer.forEach(layer => {
            const layerModel = Radio.request("ModelList", "getModelByAttributes", {"id": layer.id});

            if (resoByMaxScale > layer.getMaxResolution() || resoByMinScale < layer.getMinResolution()) {
                invisibleLayer.push(layer);
                // invisibleLayerNames += "- " + layer.get("name") + "<br>";
                if (layerModel !== undefined) {
                    layerModel.setIsOutOfRange(true);
                }
            }
            else if (layerModel !== undefined) {
                layerModel.setIsOutOfRange(false);
            }
        });

        // hintInfo = i18next.t("common:modules.tools.print.invisibleLayer", {scale: "1: " + thousandsSeparator(scale, " ")});
        // hintInfo = hintInfo + "<br>" + invisibleLayerNames;

        // if (invisibleLayer.length && hintInfo !== state.hintInfo) {
        //     dispatch("Alerting/addSingleAlert", hintInfo, {root: true});
        //     commit("setHintInfo", hintInfo);
        // }

        // if (!invisibleLayer.length) {
        //     commit("setHintInfo", "");
        // }

        // commit("setInvisibleLayer", invisibleLayer);
    }
};

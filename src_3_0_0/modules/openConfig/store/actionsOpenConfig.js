import layerCollection from "../../../core/layers/js/layerCollection";

const actions = {

    /**
     * Processes the config.json on file load.
     * @param {Progressevent} event Event contains the loaded file.
     * @returns {void}
     */
    processConfigJsonOnload ({commit, dispatch}, event) {
        const configJson = JSON.parse(event.target.result);

        layerCollection.clear();
        commit("setPortalConfig", configJson.Portalconfig, {root: true});
        commit("setLayerConfig", configJson.Themenconfig, {root: true});
        dispatch("extendLayers", null, {root: true});
    }
};

export default actions;

import store from "../../../app-store";

const urlParamsFacade = {
    LAYERIDS: {
        getter: () => {
            const layers = store.getters.layerConfigsByAttributes({showInLayerTree: true}),
                layerIds = layers.map(layer => layer.id).join(","),
                visibilities = layers.map(layer => layer.visibility).join(",");

            return `LAYERIDS=${layerIds}&VISIBILITY=${visibilities}`;
        },
        setter: () => {
            const params = store.getters.urlParams,
                layerIds = params.LAYERIDS?.split(","),
                visibilities = params.VISIBILITY?.split(",").map(param => param === "true"),
                allLayerConfigs = store.getters.allLayerConfigs,
                inVisibleLayers = allLayerConfigs.filter(layer => !layerIds.includes(layer.id));

            inVisibleLayers.forEach(layer => {

                store.dispatch("replaceByIdInLayerConfig", {
                    layerConfigs: [{
                        id: layer.id,
                        layer: {
                            showInLayerTree: false,
                            visibility: false
                        }
                    }]
                });
            });

            layerIds.forEach((layerId, index) => {
                store.dispatch("replaceByIdInLayerConfig", {
                    layerConfigs: [{
                        id: layerId,
                        layer: {
                            showInLayerTree: true,
                            visibility: visibilities[index]
                        }
                    }]
                });
            });
        }
    },
    MAPS: {
        getter: () => store.getters["Maps/urlParams"],
        setter: () => store.dispatch("Maps/urlParams", store.getters.urlParams.MAPS)
    },
    MENU_MAIN: {
        getter: () => store.getters["Menu/urlParams"]("mainMenu"),
        setter: () => {
            store.dispatch("Menu/urlParams", {
                menu: store.getters.urlParams.MENU_MAIN,
                module: store.getters.urlParams.MODULE_MAIN || "{}",
                side: "mainMenu"
            });
        }
    },
    MENU_SECONDARY: {
        getter: () => store.getters["Menu/urlParams"]("secondaryMenu"),
        setter: () => {
            store.dispatch("Menu/urlParams", {
                menu: store.getters.urlParams.MENU_SECONDARY,
                module: store.getters.urlParams.MODULE_SECONDARY || "{}",
                side: "secondaryMenu"
            });
        }
    },
    MODULE_MAIN: {},
    MODULE_SECONDARY: {},
    VISIBILITY: {}
};

export default urlParamsFacade;

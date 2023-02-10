import store from "../../../app-store";

const urlParamsFacade = {
    ISINITOPEN_MAIN: {
        getter: "Menu.mainMenu.currentComponent",
        setter: "portalConfig.mainMenu.currentComponent"
    },
    ISINITOPEN_SECONDARY: {
        getter: "Menu.secondaryMenu.currentComponent",
        setter: "portalConfig.secondaryMenu.currentComponent"
    },
    LAYERIDS: {
        setter: (layerIds) => {
            layerIds.split(",").forEach(layerId => {
                store.dispatch("replaceByIdInLayerConfig", {
                    layerConfigs: [{
                        id: layerId,
                        layer: {
                            showInLayerTree: true
                        }
                    }]
                });
            });
        }
    },
    ZOOMLEVEL: {
        getter: "Maps.zoom",
        setter: "portalConfig.mapView.startZoomLevel"
    }
};

export default urlParamsFacade;

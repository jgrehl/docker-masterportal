import {getWmsFeaturesByMimeType} from "../../../shared/js/utils/getWmsFeaturesByMimeType";
import {getVisibleWmsLayersAtResolution} from "../js/getLayers";

let globeEventHandler,
    colored3DTile,
    old3DTileColor;


export default {
    /**
     * Function to highlight a 3D Tile with left click.
     * @param {Object} param.getters the getters
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    highlight3DTile ({getters, dispatch}) {
        const scene = mapCollection.getMap("3D").getCesiumScene();

        globeEventHandler = new Cesium.ScreenSpaceEventHandler(
            scene.canvas
        );
        let highlightColor = Cesium.Color.RED;

        old3DTileColor = null;
        colored3DTile = [];
        if (getters.coloredHighlighting3D?.color !== undefined) {
            const configuredColor = getters.coloredHighlighting3D?.color;

            if (configuredColor instanceof Array) {
                highlightColor = Cesium.Color.fromBytes(configuredColor[0], configuredColor[1], configuredColor[2], configuredColor[3]);
            }
            else if (configuredColor && typeof configuredColor === "string") {
                highlightColor = Cesium.Color[configuredColor];
            }
            else {
                console.warn("The color for the 3D highlighting is not valid. Please check the config or documentation.");
            }
        }
        globeEventHandler.setInputAction(function onLeftClick (
            click
        ) {
            dispatch("removeHighlightColor");
            const pickedFeature = scene.pick(click.position);

            if (pickedFeature) {
                old3DTileColor = pickedFeature?.color;
                colored3DTile.push(pickedFeature);
                pickedFeature.color = highlightColor;
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    /**
     * Function to remove highlighting of a 3D Tile and the event handler.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    removeHighlight3DTile ({dispatch}) {
        dispatch("removeHighlightColor");
        if (globeEventHandler !== undefined && globeEventHandler instanceof Cesium.ScreenSpaceEventHandler) {
            globeEventHandler.destroy();
        }
    },
    /**
     * Function to revert the highlight coloring  of a 3D Tile.
     * @returns {void}
     */
    removeHighlightColor () {
        if (Array.isArray(colored3DTile) && colored3DTile.length > 0) {
            colored3DTile[0].color = old3DTileColor;
            colored3DTile = [];
        }
    },

    /**
     * collects features for the gfi.
     * @param {Object} param store context
     * @param {Object} param.getters the getter
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @returns {void}
     */
    collectGfiFeatures ({getters, commit, dispatch, rootGetters}) {
        const clickCoordinate = rootGetters["Maps/clickCoordinate"],
            resolution = rootGetters["Maps/resolution"],
            projection = rootGetters["Maps/projection"],
            gfiFeaturesAtPixel = getters.gfiFeaturesAtPixel,
            gfiWmsLayerList = getVisibleWmsLayersAtResolution(resolution).filter(layer => {
                return layer.get("gfiAttributes") !== "ignore";
            });

        Promise.all(gfiWmsLayerList.map(layer => {
            const gfiParams = {
                INFO_FORMAT: layer.get("infoFormat"),
                FEATURE_COUNT: layer.get("featureCount")
            };
            let url = layer.getSource().getFeatureInfoUrl(clickCoordinate, resolution, projection, gfiParams);

            // this part is needed if a Url contains a style which seems to mess up the getFeatureInfo call
            if (url.indexOf("STYLES") && url.indexOf("STYLES=&") === -1) {
                const newUrl = url.replace(/STYLES=.*?&/g, "STYLES=&");

                url = newUrl;
            }

            return getWmsFeaturesByMimeType(layer, url);
        }))
            .then(gfiFeatures => {
                const clickPixel = rootGetters["Maps/clickPixel"],
                    mode = rootGetters["Maps/mode"],
                    allGfiFeatures = gfiFeaturesAtPixel(clickPixel, clickCoordinate, mode).concat(...gfiFeatures);

                allGfiFeatures.sort((a, b) => {
                    const zIndexA = rootGetters.layerConfigById(a.getLayerId())?.zIndex || 0,
                        zIndexB = rootGetters.layerConfigById(b.getLayerId())?.zIndex || 0;

                    if (zIndexA < zIndexB) {
                        return -1;
                    }
                    else if (zIndexA > zIndexB) {
                        return 1;
                    }
                    return 0;
                });

                // only commit if features found
                if (allGfiFeatures.length > 0) {
                    commit("setGfiFeatures", allGfiFeatures);
                }
                else {
                    commit("setGfiFeatures", null);
                }
            })
            .catch(error => {
                console.warn(error);
                dispatch("Alerting/addSingleAlert", i18next.t("common:modules.getFeatureInfo.errorMessage"), {root: true});
            });
    }
};

import getPosition from "../utils/getPosition";
import {getRenderPixel} from "ol/render";
import layerCollection from "../../../core/layers/js/layerCollection";
import {treeSubjectsKey} from "../../../shared/js/utils/constants";

const actions = {
    windowWidthChanged ({commit, dispatch, state, getters}) {
        commit("setWindowWidth");

        if (!getters.minWidth && state.layerSwiper.active) {
            dispatch("toggleSwiper", state.timeSlider.currentLayerId + state.layerAppendix);
        }
    },
    /**
     * Toggles the LayerSwiper.
     * If the LayerSwiper is deactivated, the second layer is deactivated and removed from the ModelList.
     *
     * @param {String} id Id of the Layer that should be toggled.
     * @returns {void}
     */
    async toggleSwiper ({commit, state, dispatch}, id) {
        commit("setLayerSwiperActive", !state.layerSwiper.active);

        const secondId = id.endsWith(state.layerAppendix) ? id : id + state.layerAppendix,
            layerId = state.layerSwiper.active ? id : secondId,
            layer = layerCollection.getLayerById(layerId);

        if (state.layerSwiper.active) {
            const {name, time, url, level, layers, version, parentId, gfiAttributes, featureCount} = layer.attributes;

            commit("setLayerSwiperSourceLayer", layer);

            await dispatch("addLayerToLayerConfig", {
                layerConfig: {
                    id: secondId,
                    name: name + "_second",
                    showInLayerTree: true,
                    typ: "WMS",
                    type: "layer",
                    visibility: true,
                    time,
                    url,
                    level,
                    layers,
                    version,
                    parentId,
                    legendURL: "ignore",
                    gfiAttributes: gfiAttributes,
                    featureCount: featureCount
                },
                parentKey: treeSubjectsKey
            }, {root: true});

            commit("setLayerSwiperTargetLayer", layerCollection.getLayerById(secondId));
        }
        else {
            const layerConfigs = [];

            // If the button of the "original" window is clicked, it is assumed, that the time value selected in the added window is desired to be further displayed.
            if (!id.endsWith(state.layerAppendix)) {
                const {TIME} = layer.getLayerSource().params_,
                    {transparency} = layer.attributes,
                    origLayer = layerCollection.getLayerById(id);

                layerConfigs.push({
                    id: id,
                    layer: {
                        id: id,
                        transparency: transparency
                    }
                });
                origLayer.updateTime(id, TIME);
                dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
                commit("setTimeSliderDefaultValue", TIME);
            }

            layerConfigs.push({
                id: secondId,
                layer: {
                    id: secondId,
                    visibility: false,
                    showInLayerTree: false
                }
            });

            dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
        }
    },
    /**
     * Sets the postion of the layerSwiper to state according to the x-coordinate of the mousedown event
     * or adjusts it based on the direction of the key pressed by the state defined value.
     *
     * @param {KeyboardEvent.keydown | MouseEvent.mousemove} event DOM Event.
     * @returns {void}
     */
    moveSwiper ({state, commit, dispatch, getters}, event) {
        const position = getPosition(event, state.layerSwiper.valueX, getters.currentTimeSliderObject.keyboardMovement);

        commit("setLayerSwiperValueX", position);
        commit("setLayerSwiperStyleLeft", position);
        dispatch("updateMap");
    },
    /**
     * Updates the map so that the layer is displayed clipped again.
     *
     * @returns {void}
     */
    async updateMap ({state, rootGetters, dispatch}) {
        if (!state.timeSlider.playing) {
            await mapCollection.getMap(rootGetters["Maps/mode"]).render();
        }

        state.layerSwiper.targetLayer?.getLayer().once("prerender", renderEvent => dispatch("drawLayer", renderEvent));
        state.layerSwiper.targetLayer?.getLayer().once("postrender", ({context}) => {
            context.restore();
        });

        state.layerSwiper.sourceLayer?.getLayer().once("prerender", renderEvent => dispatch("drawLayer", renderEvent));
        state.layerSwiper.sourceLayer?.getLayer().once("postrender", ({context}) => {
            context.restore();
            if (!state.layerSwiper.active) {
                mapCollection.getMap(rootGetters["Maps/mode"]).render();
            }
        });
    },
    /**
     * Manipulates the width of each layer according to the position of the layerSwiper and the side of the layer.
     *
     * @param {ol.render.Event} renderEvent The event object triggered on prerender
     * @returns {void}
     */
    drawLayer ({state, rootGetters}, renderEvent) {
        const {context} = renderEvent,
            mapSize = mapCollection.getMap(rootGetters["Maps/mode"]).getSize(),
            isRightSided = renderEvent.target.get("id").endsWith(state.layerAppendix);

        // Clip everything that is to the other side of the swiper
        context.save();
        context.beginPath();
        context.moveTo(...getRenderPixel(renderEvent, isRightSided ? [state.layerSwiper.valueX, 0] : [0, 0]));
        context.lineTo(...getRenderPixel(renderEvent, isRightSided ? [state.layerSwiper.valueX, mapSize[1]] : [0, mapSize[1]]));
        context.lineTo(...getRenderPixel(renderEvent, isRightSided ? mapSize : [state.layerSwiper.valueX, mapSize[1]]));
        context.lineTo(...getRenderPixel(renderEvent, isRightSided ? [mapSize[0], 0] : [state.layerSwiper.valueX, 0]));
        context.closePath();
        context.clip();
    }
};

export default actions;

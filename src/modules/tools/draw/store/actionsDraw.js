import {Draw} from "ol/interaction.js";
import {getMapProjection, transform} from "masterportalAPI/src/crs";

import {drawInteractionOnDrawEvent} from "./actions/drawInteractionOnDrawEvent";
import * as setter from "./actions/setterDraw";
import * as withoutGUI from "./actions/withoutGUIDraw";
import {createDrawInteraction, createModifyInteraction, createSelectInteraction} from "../utils/createInteractions";

import stateDraw from "./stateDraw";

// NOTE: The Update and the Redo Buttons weren't working with the select and modify interaction in Backbone and are not yet working in Vue too.

const initialState = Object.assign({}, stateDraw),
    actions = {
        /**
         * Adds an interaction to the current map instance.
         *
         * @param {Object} context actions context object.
         * @param {module:ol/interaction/Interaction} interaction interaction with the map.
         * @returns {void}
         */
        addInteraction ({rootState}, interaction) {
            rootState.Map.map.addInteraction(interaction);
        },
        /**
         * Removes all features from the layer.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        clearLayer ({state}) {
            state.layer.getSource().clear();
        },
        /**
         * Returns the center point of a Line or Polygon or a point itself.
         * If a targetprojection is given, the values are transformed.
         *
         * @param {Object} context actions context object.
         * @param {Object} prm Parameter object.
         * @param {module:ol/Feature} prm.feature Line, Polygon or Point.
         * @param {String} prm.targetProjection Target projection if the projection differs from the map's projection.
         * @returns {module:ol/coordinate~Coordinate} Coordinates of the center point of the geometry.
         */
        createCenterPoint ({rootState}, {feature, targetProjection}) {
            let centerPoint,
                centerPointCoords = [];

            const featureType = feature.getGeometry().getType(),
                map = rootState.Map.map;

            if (featureType === "LineString") {
                if (targetProjection !== undefined) {
                    centerPointCoords = transform(getMapProjection(map), targetProjection, feature.getGeometry().getCoordinateAt(0.5));
                }
                else {
                    centerPointCoords = feature.getGeometry().getCoordinateAt(0.5);
                }
            }
            else if (featureType === "Point") {
                if (targetProjection !== undefined) {
                    centerPointCoords = transform(getMapProjection(map), targetProjection, feature.getGeometry().getCoordinates());
                }
                else {
                    centerPointCoords = feature.getGeometry().getCoordinates();
                }
            }
            else if (featureType === "Polygon") {
                if (targetProjection !== undefined) {
                    centerPoint = transform(getMapProjection(map), targetProjection, feature.getGeometry().getInteriorPoint().getCoordinates());
                }
                else {
                    centerPoint = feature.getGeometry().getInteriorPoint().getCoordinates();
                }
                centerPointCoords = centerPoint.slice(0, -1);
            }
            else if (featureType === "Circle") {
                if (targetProjection !== undefined) {
                    centerPointCoords = transform(getMapProjection(map), targetProjection, feature.getGeometry().getCenter());
                }
                else {
                    centerPointCoords = feature.getGeometry().getCenter();
                }
            }
            return centerPointCoords;
        },
        /**
         * Creates a draw interaction to add to the map.
         *
         * @param {Object} context actions context object.
         * @param {Object} payload payload object.
         * @param {Boolean} payload.active Decides whether the draw interations are active or not.
         * @param {Integer} [payload.maxFeatures] Max amount of features to be added to the map.
         * @returns {void}
         */
        createDrawInteractionAndAddToMap ({state, commit, dispatch}, {active, maxFeatures}) {
            const drawInteraction = createDrawInteraction(state);

            commit("setDrawInteraction", drawInteraction);
            dispatch("manipulateInteraction", {interaction: "draw", active: active});
            dispatch("createDrawInteractionListener", {doubleCircle: false, drawInteraction: "", maxFeatures: maxFeatures});
            dispatch("addInteraction", drawInteraction);

            // NOTE: This leads to the creation of a second circle instead of a MultiPolygon right now.
            if (state.drawType.id === "drawDoubleCircle") {
                const drawInteractionTwo = createDrawInteraction(state);

                commit("setDrawInteractionTwo", drawInteractionTwo);
                dispatch("manipulateInteraction", {interaction: "draw", active: active});
                dispatch("createDrawInteractionListener", {doubleCircle: true, drawInteraction: "Two", maxFeatures: maxFeatures});
                dispatch("addInteraction", drawInteractionTwo);
            }
        },
        /**
         * Listener to change the entries for the next drawing.
         *
         * @param {Object} context actions context object.
         * @param {Object} payload payload object.
         * @param {Boolean} payload.doubleCircle Determines if a doubleCircle is supposed to be drawn.
         * @param {String} payload.drawInteraction Either an empty String or "Two" to identify for which drawInteraction this is used.
         * @param {Integer} [payload.maxFeatures] Max amount of features to be added to the map.
         * @returns {void}
         */
        createDrawInteractionListener ({state, dispatch}, {doubleCircle, drawInteraction, maxFeatures}) {
            const interaction = state["drawInteraction" + drawInteraction];
            let centerPoint,
                geoJSONAddCenter;

            interaction.on("drawend", event => {
                dispatch("uniqueID").then(id => {
                    event.feature.set("styleId", id);

                    // NOTE: This is only used for dipas/diplanung (08-2020): inputMap contains the map, drawing is cancelled and editing is started
                    if (typeof Config.inputMap !== "undefined" && Config.inputMap !== null) {
                        dispatch("cancelDrawWithoutGUI", {cursor: "auto"});
                        dispatch("editFeaturesWithoutGUI");

                        dispatch("createCenterPoint", {feature: event.feature, targetProjection: Config.inputMap.targetProjection}).then(centerPointCoords => {
                            centerPoint = {type: "Point", coordinates: centerPointCoords};

                            dispatch("downloadFeaturesWithoutGUI", {prmObject: {"targetProjection": Config.inputMap.targetProjection}, currentFeature: event.feature}).then(geoJSON => {
                                geoJSONAddCenter = JSON.parse(geoJSON);

                                if (geoJSONAddCenter.features[0].properties === null) {
                                    geoJSONAddCenter.features[0].properties = {};
                                }
                                geoJSONAddCenter.features[0].properties.centerPoint = centerPoint;
                                Radio.trigger("RemoteInterface", "postMessage", {"drawEnd": JSON.stringify(geoJSONAddCenter)});
                            });
                        });
                    }
                });
            });
            interaction.on("drawstart", () => {
                dispatch("drawInteractionOnDrawEvent", {drawInteraction, doubleCircle});
            });

            if (maxFeatures && maxFeatures > 0) {
                interaction.on("drawstart", () => {
                    const featureCount = state.layer.getSource().getFeatures().length;

                    if (featureCount > maxFeatures - 1) {
                        dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.draw.limitReached", {count: maxFeatures}), {root: true});
                        dispatch("deactivateDrawInteractions");
                        dispatch("removeInteraction", interaction);
                    }
                });
            }
        },
        /**
         * Creates a modify interaction and adds it to the map.
         *
         * @param {Object} context actions context object.
         * @param {Boolean} active Decides whether the modify interaction is active or not.
         * @returns {void}
         */
        createModifyInteractionAndAddToMap ({state, commit, dispatch}, active) {
            const modifyInteraction = createModifyInteraction(state.layer);

            commit("setModifyInteraction", modifyInteraction);
            dispatch("manipulateInteraction", {interaction: "modify", active: active});
            dispatch("createModifyInteractionListener");
            dispatch("addInteraction", modifyInteraction);
        },
        /**
         * Listener to change the features through the modify interaction.
         * NOTE: For text only the position can be changed. This can be done by clicking at highlighted (on-hover) bottom-left corner of the text.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        createModifyInteractionListener ({state, dispatch}) {
            state.modifyInteraction.on("modifyend", event => {
                let centerPoint,
                    centerPointCoords,
                    geoJSONAddCenter;

                // NOTE: This is only used for dipas/diplanung (08-2020): inputMap contains the map
                if (typeof Config.inputMap !== "undefined" && Config.inputMap !== null) {
                    centerPointCoords = dispatch("createCenterPoint", {feature: event.features.getArray()[0], targetProjection: Config.inputMap.targetProjection});
                    centerPoint = {type: "Point", coordinates: centerPointCoords};
                    dispatch("downloadFeaturesWithoutGUI", {prmObject: {"targetProjection": Config.inputMap.targetProjection}, currentFeature: event.feature}).then(geoJSON => {
                        geoJSONAddCenter = JSON.parse(geoJSON);

                        if (geoJSONAddCenter.features[0].properties === null) {
                            geoJSONAddCenter.features[0].properties = {};
                        }
                        geoJSONAddCenter.features[0].properties.centerPoint = centerPoint;
                        Radio.trigger("RemoteInterface", "postMessage", {"drawEnd": JSON.stringify(geoJSONAddCenter)});
                    });
                }
            });
        },
        /**
         * Creates a select interaction (for deleting features) and adds it to the map.
         * NOTE: Deleting of text can be done by clicking at highlighted (on-hover) bottom-left corner of the text.
         *
         * @param {Object} context actions context object.
         * @param {Boolean} active Decides whether the select interaction is active or not.
         * @returns {void}
         */
        createSelectInteractionAndAddToMap ({state, commit, dispatch}, active) {
            const selectInteraction = createSelectInteraction(state.layer);

            commit("setSelectInteraction", selectInteraction);
            dispatch("manipulateInteraction", {interaction: "delete", active: active});
            dispatch("createSelectInteractionListener");
            dispatch("addInteraction", selectInteraction);
        },
        /**
         * Listener to select (for deletion) the features through the select interaction.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        createSelectInteractionListener ({state}) {
            state.selectInteraction.on("select", event => {
                // remove feature from source
                state.layer.getSource().removeFeature(event.selected[0]);
                // remove feature from interaction
                state.selectInteraction.getFeatures().clear();
            });
        },
        /**
         * Deactivates all draw interactions of the map and add them to the state.
         * NOTE: This is mainly used with the RemoteInterface because otherwise not all interactions are removed.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        deactivateDrawInteractions ({state, rootState}) {
            rootState.Map.map.getInteractions().forEach(int => {
                if (int instanceof Draw) {
                    int.setActive(false);
                    if (state.deactivatedDrawInteractions.indexOf(int) === -1) {
                        state.deactivatedDrawInteractions.push(int);
                    }
                }
            });
        },
        drawInteractionOnDrawEvent,
        /**
         * Activates or deactivates the given Interactions based on the given parameters.
         *
         * @param {Object} context actions context object.
         * @param {String} payload.interaction name of the interaction to be manipulated.
         * @param {Boolean} payload.active Value to set the drawInteractions to.
         * @return {void}
         */
        manipulateInteraction ({state}, {interaction, active}) {
            if (interaction === "draw") {
                if (typeof state.drawInteraction !== "undefined" && state.drawInteraction !== null) {
                    state.drawInteraction.setActive(active);
                }
                if (typeof state.drawInteractionTwo !== "undefined" && state.drawInteractionTwo !== null) {
                    state.drawInteractionTwo.setActive(active);
                }
            }
            else if (interaction === "modify") {
                if (typeof state.modifyInteraction !== "undefined" && state.modifyInteraction !== null) {
                    state.modifyInteraction.setActive(active);
                }
            }
            else if (interaction === "delete") {
                if (typeof state.selectInteraction !== "undefined" && state.selectInteraction !== null) {
                    state.selectInteraction.setActive(active);
                }
            }
        },
        /**
         * Restores the last deleted element of the feature array of the layer.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        redoLastStep ({state, commit, dispatch}) {
            const redoArray = state.redoArray,
                featureToRestore = redoArray[redoArray.length - 1];

            if (typeof featureToRestore !== "undefined" && featureToRestore !== null) {
                const featureId = state.fId;

                featureToRestore.setId(featureId);
                commit("setFId", state.fId + 1);
                state.layer.getSource().addFeature(featureToRestore);
                state.layer.getSource().getFeatureById(featureId).setStyle(featureToRestore.getStyle());
                dispatch("updateRedoArray", {remove: true});
            }
        },
        /**
         * Removes the given interaction from the current map instance.
         *
         * @param {Object} context actions context object.
         * @param {ol/interaction/Interaction} interaction interaction with the map
         * @returns {void}
         */
        removeInteraction ({rootState}, interaction) {
            rootState.Map.map.removeInteraction(interaction);
        },
        /**
         * Resets the Draw Tool.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        resetModule ({state, commit, dispatch, getters}) {
            const color = initialState.color,
                colorContour = initialState.colorContour;

            color[3] = initialState.opacity;
            colorContour[3] = initialState.opacityContour;

            commit("setActive", false);
            dispatch("manipulateInteraction", {interaction: "draw", active: false});
            dispatch("removeInteraction", state.drawInteraction);
            dispatch("removeInteraction", state.drawInteractionTwo);

            dispatch("manipulateInteraction", {interaction: "modify", active: false});
            dispatch("removeInteraction", state.modifyInteraction);

            dispatch("manipulateInteraction", {interaction: "delete", active: false});
            dispatch("removeInteraction", state.selectInteraction);

            commit("setCircleMethod", initialState.circleMethod);
            commit("setCircleInnerDiameter", initialState.circleInnerDiameter);
            commit("setCircleOuterDiameter", initialState.circleOuterDiameter);
            commit("setColor", color);
            commit("setColorContour", colorContour);
            commit("setDrawType", initialState.drawType);
            commit("setFreeHand", initialState.freeHand);
            commit("setOpacity", initialState.opacity);
            commit("setOpacityContour", initialState.opacityContour);
            commit("setPointSize", initialState.pointSize);
            commit("setSymbol", getters.iconList[0]);
            commit("setWithoutGUI", initialState.withoutGUI);

            state.layer.getSource().un("addFeature", state.addFeatureListener.listener);
        },
        ...setter,
        /**
         * Starts the Download Tool for the drawn features.
         * NOTE: Draw Tool is not hidden.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        startDownloadTool ({state}) {
            const features = state.layer.getSource().getFeatures();

            Radio.trigger("Download", "start", {
                features: features,
                formats: ["KML", "GEOJSON", "GPX"]
            });
        },
        /**
         * Enables the given interaction and disables the others.
         *
         * @param {Object} context actions context object.
         * @param {String} interaction The interaction to be enabled.
         * @returns {void}
         */
        toggleInteraction ({commit, dispatch}, interaction) {
            commit("setCurrentInteraction", interaction);
            if (interaction === "draw") {
                dispatch("manipulateInteraction", {interaction: "draw", active: true});
                dispatch("manipulateInteraction", {interaction: "modify", active: false});
                dispatch("manipulateInteraction", {interaction: "delete", active: false});
            }
            else if (interaction === "modify") {
                dispatch("manipulateInteraction", {interaction: "draw", active: false});
                dispatch("manipulateInteraction", {interaction: "modify", active: true});
                dispatch("manipulateInteraction", {interaction: "delete", active: false});
            }
            else if (interaction === "delete") {
                dispatch("manipulateInteraction", {interaction: "draw", active: false});
                dispatch("manipulateInteraction", {interaction: "modify", active: false});
                dispatch("manipulateInteraction", {interaction: "delete", active: true});
            }
        },
        /**
         * Deletes the last element in the feature array of the layer.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        undoLastStep ({state, dispatch}) {
            const features = state.layer.getSource().getFeatures(),
                featureToRemove = features[features.length - 1];

            if (typeof featureToRemove !== "undefined" && featureToRemove !== null) {
                dispatch("updateRedoArray", {remove: false, feature: featureToRemove});
                state.layer.getSource().removeFeature(featureToRemove);
            }
        },
        /**
         * Creates and returns a unique ID.
         * If given, it starts with a prefix.
         *
         * @param {Object} context actions context object.
         * @param {String} [prefix] Prefix for the ID.
         * @returns {String} A unique ID.
         */
        uniqueID ({state, commit}, prefix) {
            const id = state.idCounter + 1;

            commit("setIdCounter", id);
            return prefix ? prefix + id : id.toString(10);
        },
        /**
         * Updates the drawInteractions on the map and creates a new one.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        updateDrawInteraction ({state, commit, dispatch}) {
            dispatch("removeInteraction", state.drawInteraction);
            commit("setDrawInteraction", null);
            if (typeof state.drawInteractionTwo !== "undefined" && state.drawInteractionTwo !== null) {
                dispatch("removeInteraction", state.drawInteractionTwo);
                commit("setDrawInteractionTwo", null);
            }
            dispatch("createDrawInteractionAndAddToMap", {active: true});
        },
        /**
         * Adds or removes one element from the redoArray.
         *
         * @param {Object} context actions context object.
         * @param {Object} payload payload object.
         * @param {Boolean} payload.remove Remove one feature from the array if true.
         * @param {Object} [payload.feature] feature to be added to the array, if given.
         * @return {void}
         */
        updateRedoArray: ({state, commit}, {remove, feature}) => {
            const redoArray = state.redoArray;

            if (remove) {
                redoArray.pop();
            }
            else {
                redoArray.push(feature);
            }
            commit("setRedoArray", redoArray);
        },
        ...withoutGUI
    };

export default actions;

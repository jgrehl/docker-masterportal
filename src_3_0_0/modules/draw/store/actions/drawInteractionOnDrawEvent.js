import {createStyle} from "../../js/style/createStyle";
import {calculateCircle} from "../../js/circleCalculations";
import main from "../../js/main";

const errorBorder = "#E10019";

/**
 * Creates a listener for the addfeature event of the source of the layer used for the Draw Tool.
 * NOTE: Should the zIndex only be counted up if the feature gets actually drawn?
 *
 * @param {Object} context actions context object.
 * @param {String} drawInteraction Either an empty String or "Two" to identify for which drawInteraction this is used.
 * @returns {void}
 */
export function drawInteractionOnDrawEvent ({state, commit, dispatch, rootState}, drawInteraction) {
    const stateKey = state.drawType.id + "Settings",
        styleSettings = JSON.parse(JSON.stringify(state[stateKey])),
        interaction = state["drawInteraction" + drawInteraction],
        circleMethod = styleSettings.circleMethod,
        drawType = state.drawType,
        layerSource = main.getApp().config.globalProperties.$layer.getSource();

    commit("setAddFeatureListener", layerSource.once("addfeature", event => {
        event.feature.set("fromDrawTool", true);
        dispatch("updateUndoArray", {remove: false, feature: event.feature});
        if (circleMethod === "defined" && drawType.geometry === "Circle") {
            const innerRadius = !isNaN(styleSettings.circleRadius) ? parseFloat(styleSettings.circleRadius) : null,
                outerRadius = !isNaN(styleSettings.circleOuterRadius) ? parseFloat(styleSettings.circleOuterRadius) : null,
                circleRadius = event.feature.get("isOuterCircle") ? outerRadius : innerRadius,
                circleCenter = event.feature.getGeometry().getCenter();

            if (innerRadius === null || innerRadius === 0) {
                state.innerBorderColor = errorBorder;

                if (drawType.id === "drawDoubleCircle") {
                    if (outerRadius === null || outerRadius === 0) {
                        const alert = {
                            category: "error",
                            content: i18next.t("common:modules.tools.draw.undefinedTwoCircles"),
                            displayClass: "error",
                            multipleAlert: true
                        };

                        dispatch("Alerting/addSingleAlert", alert, {root: true});
                        layerSource.removeFeature(event.feature);
                        state.outerBorderColor = errorBorder;
                    }
                    else {
                        const alert = {
                            category: "error",
                            content: i18next.t("common:modules.tools.draw.undefinedInnerCircle"),
                            displayClass: "error",
                            multipleAlert: true
                        };

                        dispatch("Alerting/addSingleAlert", alert, {root: true});
                        layerSource.removeFeature(event.feature);
                        state.outerBorderColor = "";
                    }
                }
                else {
                    const alert = {
                        category: "error",
                        content: i18next.t("common:modules.tools.draw.undefinedRadius"),
                        displayClass: "error",
                        multipleAlert: true
                    };

                    dispatch("Alerting/addSingleAlert", alert, {root: true});
                    layerSource.removeFeature(event.feature);
                }
            }
            else {
                if (outerRadius === null || outerRadius === 0) {
                    if (drawType.id === "drawDoubleCircle") {
                        const alert = {
                            category: "error",
                            content: i18next.t("common:modules.tools.draw.undefinedOuterCircle"),
                            displayClass: "error",
                            multipleAlert: true
                        };

                        dispatch("Alerting/addSingleAlert", alert, {root: true});
                        layerSource.removeFeature(event.feature);
                        state.outerBorderColor = errorBorder;
                    }
                    else {
                        calculateCircle(event, circleCenter, circleRadius, mapCollection.getMap(rootState.Maps.mode));
                    }
                }
                else {
                    calculateCircle(event, circleCenter, circleRadius, mapCollection.getMap(rootState.Maps.mode));
                    state.outerBorderColor = "";
                }
                state.innerBorderColor = "";
            }
        }

        if (event.feature.get("isOuterCircle")) {
            styleSettings.colorContour = styleSettings.outerColorContour;
        }

        event.feature.setStyle(function (feature) {
            if (feature.get("isVisible")) {
                return createStyle(feature.get("drawState"), styleSettings);
            }
            return undefined;
        });

        event.feature.set("invisibleStyle", createStyle(event.feature.get("drawState"), styleSettings));

        commit("setZIndex", state.zIndex + 1);
    }));

    if (state.currentInteraction === "draw" && circleMethod === "defined" && drawType.geometry === "Circle") {
        interaction.finishDrawing();
    }
}

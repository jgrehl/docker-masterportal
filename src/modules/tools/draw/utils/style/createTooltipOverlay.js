import Overlay from "ol/Overlay";
import thousandsSeparator from "../../../../../utils/thousandsSeparator";
import * as setters from "../../store/actions/settersDraw";
import {getArea} from "ol/sphere.js";

/**
 * returns the Feature to use as mouse label on change of circle or double circle
 * @param {Object} context context object for actions, getters and setters.
 *
 * @returns {module:ol/Overlay} the Feature to use as mouse label
 */
function createTooltipOverlay ({state, getters, commit, dispatch}) {
    let tooltip = null;
    const decimalsForKilometers = 3,
        autoUnit = false,
        {styleSettings} = getters,
        element = document.createElement("div"),
        factory = {
            mapPointerMoveEvent: evt => {
                tooltip.setPosition(evt.coordinate);
            },
            featureChangeEvent: evt => {
                if (state?.drawType?.id === "drawCircle" || state?.drawType?.id === "drawDoubleCircle") {
                    if (autoUnit && evt.target.getRadius() > 500 || !autoUnit && styleSettings.unit === "km") {
                        tooltip.getElement().innerHTML = thousandsSeparator(Math.round(evt.target.getRadius()).toFixed(decimalsForKilometers) / 1000) + " km";
                    }
                    else {
                        tooltip.getElement().innerHTML = thousandsSeparator(Math.round(evt.target.getRadius())) + " m";
                    }
                    setters.setCircleRadius({getters, commit, dispatch}, Math.round(evt.target.getRadius()));
                }
                else if (state?.drawType?.id === "drawSquare") {
                    if (autoUnit && getArea(evt.target) > 500 || !autoUnit && styleSettings.unit === "km") {
                        tooltip.getElement().innerHTML = thousandsSeparator(Math.round(getArea(evt.target)).toFixed(decimalsForKilometers) / 1000) + " km²";
                    }
                    else {
                        tooltip.getElement().innerHTML = thousandsSeparator(Math.round(getArea(evt.target))) + " m²";
                    }
                    setters.setSquareArea({getters, commit, dispatch}, Math.round(getArea(evt.target)));
                }
            }
        };

    element.className = "ol-tooltip ol-tooltip-measure";

    if (styleSettings?.tooltipStyle && Object.keys(styleSettings.tooltipStyle).length !== 0) {
        Object.keys(styleSettings.tooltipStyle).forEach(key => {
            element.style[key] = styleSettings.tooltipStyle[key];
        });
    }

    tooltip = new Overlay({
        element,
        offset: [0, -15],
        positioning: "bottom-center"
    });

    tooltip.set("mapPointerMoveEvent", factory.mapPointerMoveEvent);
    tooltip.set("featureChangeEvent", factory.featureChangeEvent);

    return tooltip;
}

export default createTooltipOverlay;

import getProxyUrl from "../../../../utils/getProxyUrl";
import {GeoJSON, GPX, KML} from "ol/format.js";
import Circle from "ol/geom/Circle";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Icon from "ol/style/Icon";
import {createDrawStyle} from "../../draw/utils/style/createDrawStyle";
import isObject from "../../../../utils/isObject";
import {createEmpty as createEmptyExtent, extend} from "ol/extent";
import uniqueId from "../../../../utils/uniqueId";



export default {

    /**
     * Imports the given GeoJSON file from datasrc.raw, creating the features into datasrc.layer.
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the root getters
     * @param {Object} datasrc data source to import, with properties filename, layer and raw.
     * @returns {void}
     */
    importGeoJSON: ({state, dispatch, rootGetters}, datasrc) => {

        vectorLayer.setStyle((feature) => {
            const drawState = feature.getProperties().drawState;
            let style;

            if (!drawState) {
                const defaultColor = [226, 26, 28, 0.9],
                    defaultFillColor = [228, 26, 28, 0.5],
                    defaultPointSize = 16,
                    defaultStrokeWidth = 1,
                    defaultCircleRadius = 300,
                    geometryType = feature ? feature.getGeometry().getType() : "Cesium";

                if (geometryType === "Point" || geometryType === "MultiPoint") {
                    style = createDrawStyle(defaultColor, defaultColor, geometryType, defaultPointSize, 1, 1);
                }
                
            }

            if (drawState.drawType.geometry === "Point") {
                if (drawState.symbol.value !== "simple_point") {
                }
                else {
                    style = createDrawStyle(drawState.color, drawState.color, drawState.drawType.geometry, drawState.pointSize, 1, drawState.zIndex);
                }
            }
            
        });

    }
};

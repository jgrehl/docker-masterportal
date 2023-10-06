import differenceJS from "../../../shared/js/utils/differenceJS";
import sortBy from "../../../shared/js/utils/sortBy";
import store from "../../../app-store";
/**
 * sets the visible layers and set into variable
 * @param {Boolean} [printMapMarker=false] whether layer "markerPoint" should be filtered out
 * @returns {void}
 */
export default function getVisibleLayer (printMapMarker = false) {
    const layers = mapCollection.getMap("2D").getLayers(),
        visibleLayerList = typeof layers?.getArray !== "function" ? [] : layers.getArray().filter(layer => {
            return layer.getVisible() === true &&
                (
                    layer.get("name") !== "markerPoint" || printMapMarker
                );
        });

    sortVisibleLayerListByZindex(visibleLayerList);
}

/**
 * sorts the visible layer list by zIndex from layer
 * layers with undefined zIndex come to the beginning of array
 * @param {array} visibleLayerList with visble layer
 * @param {Object} param.commit the commit
 * @returns {array} sorted visibleLayerList
 */
function sortVisibleLayerListByZindex (visibleLayerList) {
    const visibleLayerListWithZIndex = visibleLayerList.filter(layer => {
            return layer.getZIndex() !== undefined;
        }),
        visibleLayerListWithoutZIndex = differenceJS(visibleLayerList, visibleLayerListWithZIndex);

    visibleLayerListWithoutZIndex.push(sortBy(visibleLayerListWithZIndex, (layer) => layer.getZIndex()));

    store.dispatch("Modules/Print/setVisibleLayerList", [].concat(...visibleLayerListWithoutZIndex));
}

import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import store from "../app-store";

const styleGetters = {
    mapMarkerPointStyleId: store.getters["MapMarker/pointStyleId"],
    mapMarkerPolygonStyleId: store.getters["MapMarker/polygonStyleId"],
    highlightFeaturesPointStyleId: store.getters["HighlightFeatures/pointStyleId"],
    highlightFeaturesPolygonStyleId: store.getters["HighlightFeatures/polygonStyleId"],
    highlightFeaturesLineStyleId: store.getters["HighlightFeatures/lineStyleId"]
};

/**
 * Initializes the styleList from masterportalAPI using the relevant variables from Parser and Store
 * @return {Promise<Object>} returns the styleList asynchronously
 */
export default function initializeStyleList () {
    return styleList.initializeStyleList(styleGetters, Config, Radio.request("Parser", "getItemsByAttributes", {type: "layer"}), Radio.request("Parser", "getItemsByAttributes", {type: "tool"}),
        (initializedStyleList, error) => {
            if (error) {
                Radio.trigger("Alert", "alert", {
                    text: "<strong>Die Datei '" + Config.styleConf + "' konnte nicht geladen werden!</strong>",
                    kategorie: "alert-warning"
                });
            }
            return initializedStyleList;
        });
}

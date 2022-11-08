<script>
import {mapMutations, mapActions} from "vuex";
import mutations from "../../store/mutationsOrientation";
import Icon from "ol/style/Icon";

export default {
    name: "PoiOrientation",
    methods: {
        ...mapMutations("controls/orientation", Object.keys(mutations)),
        ...mapActions("Maps", ["zoomToExtent"]),

        /**
         * Getting the image path from feature
         * @param  {ol/feature} feat Feature
         * @return {string} imgPath the image path
         */
        getImgPath (feat) {
            let imagePath = "";
            const style = Radio.request("StyleList", "returnModelById", feat.styleId);

            if (style) {
                const featureStyle = style.createStyle(feat, false);

                if (featureStyle?.getImage?.() instanceof Icon) {
                    imagePath = featureStyle.getImage()?.getSrc() ? featureStyle.getImage()?.getSrc() : "";
                }
                else {
                    style.getLegendInfos().forEach(legendInfo => {
                        if (legendInfo.geometryType === "Point" && legendInfo.styleObject.get("type") === "circle") {
                            imagePath = this.createCircleSVG(legendInfo.styleObject);
                        }
                        else if (legendInfo.geometryType === "LineString") {
                            imagePath = this.createLineSVG(legendInfo.styleObject);
                        }
                        else if (legendInfo.geometryType === "Polygon") {
                            imagePath = this.createPolygonGraphic(legendInfo.styleObject);
                        }
                    });
                }
            }

            return imagePath;
        }
    }
};
</script>

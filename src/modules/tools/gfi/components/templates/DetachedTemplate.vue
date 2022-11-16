<script>
import {mapActions} from "vuex";
import ToolWindow from "../../../../../share-components/ToolWindow.vue";

export default {
    name: "DetachedTemplate",
    components: {
        // DefaultTheme,
        // SensorTheme,
        ToolWindow
    },
    watch: {
        currentFeature: function () {
            this.highlightVectorFeature();
        }
    },
    mounted: function () {
        this.highlightVectorFeature();
        // this.setMarker();
    },
    updated: function () {
        if (this.isUpdated) {
            this.highlightVectorFeature();
            this.setMarker();
            this.$emit("updateFeatureDone");
        }
    },
    beforeDestroy: function () {
        this.removeHighlighting();
        this.removePointMarker();
    },
    methods: {
        ...mapActions("MapMarker", ["removePointMarker", "placingPointMarker"]),
        ...mapActions("Maps", ["highlightFeature", "removeHighlightFeature", "setCenter"]),
        close () {
            this.$emit("close");
        },

        /**
         * Sets the center of the view on the clickCoord and place the MapMarker on it
         * Set Marker and Center.
         * @returns {void}
         */
        setMarker () {
            // if (this.showMarker) {
            //     if (this.centerMapToClickPoint) {
            //         this.setCenter(this.clickCoordinate);
            //     }

            this.placingPointMarker(this.clickCoordinate);
            // }
        },

        /**
         * Highlights a vector feature
         * @returns {void}
         */
        highlightVectorFeature () {
            if (this.highlightVectorRules) {
                const layer = this.getLayerById({layerId: this.feature.getLayerId()}),
                    styleId = layer?.get("styleId");

                this.removeHighlighting();
                if (this.hideMapMarkerOnVectorHighlight) {
                    this.hideMarker();
                }

                if (this.feature.getOlFeature()?.getGeometry()?.getType() === "Point") {
                    this.highlightFeature({
                        feature: this.feature.getOlFeature(),
                        type: "increase",
                        scale: this.highlightVectorRules.image.scale,
                        layer: {id: this.feature.getLayerId()},
                        styleId
                    });
                }
                else if (this.feature.getOlFeature()?.getGeometry()?.getType() === "Polygon") {
                    this.highlightFeature({
                        feature: this.feature.getOlFeature(),
                        type: "highlightPolygon",
                        highlightStyle: {
                            fill: this.highlightVectorRules.fill,
                            stroke: this.highlightVectorRules.stroke
                        },
                        layer: {id: this.feature.getLayerId()},
                        styleId
                    });
                }
                else if (this.feature.getOlFeature()?.getGeometry()?.getType() === "LineString") {
                    this.highlightFeature({
                        feature: this.feature.getOlFeature(),
                        type: "highlightLine",
                        highlightStyle: {
                            stroke: this.highlightVectorRules.stroke
                        },
                        layer: {id: this.feature.getLayerId()},
                        styleId
                    });
                }
            }
        },
        /**
         * Removes the feature highlighting
         * @returns {void}
         */
        removeHighlighting: function () {
            this.removeHighlightFeature();
        }
    }
};
</script>

<template>
    <ToolWindow
        :focus-to-close-icon="true"
        @close="close"
    >
        <template #title>
            <!-- <span>{{ translate(title) }}</span> -->
        </template>
        <template #body>
            <!-- <component
                :is="theme"
                :feature="feature"
            />
            <slot name="footer" /> -->
        </template>
    </ToolWindow>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import LegendSingleLayer from "./LegendSingleLayer.vue";
import layerCollection from "../../../core/layers/js/layerCollection";
import validator from "../js/validator";

export default {
    name: "LegendContainer",
    components: {
        LegendSingleLayer
    },
    computed: {
        ...mapGetters("Modules/Legend", [
            "legends",
            "legendOnChanged",
            "preparedLegend"
        ]),
        ...mapGetters(["isMobile", "uiStyle", "visibleLayerConfigs"])
    },
    watch: {
        visibleLayerConfigs: {
            handler (newLayerConfigs, oldLayerConfigs) {
                this.$nextTick(() => {
                    newLayerConfigs.forEach(newConfig => {
                        const oldConfig = oldLayerConfigs.find(config => config.id === newConfig.id);

                        if (!oldConfig) {
                            const layer = layerCollection.getLayerById(newConfig.id);

                            this.toggleLayerInLegend(layer, true);
                        }
                    });
                    oldLayerConfigs.forEach(oldConfig => {
                        const newConfig = newLayerConfigs.find(config => config.id === oldConfig.id);

                        if (!newConfig) {
                            const layer = layerCollection.getLayerById(oldConfig.id);

                            this.toggleLayerInLegend(layer, false);
                        }
                    });
                });
            },
            deep: true
        },
        legendOnChanged: {
            handler (legend) {
                if (legend) {
                    this.createLegend();
                }
            },
            deep: true
        }
    },
    mounted () {
        this.createLegend();
    },
    methods: {
        ...mapActions("Modules/Legend", ["addLegend", "sortLegend", "removeLegend", "prepareLegend", "prepareLegendForGroupLayer"]),

        /**
         * Creates the legend.
         * @returns {void}
         */
        createLegend () {
            layerCollection.getLayers().forEach(layer => this.toggleLayerInLegend(layer, layer.get("visibility")));
        },

        /**
         * Generates or removed the layers legend object.
         * @param {Object} layer the layer to show the legend for
         * @param {Boolean} visibility visibility of layer in map
         * @returns {void}
         */
        toggleLayerInLegend (layer, visibility) {
            const
                layerId = layer.get("id"),
                layerName = layer.get("name"),
                layerLegend = layer.getLegend(),
                layerSelectionIDX = layer.get("selectionIDX"),
                layerTyp = layer.get("typ");

            if (visibility === false) {
                this.removeLegend(layerId);
            }
            else if (layerTyp === "GROUP") {
                this.generateLegendForGroupLayer(layer);
            }
            else {
                this.generateLegend(layerId, layerName, layerLegend, layerSelectionIDX);
            }
        },

        /**
         * Prepares the legend with the given legendInfos
         * @param {ol/Layer/Group} groupLayer grouplayer.
         * @returns {Object[]} - the prepared legend.
         */
        generateLegendForGroupLayer (groupLayer) {
            const id = groupLayer.get("id"),
                legendObj = {
                    id: id,
                    name: groupLayer.get("name"),
                    legend: this.prepareLegendForGroupLayer(groupLayer.get("layerSource")),
                    position: groupLayer.get("selectionIDX")
                },
                isValidLegend = validator.isValidLegendObj(legendObj),
                isNotInLegend = isValidLegend && !this.isLayerInLegend(id),
                isLegendChanged = isValidLegend && !isNotInLegend && this.isLegendChanged(id, legendObj);

            if (isNotInLegend) {
                this.addLegend(legendObj);
            }
            else if (isLegendChanged) {
                this.removeLegend(id);
                this.addLegend(legendObj);
            }
            this.sortLegend();
        },


        /**
         * Generates the legend object and adds it to the legend array in the store.
         * @param {String} id Id of layer.
         * @param {String} name Name of layer.
         * @param {Object[]} legend Legend of layer.
         * @param {Number} selectionIDX SelectionIDX of layer.
         * @returns {void}
         */
        generateLegend (id, name, legend, selectionIDX) {
            this.prepareLegend(legend);
            const legendObj = {
                    id: id,
                    name: name,
                    legend: this.preparedLegend,
                    position: selectionIDX
                },
                isValidLegend = validator.isValidLegendObj(legendObj),
                isNotInLegend = isValidLegend && !this.isLayerInLegend(id),
                isLegendChanged = isValidLegend && !isNotInLegend && this.isLegendChanged(id, legendObj);

            if (isNotInLegend) {
                this.addLegend(legendObj);
            }
            else if (isLegendChanged) {
                this.removeLegend(id);
                this.addLegend(legendObj);
            }
            this.sortLegend();
        },

        /**
        * Checks if given layerid is in the legend.
        * @param {String} layerId Id of layer.
        * @returns {Boolean} - Flag if layer is in the legend
        */
        isLayerInLegend (layerId) {
            return this.legends.filter((legendObj) => {
                return legendObj.id === layerId;
            }).length > 0;
        },

        /**
         * Checks if the legend object of the layer has changed
         * @param {String} layerId Id of layer
         * @param {Object} legendObj The legend object to be checked.
         * @returns {Boolean} - Flag if the legendObject has changed
         */
        isLegendChanged (layerId, legendObj) {
            let isLegendChanged = false;
            const layerLegend = this.legends.filter((legend) => {
                return legend.id === layerId;
            })[0];

            if (encodeURIComponent(JSON.stringify(layerLegend)) !== encodeURIComponent(JSON.stringify(legendObj))) {
                isLegendChanged = true;
            }
            return isLegendChanged;
        },


        /**
         * Generates an id using the layername and replacing all non alphanumerics with an underscore.
         * @param {String} layerName The name of the layer.
         * @returns {String} - An id consisting of the alphanumeric layername.
         */
        generateId (layerName) {
            return layerName ? "legend_" + layerName.replace(/[\W_]+/g, "_") : undefined;
        }
    }
};
</script>

<template>
    <div id="legend">
        <div
            v-for="legendObj, index in legends"
            :key="index"
        >
            <div class="bold mt-3">
                <span>{{ legendObj.name }}</span>
            </div>
            <LegendSingleLayer
                :id="generateId(legendObj.name)"
                :legend-obj="legendObj"
            />
            <hr
                v-if="index < legends.length - 1"
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>

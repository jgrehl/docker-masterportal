<script>
import {mapGetters, mapMutations} from "vuex";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";

import DrawLayout from "../../../shared/modules/draw/components/DrawLayout.vue";
import DrawTypes from "../../../shared/modules/draw/components/DrawTypes.vue";

export default {
    name: "DrawModule",
    components: {
        DrawLayout,
        DrawTypes
    },
    data () {
        return {
            source: new VectorSource()
        };
    },
    computed: {
        ...mapGetters("Modules/Draw", [
            "circleInnerRadius",
            "circleOuterRadius",
            "currentLayout",
            "currentLayoutOuterCircle",
            "drawTypes",
            "drawTypesGeometrie",
            "drawTypesSelected",
            "drawTypesSymbols",
            "interactiveCircle",
            "name",
            "selectedDrawType",
            "strokeRange"
        ]),
        ...mapGetters("Menu", [
            "currentComponentName",
            "mainExpanded",
            "secondaryExpanded"
        ])
    },
    watch: {
        mainExpanded (mainExpanded) {
            this.hidePopovers(mainExpanded, "mainMenu");

        },
        secondaryExpanded (secondaryExpanded) {
            this.hidePopovers(secondaryExpanded, "secondaryMenu");
        }
    },
    mounted () {
        const map2d = mapCollection.getMap("2D");

        map2d.addLayer(new VectorLayer({
            name: "importDrawLayer",
            source: this.source,
            zIndex: 99999999999
        }));
    },
    methods: {
        ...mapMutations("Modules/Draw", [
            "setCurrentLayout",
            "setCurrentLayoutOuterCircle",
            "setSelectedDrawType"
        ]),

        /**
         * Hides the popovers when menu is collapsed
         * @param {Boolean} isExpanded Is menu expanded.
         * @param {String} side The menu side
         * @returns {void}
         */
        hidePopovers (isExpanded, side) {
            if (!isExpanded && this.currentComponentName(side) === this.$t(this.name)) {
                this.$refs.drawTypes.hidePopovers();
            }
        }
    }
};
</script>

<template lang="html">
    <div
        id="modules-draw-module"
        class="d-flex flex-column"
    >
        <DrawTypes
            ref="drawTypes"
            class="mb-5"
            :circle-inner-radius="circleInnerRadius"
            :circle-outer-radius="circleOuterRadius"
            :current-layout="currentLayout"
            :current-layout-outer-circle="currentLayoutOuterCircle"
            :draw-types="drawTypes"
            :draw-types-geometrie="drawTypesGeometrie"
            :draw-types-symbols="drawTypesSymbols"
            :interactive-circle="interactiveCircle"
            :selected-draw-type="selectedDrawType"
            :set-selected-draw-type="setSelectedDrawType"
            :source="source"
        />
        <DrawLayout
            :current-layout="currentLayout"
            :selected-draw-type="selectedDrawType"
            :set-current-layout="setCurrentLayout"
            :stroke-range="strokeRange"
        />
        <DrawLayout
            v-if="selectedDrawType === 'doubleCircle'"
            :circle-type="'outerCircle'"
            :current-layout="currentLayoutOuterCircle"
            :selected-draw-type="selectedDrawType"
            :set-current-layout="setCurrentLayoutOuterCircle"
            :stroke-range="strokeRange"
        />
    </div>
</template>

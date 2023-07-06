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
            "circleOptions",
            "currentLayout",
            "currentLayoutOuterCircle",
            "drawIcons",
            "drawTypesGeometrie",
            "drawTypesMain",
            "drawTypesSymbols",
            "name",
            "selectedDrawType",
            "selectedDrawTypeMain",
            "strokeRange"
        ]),
        ...mapGetters("Menu", [
            "currentComponentName",
            "mainExpanded",
            "secondaryExpanded"
        ])
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
            "setSelectedDrawType",
            "setSelectedDrawTypeMain"
        ])
    }
};
</script>

<template lang="html">
    <div
        id="modules-draw-module"
        class="d-flex flex-column"
    >
        <div id="draw-types">
            <DrawTypes
                :circle-options="circleOptions"
                :current-layout="currentLayout"
                :current-layout-outer-circle="currentLayoutOuterCircle"
                :draw-icons="drawIcons"
                :draw-types="drawTypesMain"
                :selected-draw-type="selectedDrawType"
                :selected-draw-type-main="selectedDrawTypeMain"
                :set-selected-draw-type="setSelectedDrawType"
                :set-selected-draw-type-main="setSelectedDrawTypeMain"
                :source="source"
            />
            <DrawTypes
                v-if="selectedDrawTypeMain === 'geometries'"
                :circle-options="circleOptions"
                :current-layout="currentLayout"
                :current-layout-outer-circle="currentLayoutOuterCircle"
                :draw-icons="drawIcons"
                :draw-types="drawTypesGeometrie"
                :selected-draw-type="selectedDrawType"
                :set-selected-draw-type="setSelectedDrawType"
                :source="source"
            />
            <DrawTypes
                v-else-if="selectedDrawTypeMain === 'symbols'"
                :current-layout="currentLayout"
                :draw-icons="drawIcons"
                :draw-types="drawTypesSymbols"
                :selected-draw-type="selectedDrawType"
                :set-selected-draw-type="setSelectedDrawType"
                :source="source"
            />
        </div>
        <div id="draw-layouts">
            <DrawLayout
                v-if="selectedDrawType !== ''"
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
    </div>
</template>

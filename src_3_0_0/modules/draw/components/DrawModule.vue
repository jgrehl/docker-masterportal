<script>
import {mapGetters, mapMutations} from "vuex";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";

import DrawEdit from "../../../shared/modules/draw/components/DrawEdit.vue";
import DrawLayout from "../../../shared/modules/draw/components/DrawLayout.vue";
import DrawTypes from "../../../shared/modules/draw/components/DrawTypes.vue";

/**
 * Modules to make drawings.
 * @module modules/draw/components/DrawModule
 * @vue-data {ol/layer/Vector} layer - The vector layer for drawings.
 * @vue-data {ol/source/Vector} source - The vector source for drawings.
 */
export default {
    name: "DrawModule",
    components: {
        DrawEdit,
        DrawLayout,
        DrawTypes
    },
    data () {
        return {
            layer: null,
            source: new VectorSource()
        };
    },
    computed: {
        ...mapGetters("Modules/Draw", [
            "circleOptions",
            "currentLayout",
            "currentLayoutOuterCircle",
            "drawEdits",
            "drawIcons",
            "drawTypesGeometrie",
            "drawTypesMain",
            "drawTypesSymbols",
            "name",
            "selectedDrawType",
            "selectedDrawTypeMain",
            "selectedInteraction",
            "strokeRange"
        ]),
        ...mapGetters("Menu", [
            "currentComponentName",
            "mainExpanded",
            "secondaryExpanded"
        ])
    },
    mounted () {
        // Note: the layer handling still needs to be revised!
        const drawLayer = mapCollection.getMap("2D").getLayers().getArray().find(layer => layer.get("id") === "importDrawLayer");

        if (typeof drawLayer === "undefined") {
            this.layer = new VectorLayer({
                id: "importDrawLayer",
                name: "importDrawLayer",
                source: this.source,
                zIndex: 99999999999
            });

            mapCollection.getMap("2D").addLayer(this.layer);
        }
        else {
            this.layer = drawLayer;
            this.source = drawLayer.getSource();
        }
    },
    methods: {
        ...mapMutations("Modules/Draw", [
            "setCurrentLayout",
            "setCurrentLayoutOuterCircle",
            "setSelectedDrawType",
            "setSelectedDrawTypeMain",
            "setSelectedInteraction"
        ])
    }
};
</script>

<template lang="html">
    <div
        id="modules-draw-module"
        class="d-flex flex-column"
    >
        <div id="draw-edit">
            <DrawEdit
                v-if="layer !== null"
                :draw-edits="drawEdits"
                :draw-icons="drawIcons"
                :layer="layer"
                :selected-interaction="selectedInteraction"
                :set-selected-interaction="setSelectedInteraction"
            />
        </div>
        <div id="draw-types">
            <DrawTypes
                :circle-options="circleOptions"
                :current-layout="currentLayout"
                :current-layout-outer-circle="currentLayoutOuterCircle"
                :draw-icons="drawIcons"
                :draw-types="drawTypesMain"
                :selected-draw-type="selectedDrawType"
                :selected-draw-type-main="selectedDrawTypeMain"
                :selected-interaction="selectedInteraction"
                :set-selected-draw-type="setSelectedDrawType"
                :set-selected-draw-type-main="setSelectedDrawTypeMain"
                :set-selected-interaction="setSelectedInteraction"
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
                v-if="selectedDrawType !== '' && selectedDrawTypeMain !== ''"
                :current-layout="currentLayout"
                :selected-draw-type="selectedDrawType"
                :set-current-layout="setCurrentLayout"
                :stroke-range="strokeRange"
            />
            <DrawLayout
                v-if="selectedDrawType === 'doubleCircle' && selectedDrawTypeMain !== ''"
                :circle-type="'outerCircle'"
                :current-layout="currentLayoutOuterCircle"
                :selected-draw-type="selectedDrawType"
                :set-current-layout="setCurrentLayoutOuterCircle"
                :stroke-range="strokeRange"
            />
        </div>
    </div>
</template>

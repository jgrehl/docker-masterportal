<script>
import {mapGetters} from "vuex";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";

import DrawTypes from "../../../shared/modules/draw/components/DrawTypes.vue";

export default {
    name: "DrawModule",
    components: {
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
            "interactiveCircle"
        ])
    },
    mounted () {
        const map2d = mapCollection.getMap("2D");

        map2d.addLayer(new VectorLayer({
            name: "importDrawLayer",
            source: this.source,
            zIndex: 0
        }));
    }
};
</script>

<template lang="html">
    <div id="modules-draw-module">
        <DrawTypes
            :source="source"
            :draw-types-symbols="['point']"
            :circle-inner-radius="circleInnerRadius"
            :circle-outer-radius="circleOuterRadius"
            :interactive-circle="interactiveCircle"
        />
    </div>
</template>

<style lang="scss" scoped>
</style>


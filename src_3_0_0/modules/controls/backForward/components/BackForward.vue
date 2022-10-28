<script>
import {mapGetters, mapMutations} from "vuex";
import ControlIcon from "../../components/ControlIcon.vue";

/**
 * The BackForward control element allows stepping back
 * and forth through view states regarding zoom and center.
 */
export default {
    name: "BackForward",
    components: {
        ControlIcon
    },
    computed: {
        ...mapGetters("Controls/BackForward", [
            "backAvailable",
            "forthAvailable",
            "iconBack",
            "iconFor",
            "supportedDevice"
        ])
    },
    mounted () {
        mapCollection.getMap("2D").on("moveend", this.memorizeMap);
    },
    beforeDestroy () {
        mapCollection.getMap("2D").un("moveend", this.memorizeMap);
    },
    methods: {
        ...mapMutations("Controls/BackForward", [
            "backward",
            "forward",
            "memorize"
        ]),
        memorizeMap () {
            this.memorize(mapCollection.getMapView("2D"));
        },
        moveForward () {
            this.forward(mapCollection.getMap("2D"));
        },
        moveBackward () {
            this.backward(mapCollection.getMap("2D"));
        }
    }
};
</script>

<template>
    <div
        id="back-forward-buttons"
    >
        <ControlIcon
            class="forward"
            :title="$t(`common:modules.controls.backForward.stepForward`)"
            :disabled="!forthAvailable"
            :icon-name="iconFor"
            :on-click="moveForward"
        />
        <ControlIcon
            class="backward"
            :title="$t(`common:modules.controls.backForward.stepBackward`)"
            :disabled="!backAvailable"
            :icon-name="iconBack"
            :on-click="moveBackward"
        />
    </div>
</template>

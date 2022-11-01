
<script>
import {mapGetters, mapActions} from "vuex";
import ControlIcon from "../../components/ControlIcon.vue";

export default {
    name: "ZoomInAndOut",
    components: {
        ControlIcon
    },
    computed: {
        ...mapGetters("Maps", [
            "isMaxZoomDisplayed",
            "isMinZoomDisplayed",
            "mode"
        ])
    },
    methods: {
        ...mapActions("Maps", ["decreaseZoom", "increaseZoom"])
    }
};
</script>

<template>
    <div
        v-if="mode === '2D'"
        id="zoom-in-and-out-buttons"
    >
        <ControlIcon
            icon-name="plus-icon"
            :title="$t(`common:modules.controls.zoom.zoomIn`)"
            :disabled="isMaxZoomDisplayed"
            :on-click="increaseZoom"
        />
        <ControlIcon
            icon-name="minus-icon"
            :title="$t(`common:modules.controls.zoom.zoomOut`)"
            :disabled="isMinZoomDisplayed"
            :on-click="decreaseZoom"
        />
    </div>
</template>

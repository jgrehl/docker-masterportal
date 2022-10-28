<script>
import {mapGetters, mapActions} from "vuex";
import ControlIcon from "../../components/ControlIcon.vue";

/**
 * TotalView adds a control that lets the user reset the
 * view's state to the initial zoom and center coordinates.
 */
export default {
    name: "TotalView",
    computed: {
        ...mapGetters("Controls/TotalView", ["icon"]),
        ...mapGetters("Maps", ["center", "initialCenter", "initialZoom", "zoom"]),

        component () {
            return ControlIcon;
        },

        /**
         * Map was moved.
         * @returns {Boolean} true if map is not in initial zoom/center.
         */
        mapMoved () {
            if (this.center) {
                return this.initialCenter[0] !== Math.round(this.center[0]) ||
                    this.initialCenter[1] !== Math.round(this.center[1]) ||
                    this.initialZoom !== this.zoom;
            }
            return false;
        }
    },
    methods: {
        ...mapActions("Maps", ["resetView"]),

        startResetView () {
            this.resetView();
        }
    }
};
</script>

<template>
    <div id="total-view-button">
        <component
            :is="component"
            id="start-totalview"
            class="total-view-button"
            :title="$t('common:modules.controls.totalView.titleButton')"
            :disabled="!mapMoved"
            :icon-name="icon"
            :on-click="startResetView"
        />
    </div>
</template>

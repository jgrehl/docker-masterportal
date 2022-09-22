<script>
import {mapActions, mapGetters} from "vuex";
import ControlIcon from "../../ControlIcon.vue";

export default {
    name: "Button3dItem",
    props: {
        iconThreeD: {
            type: String,
            default: "badge-3d"
        }
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),

        /**
         * Returns the control icon component.
         * @returns {Component} The control icon component.
         */
        component () {
            return ControlIcon;
        },

        /**
         * Returns the button title depending on the current map mode.
         * @returns {String} The current button title.
         */
        buttonTitle () {
            return i18next.t(this.mode === "2D" ? "common:modules.controls.3d.buttonTitle3d" : "common:modules.controls.3d.buttonTitle2d");
        }
    },
    methods: {
        ...mapActions("Maps", ["changeMapMode"]),

        /**
         * Triggers the change of the map from 2D to 3D and vice versa.
         * @returns {void}
         */
        triggerChangeMapMode () {
            const targetMode = this.mode === "2D" ? "3D" : "2D";

            this.changeMapMode(targetMode);
        }
    }
};
</script>

<template>
    <div class="button-3d-button">
        <component
            :is="component"
            :title="buttonTitle"
            :on-click="triggerChangeMapMode"
            :button-title="buttonTitle"
            :icon-name="iconThreeD"
        />
    </div>
</template>

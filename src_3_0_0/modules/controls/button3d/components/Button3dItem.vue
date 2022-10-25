<script>
import {mapActions, mapGetters} from "vuex";
import ControlIcon from "../../components/ControlIcon.vue";

export default {
    name: "Button3dItem",
    computed: {
        ...mapGetters("Controls/Button3d", ["icon2d", "icon3d"]),
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
        },

        /**
         * Returns the button title depending on the current map mode.
         * @returns {String} The current button title.
         */
        buttonIcon () {
            return this.mode === "2D" ? this.icon3d : this.icon2d;
        }
    },
    methods: {
        ...mapActions("Maps", ["changeMapMode"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),

        /**
         * Triggers the change of the map from 2D to 3D and vice versa.
         * @returns {void}
         */
        triggerChangeMapMode () {
             this.addSingleAlert({
                    "content": "See alert",
                    "mustBeConfirmed": true,
                    "multipleAlert": true
                });
            document.getElementById("mymodal").modal("show");
            const targetMode = this.mode === "2D" ? "3D" : "2D";

            //this.changeMapMode(targetMode);
        }
    }
};
</script>

<template>
    <div id="button-3d-button">
        <component
            :is="component"
            :title="buttonTitle"
            :on-click="triggerChangeMapMode"
            :button-title="buttonTitle"
            :icon-name="buttonIcon"
        />
    </div>
</template>

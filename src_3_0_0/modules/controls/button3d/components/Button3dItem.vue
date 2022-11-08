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
            const targetMode = this.mode === "2D" ? "3D" : "2D";

            this.changeMapMode(targetMode);

            this.addSingleAlert({
                "title": "Title",
                "content": "I am Info",
                "mustBeConfirmed": true,
                "creationDate": "01/01/24",
                "multipleAlert": true});
            this.addSingleAlert({
                "title": "Title",
                "category": "news",
                "content": "I am News",
                "creationDate": "01/01/24",
                "mustBeConfirmed": true,
                "multipleAlert": true});
            this.addSingleAlert({
                "title": "Title",
                "category": "alert",
                "content": "I am Alert",
                "mustBeConfirmed": true,
                "multipleAlert": true});
            this.addSingleAlert({
                "title": "Title",
                "category": "error",
                "content": "I am Error",
                "mustBeConfirmed": true,
                "multipleAlert": true});

            this.addSingleAlert({
                "title": "Title",
                "category": "success",
                "content": "I am Success",
                "mustBeConfirmed": true,
                "multipleAlert": true});

            this.addSingleAlert({
                "title": "Title",
                "category": "owncategory",
                "content": "Welcome to 3D",
                "creationDate": "01/01/24",
                "mustBeConfirmed": true,
                "multipleAlert": true});

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

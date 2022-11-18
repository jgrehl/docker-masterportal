<script>
import {mapGetters, mapMutations} from "vuex";
import mutations from "../store/mutationsScaleSwitcher";

/**
 * Module to switch the scale of the map. Listens to changes of the map's scale and sets the scale to this value.
 */
export default {
    name: "ScaleSwitcher",
    computed: {
        ...mapGetters("Modules/ScaleSwitcher", ["active"]),
        scale: {
            get () {
                return this.$store.state.Maps.scale;
            },
            set (value) {
                this.$store.commit("Maps/setScale", value);
            }
        }
    },
    watch: {
        /**
         * Listens to the active property change.
         * @param {Boolean} isActive Value deciding whether the module gets activated or deactivated.
         * @returns {void}
         */
        active (isActive) {
            if (isActive) {
                this.setFocusToFirstControl();
            }
        }
    },
    /**
     * Lifecycle hook: adds a "close"-Listener to close the module.
     * @returns {void}
     */
    created () {
        this.scales = mapCollection.getMapView("2D").get("options").map(option => option.scale);
    },
    methods: {
        ...mapMutations("Menu/ScaleSwitcher", Object.keys(mutations)),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["scale-switcher-select"]) {
                    this.$refs["scale-switcher-select"].focus();
                }
            });
        },

        /**
         * Sets the choosen resolution to the map view.
         * @param {Number} index The selection index.
         * @returns {void}
         */
        setResolutionByIndex (index) {
            const view = mapCollection.getMapView("2D");

            view.setResolution(view.getResolutions()[index]);
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="scale-switcher"
        class="form-floating"
    >
        <select
            id="scale-switcher-select"
            ref="scale-switcher-select"
            v-model="scale"
            class="font-arial form-select form-select-sm float-start"
            @change="setResolutionByIndex($event.target.selectedIndex)"
        >
            <option
                v-for="(scaleValue, i) in scales"
                :key="i"
                :value="scaleValue"
            >
                1 : {{ scaleValue }}
            </option>
        </select>
        <label for="scale-switcher-select">
            {{ $t("modules.tools.scaleSwitcher.label") }}
        </label>
    </div>
</template>

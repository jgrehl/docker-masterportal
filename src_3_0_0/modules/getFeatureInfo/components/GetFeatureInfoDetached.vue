<script>
import DefaultTheme from "../themes/default/components/DefaultTheme.vue";
import SensorTheme from "../themes/sensor/components/SensorTheme.vue";
import getTheme from "../js/getTheme";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "GetFeatureInfoDetached",
    components: {
        DefaultTheme,
        SensorTheme
    },
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            isContentHtml: false
        };
    },
    computed: {
        ...mapGetters("Maps", ["clickCoordinate"]),
        ...mapGetters("Modules/GetFeatureInfo", [
            "centerMapToClickPoint",
            "currentFeature",
            "highlightVectorRules",
            "menuSide",
            "showMarker"
        ]),

        /**
         * Returns the title of the gfi.
         * @returns {String} the title
         */
        title: function () {
            return this.feature.getTitle();
        },

        /**
         * Returns the theme in which the feature should be displayed.
         * It only works if the theme has the same name as the theme component, otherwise the default theme will be used
         * @returns {String} the name of the theme
         */
        theme: function () {
            return getTheme(this.feature.getTheme(), this.$options.components, this.$gfiThemeAddons);
        }
    },
    created () {
        if (this.feature?.getMimeType() === "text/html") {
            this.isContentHtml = true;
        }
        // @todo aktivieren und nach Vue3 portieren, wenn noetig. Unklar, wann das event "hidemarker" geworfen wird
        // this.$on("hidemarker", () => {
        //     this.hideMarker();
        // });
    },
    mounted () {
        this.setMarker();
    },
    beforeUnmount: function () {
        this.removePointMarker();
    },
    methods: {
        ...mapMutations("Modules/GetFeatureInfo", ["setShowMarker"]),
        ...mapActions("Maps", [
            "placingPointMarker",
            "removePointMarker",
            "setCenter"
        ]),

        /**
         * Sets the center of the view on the clickCoord and place the MapMarker on it
         * Set Marker and Center.
         * @returns {void}
         */
        setMarker () {
            if (this.showMarker) {
                if (this.centerMapToClickPoint) {
                    this.setCenter(this.clickCoordinate);
                }
            }

            this.placingPointMarker(this.clickCoordinate);
        },

        /**
         * Hides the map marker
         * @returns {void}
         */
        hideMarker () {
            this.setShowMarker(false);
        },

        /**
         * In case they key exists, returns its translation. In case the key doesn't exist returns the key.
         * @param {String} key the key to translate
         * @param {Object} [options=null] for interpolation, formating and plurals
         * @returns {String} the translation or the key itself
         */
        translate (key, options = null) {
            return this.$t(key, options);
        }
    }
};
</script>

<template>
    <div>
        <h4 class="gfi-title font-bold mb-4">
            {{ translate(title) }}
        </h4>
        <component
            :is="theme"
            :feature="feature"
        />
        <slot name="pager" />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

 .gfi-title {
    text-align: center;
 }

</style>

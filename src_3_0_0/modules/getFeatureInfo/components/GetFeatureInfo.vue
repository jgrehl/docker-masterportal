<script>
import {mapGetters, mapMutations, mapActions} from "vuex";

import GetFeatureInfoDetached from "./GetFeatureInfoDetached.vue";
import {mapAttributes} from "../../../shared/js/utils/attributeMapper";
import omit from "../../../shared/js/utils/omit";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

export default {
    name: "GetFeatureInfo",
    components: {
        GetFeatureInfoDetached,
        IconButton
    },
    data () {
        return {
            // current index of the pagination and so also for the feature in the gfiFeatures
            pagerIndex: 0,
            // key for re-render child(detached) component
            componentKey: false,
            // icons for buttons
            leftIcon: "bi-chevron-left",
            rightIcon: "bi-chevron-right"
        };
    },
    computed: {
        ...mapGetters([
            "ignoredKeys",
            "uiStyle"
        ]),
        ...mapGetters("Modules/GetFeatureInfo", [
            "active",
            "currentFeature",
            "highlightVectorRules",
            "showMarker"
        ]),
        ...mapGetters("Modules/GetFeatureInfo", {
            gfiFeatures: "gfiFeaturesReverse"
        }),
        ...mapGetters("Maps", {
            clickCoordinate: "clickCoordinate",
            mapSize: "size"
        }),
        /**
         * Returns the current view type.
         * It only works if the string has the same name as the component (in ./templates).
         * @returns {String} the current view type (Detached or Mobile)
         */
        currentViewType: function () {
            return "GetFeatureInfoDetached";
        },
        /**
         * Is visible if there is at least one feature and the gfi is activated.
         * @returns {Boolean} gfi visibility
         */
        isVisible: function () {
            return this.gfiFeatures !== null && this.active;
        },
        /**
         * Returns the feature depending on the pager index.
         * @returns {?Object} - the current feature
         */
        feature: function () {
            if (this.gfiFeatures !== null && Array.isArray(this.gfiFeatures) && this.gfiFeatures.length > 0) {
                return this.gfiFeatures[this.pagerIndex];
            }
            return null;
        }
    },
    watch: {
        /**
         * Resets component, if active is false.
         * @param {Boolean} value active
         * @returns {void}
         */
        active (value) {
            if (!value) {
                this.reset();
            }
        },
        /**
         * Whenever the map click coordinate changes updateClick action will call.
         * @returns {void}
         */
        clickCoordinate () {
            this.updateClick();
        },
        /**
         * Whenever feature changes, put it into the store
         * @param {?Object} newValue - the current feature
         * @returns {void}
         */
        feature: function (newValue) {
            this.setCurrentFeature(newValue);
        },
        /**
         * Whenever mapSize changes, component key is changed
         * to force re-render detached component (key-changing).
         * @returns {void}
         */
        mapSize: function () {
            if (this.currentViewType === "GetFeatureInfoDetached") {
                this.componentKey = !this.componentKey;
            }
        },
        /**
         * Whenever gfiFeatures changes, set pagerIndex to zero.
         * @param {Object[]} gfiFeatures The gfi features.
         * @returns {void}
         */
        gfiFeatures: function (gfiFeatures) {
            this.pagerIndex = 0;

            if (gfiFeatures?.length > 0) {
                this.setActive(true);
            }
        }
    },
    beforeUpdate () {
        this.createMappedProperties(this.feature);
    },
    methods: {
        ...mapActions("Modules/GetFeatureInfo", ["updateClick"]),
        ...mapActions("Maps", ["registerListener", "unregisterListener"]),
        ...mapMutations("Modules/GetFeatureInfo", [
            "setActive",
            "setGfiFeatures",
            "setCurrentFeature"
        ]),

        /**
         * Reset means to set the gfiFeatures to null.
         * This closes the gfi window/modal/popover.
         * @returns {void}
         */
        reset: function () {
            this.setGfiFeatures(null);
        },

        /**
         * Increases the index for the pagination.
         * @returns {void}
         */
        increasePagerIndex: function () {
            if (this.pagerIndex < this.gfiFeatures.length - 1) {
                this.pagerIndex += 1;
            }
        },

        /**
         * Decreases the index for the pagination.
         * @returns {void}
         */
        decreasePagerIndex: function () {
            if (this.pagerIndex > 0) {
                this.pagerIndex -= 1;
            }
        },

        createMappedProperties: function (feature) {
            if (Array.isArray(feature?.getFeatures())) {
                feature.getFeatures().forEach(singleFeature => {
                    this.createMappedProperties(singleFeature);
                });

            }
            else if (feature?.getProperties() && feature?.getProperties() !== null) {
                feature.getMappedProperties = () => this.prepareProperties(feature.getProperties(), feature.getAttributesToShow(), this.ignoredKeys);
            }
        },

        /**
         * Checks which properties should be displayed.
         * If all should be displayed, the ignoredKeys omitted.
         * Otherwise the properties are mapped
         * @param {Object} properties - the feature properties
         * @param {Object} mappingObject - "gfiAttributes" from the layer
         * @param {String[]} ignoredKeys - configured in the config.js
         * @returns {Object} prepared properties - mapped by MappingObject or omitted by ignoredKeys
         */
        prepareProperties: function (properties, mappingObject, ignoredKeys) {
            if (mappingObject === "showAll" && Array.isArray(ignoredKeys)) {
                return omit(properties, ignoredKeys, true);
            }
            return mapAttributes(properties, mappingObject);
        }
    }
};
</script>

<template>
    <div
        v-if="isVisible && feature !== null"
        class="gfi"
    >
        <component
            :is="currentViewType"
            :key="componentKey"
            :feature="feature"
            @close="reset"
        >
            <!-- Slot Content for Footer -->
            <template
                v-if="gfiFeatures.length > 1"
                #footer
            >
                <div class="gfi-footer d-flex justify-content-around mt-3">
                    <IconButton
                        :class-array="[pagerIndex < 1 ? 'disabled' : '', 'pager-left', 'pager']"
                        :interaction="decreasePagerIndex"
                        :icon="leftIcon"
                    />
                    <span class="my-auto">
                        {{ pagerIndex+1 + "/" + gfiFeatures.length }}
                    </span>
                    <IconButton
                        :class-array="[pagerIndex === gfiFeatures.length - 1 ? 'disabled' : '', 'pager-right', 'pager']"
                        :interaction="increasePagerIndex"
                        :icon="rightIcon"
                    />
                </div>
            </template>
        </component>
    </div>
</template>


<style lang="scss">
@import "~variables";

    .gfi {
        color: $dark_blue;
    }

</style>

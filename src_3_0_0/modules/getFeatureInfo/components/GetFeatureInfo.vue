<script>
import {mapGetters, mapMutations, mapActions} from "vuex";

import GetFeatureInfoDetached from "./GetFeatureInfoDetached.vue";
import {mapAttributes} from "@masterportal/masterportalapi/src/lib/attributeMapper";
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
            "ignoredKeys"
        ]),
        ...mapGetters("Modules/GetFeatureInfo", [
            "currentFeature",
            "highlightVectorRules",
            "menuSide",
            "name",
            "showMarker",
            "type",
            "visible"
        ]),
        ...mapGetters("Modules/GetFeatureInfo", {
            gfiFeatures: "gfiFeaturesReverse"
        }),
        ...mapGetters("Maps", {
            clickCoordinate: "clickCoordinate",
            mapSize: "size"
        }),
        ...mapGetters("Menu", [
            "currentComponent",
            "currentMouseMapInteractionsComponent",
            "expanded"
        ]),

        /**
         * Returns the current component type of the menu navigation by side.
         * @returns {String} The current component type.
         */
        currentComponentType () {
            return this.currentComponent(this.menuSide)?.type;
        },

        /**
         * Returns the current view type.
         * It only works if the string has the same name as the component (in ./templates).
         * @returns {String} the current view type (Detached or Mobile)
         */
        currentViewType: function () {
            return "GetFeatureInfoDetached";
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
         * Resets component, if visible is false.
         * @param {Boolean} value visible
         * @returns {void}
         */
        visible (value) {
            if (!value) {
                this.reset();
            }
            else {
                this.changeCurrentComponent({type: this.type, side: this.menuSide, props: {name: this.name}});
            }
        },
        /**
         * Whenever the map click coordinate changes updateClick action will call.
         * @returns {void}
         */
        clickCoordinate: {
            handler () {
                if (this.currentMouseMapInteractionsComponent === this.type) {
                    this.pagerIndex = 0;
                    this.updateClick();
                }
            },
            deep: true
        },

        /**
         * Whenever current component type is changed to  "getFeatureInfo", visible is set to false.
         * @param {String} type The current component type.
         * @returns {void}
         */
        currentComponentType (type) {
            if (type !== this.type) {
                this.setVisible(false);
            }
        },

        /**
         * Whenever feature changes, put it into the store
         * @param {?Object} newValue the current feature
         * @returns {void}
         */
        feature (newValue) {
            this.setCurrentFeature(newValue);
        },

        /**
         * Whenever mapSize changes, component key is changed
         * to force re-render detached component (key-changing).
         * @returns {void}
         */
        mapSize: {
            handler () {
                if (this.currentViewType === "GetFeatureInfoDetached") {
                    this.componentKey = !this.componentKey;
                }
            },
            deep: true
        },

        /**
         * Whenever gfiFeatures changes, set pagerIndex to zero.
         * @param {Object[]} gfiFeatures The gfi features.
         * @returns {void}
         */
        gfiFeatures: {
            handler (gfiFeatures) {
                if (gfiFeatures?.length > 0) {
                    this.setVisible(true);
                    if (!this.expanded(this.menuSide)) {
                        this.toggleMenu(this.menuSide);
                    }
                }
            },
            deep: true
        }
    },
    beforeUpdate () {
        this.createMappedProperties(this.feature);
    },
    methods: {
        ...mapMutations("Modules/GetFeatureInfo", [
            "setGfiFeatures",
            "setCurrentFeature",
            "setVisible"
        ]),
        ...mapActions("Modules/GetFeatureInfo", [
            "updateClick"
        ]),
        ...mapActions("Menu", [
            "changeCurrentComponent",
            "toggleMenu"
        ]),

        /**
         * Reset means to set the gfiFeatures to null.
         * This closes the gfi window/modal/popover.
         * @returns {void}
         */
        reset: function () {
            this.pagerIndex = 0;
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
        v-if="visible && feature !== null"
        class="gfi"
    >
        <component
            :is="currentViewType"
            v-if="visible && feature !== null"
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
                        :aria="$t('modules.tools.gfi.buttonBack')"
                        :class-array="[pagerIndex < 1 ? 'disabled' : '', 'pager-left', 'pager', 'btn-primary']"
                        :icon="leftIcon"
                        :interaction="decreasePagerIndex"
                    />
                    <span class="my-auto">
                        {{ pagerIndex+1 + "/" + gfiFeatures.length }}
                    </span>
                    <IconButton
                        :aria="$t('modules.tools.gfi.buttonForward')"
                        :class-array="[pagerIndex === gfiFeatures.length - 1 ? 'disabled' : '', 'pager-right', 'pager', 'btn-primary']"
                        :icon="rightIcon"
                        :interaction="increasePagerIndex"
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

    .gfi-footer {
        position: sticky;
        bottom: 0;
        background-color: $menu-background-color;
    }
</style>

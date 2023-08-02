<script>
import {mapGetters, mapMutations, mapActions} from "vuex";

import GetFeatureInfoDetached from "./GetFeatureInfoDetached.vue";
import {mapAttributes} from "@masterportal/masterportalapi/src/lib/attributeMapper";
import omit from "../../../shared/js/utils/omit";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Get Feature Info
 * @module modules/GetFeatureInfo
 * @vue-data {Number} pagerIndex - The current index of the pagination.
 * @vue-data {String} componentKey - The key for re-render child component.
 * @vue-data {String} leftIcon - The icon for button.
 * @vue-data {String} rightIcon - The icon for the Button.
 * @vue-data {Boolean} updatedFeature - if true, feature is updated
 * @vue-computed {String} currentComponentType - The current component type of the menu navigation by side.
 * @vue-computed {String} currentViewType - The current view type.
 * @vue-computed {Object} feature - The feature depending on the pager index.
 */
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
            rightIcon: "bi-chevron-right",
            updatedFeature: false
        };
    },
    computed: {
        ...mapGetters([
            "ignoredKeys"
        ]),
        ...mapGetters("Modules/GetFeatureInfo", [
            "configPaths",
            "currentFeature",
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
                this.changeCurrentComponent({type: this.type, side: this.menuSide, props: {name: "none"}});
            }
        },
        /**
         * Whenever the map click coordinate changes collectGfiFeatures action will call.
         * @returns {void}
         */
        clickCoordinate: {
            handler () {
                if (this.currentMouseMapInteractionsComponent === this.type) {
                    this.pagerIndex = 0;
                    this.collectGfiFeatures();
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
         * Whenever gfiFeatures changes, set this visible and expand menu.
         * Set the updateFeature value to true if feature are given.
         * @param {?Object} newFeatures - the current features
         * @param {?Object} oldFeatures - the recent features
         * @returns {void}
         */
        gfiFeatures: {
            handler (newFeatures, oldFeatures) {
                let featuresChanged = oldFeatures === null;

                if (newFeatures?.length > 0) {
                    if (oldFeatures !== null) {
                        newFeatures.forEach(newFeature => {
                            if (!oldFeatures.find(oldFeat => oldFeat.getId() === newFeature.getId())) {
                                featuresChanged = true;
                            }
                        });
                        oldFeatures.forEach(oldFeature => {
                            if (!newFeatures.find(newFeat => newFeat.getId() === oldFeature.getId())) {
                                featuresChanged = true;
                            }
                        });
                    }

                    if (featuresChanged) {
                        this.setVisible(true);
                        if (!this.expanded(this.menuSide)) {
                            this.toggleMenu(this.menuSide);
                        }
                    }
                    this.setUpdatedFeature(true);
                }
                else if (newFeatures === null) {
                    this.resetMenu(this.menuSide);
                    this.setUpdatedFeature(false);
                }
            },
            deep: true
        }
    },
    mounted () {
        this.initializeModule({configPaths: this.configPaths, type: this.type});
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
        ...mapActions(["initializeModule"]),
        ...mapActions("Modules/GetFeatureInfo", [
            "collectGfiFeatures"
        ]),
        ...mapActions("Menu", [
            "changeCurrentComponent",
            "resetMenu",
            "toggleMenu"
        ]),

        /**
         * Set updatedFeature value.
         * @param {Boolean} val - false if features have been updated or no features are given
         * @returns {void}
         */
        setUpdatedFeature: function (val) {
            this.updatedFeature = val;
        },

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
            :is-updated="updatedFeature"
            @update-feature-done="setUpdatedFeature(true)"
            @close="reset"
        >
            <!-- Slot Content for Footer -->
            <template
                #pager
            >
                <div class="gfi-pager mt-3">
                    <IconButton
                        v-if="gfiFeatures.length > 1 && pagerIndex > 0"
                        :aria="$t('common:modules.getFeatureInfo.buttonBack')"
                        :class-array="['pager-left', 'pager', 'btn-primary']"
                        :icon="leftIcon"
                        :interaction="decreasePagerIndex"
                    />
                    <IconButton
                        v-if="gfiFeatures.length > 1 && pagerIndex < gfiFeatures.length - 1"
                        :aria="$t('common:modules.getFeatureInfo.buttonForward')"
                        :class-array="['pager-right', 'pager', 'btn-primary']"
                        :icon="rightIcon"
                        :interaction="increasePagerIndex"
                    />
                </div>
            </template>
        </component>
    </div>
</template>


<style lang="scss" scoped>
@import "~variables";

    .gfi {
        color: $dark_blue;
    }

    .gfi-pager {
        background-color: $menu-background-color;
        position: absolute;
        width: 100%;
        top: 45px;
    }

    .pager {
        position: absolute;
        &-right {
            right: 40px
        }
    }

</style>

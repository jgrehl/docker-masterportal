<script>
import {mapGetters, mapMutations, mapActions} from "vuex";

import GetFeatureInfoDetached from "./GetFeatureInfoDetached.vue";
import {mapAttributes} from "../../../shared/js/utils/attributeMapper";
import omit from "../../../shared/js/utils/omit";

export default {
    name: "GetFeatureInfo",
    components: {
        GetFeatureInfoDetached
    },
    data () {
        return {
            // current index of the pagination and so also for the feature in the gfiFeatures
            pagerIndex: 0,
            // key for re-render child(detached) component
            componentKey: false
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
            // console.log("#### this.gfiFeatures",this.gfiFeatures);
            // console.log("this.active",this.active);
            return this.gfiFeatures !== null && this.active;
        },
        /**
         * Returns the feature depending on the pager index.
         * @returns {?Object} - the current feature
         */
        feature: function () {
            // console.log("???????????????????", this.gfiFeatures);
            if (this.gfiFeatures !== null && Array.isArray(this.gfiFeatures) && this.gfiFeatures.length > 0) {
                return this.gfiFeatures[this.pagerIndex];
            }
            return null;
        }
    },
    watch: {
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
                <div class="gfi-footer">
                    <div
                        :class="[pagerIndex < 1 ? 'disabled' : '', 'pager-left', 'pager']"
                        tabindex="0"
                        @click="decreasePagerIndex"
                        @keydown.enter="decreasePagerIndex"
                    >
                        <span class="bootstrap-icon">
                            <i class="bi-chevron-left" />
                        </span>
                    </div>
                    <div
                        tabindex="0"
                        :class="[pagerIndex === gfiFeatures.length - 1 ? 'disabled' : '', 'pager-right', 'pager']"
                        @click="increasePagerIndex"
                        @keydown.enter="increasePagerIndex"
                    >
                        <span class="bootstrap-icon">
                            <i class="bi-chevron-right" />
                        </span>
                    </div>
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
    .bold{
        font-weight: bold;
    }
    .gfi-footer {
        color: $dark_grey;
        font-size: $font_size_huge;
            .pager {
            background-color: $secondary;
            padding: 6px;
            cursor: pointer;
            width: 50%;
            margin: 0;
            text-align: center;
            list-style: none;
        }

        .pager-left {
            float: left;
            border-right: 1px solid $light_grey;
        }

        .pager-right {
            float: right;
        }
        .disabled {
            cursor: not-allowed;
            background-color: lighten($light_grey_inactive, 40%);
            color: $light_grey_inactive_contrast;
        }
    }

</style>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import LayerPreview from "../../../shared/modules/layerPreview/components/LayerPreview.vue";

/**
 * Displays a checkbox to select a layer in layertree.
 * @module modules/LayerCheckBox
 * @vue-prop {Object} conf - The current layer configuration.
 * @vue-prop {Boolean} isLayerTree - Shows if parent is layer tree (true) or layer selection (false).
 * @vue-computed {Boolean} isLayerVisible - Returns the value of layerConf's attribute visibility.
 */
export default {
    name: "LayerCheckBox",
    components: {
        LayerPreview
    },
    props: {
        /** current layer configuration */
        conf: {
            type: Object,
            required: true
        },
        /** true, if parent is layer tree and false if parent is layer selection */
        isLayerTree: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        ...mapGetters(["layerConfigById"]),
        ...mapGetters("Modules/LayerSelection", ["layersToAdd"]),

        /**
         * Returns the value of layerConf's attribute visibility
         * @returns {Boolean} the value of layerConf's attribute visibility
         */
        isLayerVisible () {
            return typeof this.conf.visibility === "boolean" ? this.conf.visibility : false;
        }
    },
    methods: {
        ...mapActions(["replaceByIdInLayerConfig"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapMutations("Modules/LayerSelection", ["addSelectedLayer", "removeSelectedLayer"]),

        /**
         * Replaces the value of current conf's visibility in state's layerConfig
         * @param {Boolean} value visible or not
         * @returns {void}
         */
        visibilityInLayerTreeChanged (value) {
            this.replaceByIdInLayerConfig(
                {
                    layerConfigs: [{
                        id: this.conf.id,
                        layer: {
                            id: this.conf.id,
                            visibility: value
                        }
                    }]
                }
            );
        },
        /**
         * Listener for click on layer checkbox.
         * @returns {void}
         */
        clicked () {
            if (!this.isLayerVisible || this.isLayerTree) {
                const value = !this.isChecked();

                this.showLayerAttributions(value);

                if (this.isLayerTree) {
                    this.visibilityInLayerTreeChanged(value);
                }
                else if (value) {
                    this.addSelectedLayer({layerId: this.conf.id});
                }
                else {
                    this.removeSelectedLayer({layerId: this.conf.id});
                }
            }
        },

        /**
         * Show an alert that contains the layerAttributions, if these exist.
         * @param {Boolean} isChecked Layer is checked in layerTree.
         * @returns {void}
         */
        showLayerAttributions (isChecked) {
            const attributes = this.layerConfigById(this.conf.id),
                layerAttribution = attributes?.layerAttribution;

            if (isChecked && typeof layerAttribution !== "undefined" && layerAttribution !== "nicht vorhanden") {
                this.addSingleAlert({
                    content: layerAttribution,
                    category: "info",
                    title: attributes?.name,
                    onceInSession: true
                });
            }
        },

        /**
         * Returns true, if layer checkbox is checked.
         * @returns {Boolean} true, if layer checkbox is checked
         */
        isChecked () {
            if (this.isLayerTree) {
                return this.isLayerVisible;
            }
            return this.isLayerVisible || this.layersToAdd.indexOf(this.conf.id) > -1;
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="conf.baselayer && !conf.showInLayerTree"
        class="w-100 pe-2 p-1"
    >
        <LayerPreview
            :id="'layer-tree-layer-preview-' + conf.id"
            :layer-id="conf.id"
            :checkable="true"
            :checked="isChecked()"
            :zoom-level="typeof conf.preview?.zoomLevel === 'number'? conf.preview?.zoomLevel : null"
            :radius="conf.preview?.radius ? conf.preview?.radius : null"
            :center="conf.preview?.center ? conf.preview?.center : null"
            :custom-class="conf.preview?.customClass ? conf.preview?.customClass : null"
            @preview-clicked="clicked()"
        />
        <label
            :class="['pt-4']"
            :for="'layer-tree-layer-preview-' + conf.id"
            tabindex="0"
            :aria-label="$t(conf.name)"
        >
            <span
                v-if="conf.shortname"
                class="small-text"
            >
                {{ $t(conf.shortname) }}
            </span>
            <span
                v-else
                class="small-text"
            >
                {{ $t(conf.name) }}
            </span>
        </label>
    </div>
    <div
        v-else
        :id="'layer-checkbox-' + conf.id"
        class="d-flex w-100 layer-tree-layer-title pe-2 p-1"
        @click="clicked()"
        @keydown.enter="clicked()"
    >
        <span
            :id="'layer-tree-layer-checkbox-' + conf.id"
            :class="[
                'layer-tree-layer-checkbox ps-1 pe-3',
                {
                    'bi-check-square': isChecked(),
                    'bi-square': !isChecked()
                }
            ]"
        />
        <label
            :class="['layer-tree-layer-label', 'mt-0 d-flex flex-column align-self-start', isLayerVisible ? 'bold' : '']"
            :for="'layer-tree-layer-checkbox-' + conf.id"
            tabindex="0"
            :aria-label="$t(conf.name)"
        >
            <span
                v-if="conf.shortname"
                :class="isLayerTree ? '' : 'small-text'"
            >
                {{ $t(conf.shortname) }}
            </span>
            <span
                v-else
                :class="isLayerTree ? '' : 'small-text'"
            >
                {{ $t(conf.name) }}
            </span>
        </label>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-tree-layer-title, .layer-tree-layer-checkbox {
        border-radius: 15px;
        &:hover {
            @include primary_action_hover;
        }
        &:focus {
            @include primary_action_focus;
        }
    }
    .layer-tree-layer-label {
        cursor: pointer;
    }
    .small-text {
    font-size: $font-size-sm;
    }

</style>

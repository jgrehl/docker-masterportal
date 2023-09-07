<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import LayerPreview from "../../../shared/modules/layerPreview/components/LayerPreview.vue";
import escapeId from "../../../shared/js/utils/escapeId";

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
        ...mapGetters("Modules/LayerSelection", ["layersToAdd", "highlightLayerId"]),

        /**
         * Returns the value of layerConf's attribute visibility
         * @returns {Boolean} the value of layerConf's attribute visibility
         */
        isLayerVisible () {
            return typeof this.conf.visibility === "boolean" ? this.conf.visibility : false;
        },
        /**
         * Returns true, if layer is visible or state property 'boldLayerId' contains this confs id.
         * @returns {Boolean} true, if layers name shall be displayed bold
         */
        isBold () {
            return this.isLayerVisible || this.highlightLayerId === this.conf.id;
        }
    },
    methods: {
        ...mapActions(["replaceByIdInLayerConfig"]),
        ...mapMutations("Modules/LayerSelection", ["addSelectedLayer", "removeSelectedLayer"]),
        escapeId,

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
    <button
        v-else
        :id="'layer-checkbox-' + escapeId(conf.id)"
        class="d-flex w-100 layer-tree-layer-title pe-2 p-1 btn-transparent"
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
            :class="['layer-tree-layer-label', 'mt-0 d-flex flex-column align-self-start', isBold ? 'bold' : '']"
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
    </button>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";
    .btn-transparent {
        background-color: transparent;
        border: none;
    }
    .layer-tree-layer-title, .layer-tree-layer-checkbox {
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

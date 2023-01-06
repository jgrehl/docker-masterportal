<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

/**
 * Representation of a layer in layerTree.
 */
export default {
    name: "LayerCheckBox",
    components: {

    },
    /** current layer configuration */
    props: {
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
        ...mapGetters("Maps", ["mode"]),
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
        isChecked () {
            if (this.isLayerTree) {
                return this.isLayerVisible;
            }
            return this.isLayerVisible || this.layersToAdd.indexOf(this.conf.id) > -1 || this.conf.showInLayerTree;
        },
        disabled () {
            return !this.isLayerTree && (this.isLayerVisible || this.layersToAdd.indexOf(this.conf.id) > -1 || this.conf.showInLayerTree) || null;
        }
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-checkbox-' + conf.id"
        class="layer-tree-layer-title pe-2 p-1"
        data-bs-toggle="tooltip"
        :title="disabled() ? $t('tree.isAlreadyAdded') :null"
        @click="clicked()"
        @keydown.enter="clicked()"
    >
        <span
            :id="'layer-tree-layer-checkbox-' + conf.id"
            :class="[
                'layer-tree-layer-checkbox pe-2',
                {
                    'bi-check2-square': isChecked(),
                    'bi-square': !isChecked(),
                    'disabled': disabled()
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
    input:disabled+label {
        color: #ccc;
        font-weight: normal;
        font-style: italic;
        cursor: not-allowed;
    }

</style>

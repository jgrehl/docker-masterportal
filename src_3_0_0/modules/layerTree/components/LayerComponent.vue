<script>
import {mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";

/**
 * Representation of a layer in layerTree.
 */
export default {
    name: "LayerComponent",
    /** current layer configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),
        checkboxValue: {
            get () {
                return this.isLayerVisible;
            },
            set () {
                // v-model: setter must be here, but does nothing - setting is handeled by click-event
            }
        },
        isLayerVisible () {
            return typeof this.conf.visibility === "boolean" ? this.conf.visibility : false;
        }
    },
    methods: {
        ...mapMutations(["replaceByIdInLayerConfig"]),
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
     * Returns true, if layer configuration shall be shown in tree in current map mode.
     * Filteres by attribute 'showInLayerTree'.
     * @returns {boolean} true, if layer configuration shall be shown in tree
     */
        showInLayerTree () {
            const layerTypes3d = layerFactory.getLayerTypes3d();

            return this.conf.showInLayerTree === true && (this.mode === "2D" ? !layerTypes3d.includes(this.conf.typ?.toUpperCase()) : true);
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="showInLayerTree()"
        :id="'layer-tree-layer-' + layerConf.id"
        class="layer-tree-layer form-check"
    >
        <div class="layer-tree-layer-title">
            <input
                :id="'layer-tree-layer-checkbox' + layerConf.id"
                v-model="checkboxValue"
                type="checkbox"
                class="layer-tree-layer-checkbox form-check-input"
                @click="visibilityInLayerTreeChanged(!isLayerVisible())"
                @keydown="visibilityInLayerTreeChanged(!isLayerVisible())"
            >
            <label
                :class="['layer-tree-layer-label', 'mt-0 d-flex flex-column align-self-start', isLayerVisible() ? 'bold' : '']"
                :for="'layer-tree-layer-checkbox' + layerConf.id"
                tabindex="0"
            >
                <span>
                    {{ layerConf.name }}
                </span>
            </label>
        </div>
        <div class="layer-tree-layer-icons">
            <span
                class="layer-tree-layer-info bootstrap-icon"
                tabindex="0"
                :title="$t('common:tree.infosAndLegend')"
                @click="openLayerInformation($event, layerConf)"
                @keydown="openLayerInformation($event, layerConf)"
            >
                <i class="bi bi-info-circle-fill" />
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-tree-layer {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-base;

        .layer-tree-layer-title, .layer-tree-layer-checkbox {
            &:hover {
                @include primary_action_hover;
            }
            &:focus {
                @include primary_action_focus;
            }

            .bold {
                font-weight: bold;
            }
            .layer-tree-layer-label {
                flex-basis: 90%;
            }
        }

        .layer-tree-layer-icons {
            .layer-tree-layer-info {
                &:hover {
                    @include primary_action_hover;
                }
                &:focus {
                    @include primary_action_focus;
                }
            }
        }
    }
</style>

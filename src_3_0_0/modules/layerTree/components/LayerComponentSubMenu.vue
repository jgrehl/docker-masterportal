<script>
import {mapActions} from "vuex";
import LightButton from "../../../shared/modules/buttons/components/LightButton.vue";
import layerFactory from "../../../core/layers/js/layerFactory";

export default {
    name: "LayerComponentSubMenu",
    components: {
        LightButton
    },
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    computed: {
        /**
         * Returns the transparency of the layer config.
         * @returns {Number} Transparency of the layer config.
         */
        transparency () {
            return this.layerConf.transparency || 0;
        },

        /**
         * Indicates if the layer type supports transparency settings.
         * NOte: The type Tileset3D is supported.
         * @returns {Boolean} Supports transparency.
         */
        supportedTransparency () {
            const unSupportedLayerTypes = layerFactory.getLayerTypes3d().filter(layerType => layerType !== "TILESET3D");

            return !unSupportedLayerTypes.includes(this.layerConf.typ?.toUpperCase());
        }
    },
    methods: {
        ...mapActions("Modules/LayerTree", ["removeLayer", "updateTransparency"])
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-sub-menu-' + layerConf.id"
        class="d-flex flex-column layer-component-sub-menu"
    >
        <div class="remove-layer-container">
            <LightButton
                :interaction="() => removeLayer(layerConf)"
                :text="$t('common:modules.layerTree.iconRemoveLayer')"
                icon="bi-trash3"
                customclass="light-button"
            />
        </div>
        <div
            v-if="supportedTransparency"
            :id="'layer-component-icon-sub-menu-transparency-container-' + layerConf.id"
            class="d-flex align-items-center ms-3 transparency-container"
        >
            <i class="bi-droplet-half" />
            <label
                :for="'layer-component-sub-menu-transparency-input-' + layerConf.id"
            >
                {{ $t("common:modules.layerTree.iconTransparency") + ":" }}
            </label>
            <input
                :id="'layer-component-sub-menu-transparency-input-' + layerConf.id"
                class="mx-3 transparency-input"
                type="range"
                :title="`${transparency}%`"
                :value="transparency"
                min="0"
                max="100"
                step="1"
                @input="updateTransparency({layerConf, transparency: parseInt($event.target.value, 10)})"
            >
            <span>
                {{ `${transparency}%` }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .layer-component-sub-menu {
        font-size: $font-size-base;

        .remove-layer-container {
            .light-button {
                font-size: $font-size-base;
            }
        }

        .transparency-container {
            min-height: 2.5rem;

            i {
                padding-right: .5rem;
            }

            .transparency-input {
                accent-color: $secondary;
            }
        }
    }
</style>

<script>
import {mapActions} from "vuex";
import LightButton from "../../../shared/modules/buttons/components/LightButton.vue";

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
         * @returns {Number} Transparency of the layer config
         */
        transparency () {
            return this.layerConf?.transparency || 0;
        }
    },
    methods: {
        ...mapActions("Modules/LayerTree", ["removeLayer", "updateTransparency"])
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-sub-menu' + layerConf.id"
        class="d-flex flex-column layer-component-sub-menu"
    >
        <div class="layer-component-sub-menu-remove-layer-container">
            <LightButton
                :interaction="() => removeLayer(layerConf)"
                :text="$t('common:layerTree.iconRemoveLayer')"
                icon="bi-trash3-fill"
                customclass="layer-component-sub-menu-remove-layer-light-button"
            />
        </div>
        <div
            :id="'layer-component-icon-sub-menu-transparency-container-' + layerConf.id"
            class="d-flex align-items-center ms-3 layer-component-sub-menu-transparency-container"
        >
            <i class="bi-droplet-half" />
            <label
                :for="'layer-component-sub-menu-transparency-input-' + layerConf.id"
            >
                {{ $t("common:layerTree.iconTransparency") + ":" }}
            </label>
            <input
                :id="'layer-component-sub-menu-transparency-input-' + layerConf.id"
                class="mx-3 layer-component-sub-menu-transparency-input"
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
    @import "~mixins";

    .layer-component-sub-menu {
        font-size: $font-size-sm;

        .layer-component-sub-menu-remove-layer-container {
            .layer-component-sub-menu-remove-layer-light-button {
                font-size: $font-size-sm;

                i {
                    font-size: $font-size-sm;
                }
            }
        }

        .layer-component-sub-menu-transparency-container {
            min-height: 2.5rem;

            i {
                padding-right: .5rem;
            }

            .layer-component-sub-menu-transparency-input {
                accent-color: $secondary;
            }
        }
    }
</style>

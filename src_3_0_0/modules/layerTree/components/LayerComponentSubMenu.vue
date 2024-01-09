<script>
import {mapActions, mapGetters} from "vuex";
import LightButton from "../../../shared/modules/buttons/components/LightButton.vue";
import layerFactory from "../../../core/layers/js/layerFactory";
import SliderItem from "../../../shared/modules/slider/components/SliderItem.vue";

/**
 * Layer Component Sub Menu
 * @module modules/layerTree/components/LayerComponentSubMenu
 * @vue-prop {Object} layerConf - The current layer configuration.
 * @vue-computed {Number} transparency - Returns the transparency of the layer config.
 * @vue-computed {Number} supportedTransparency - Indicates if the layer type supports transparency settings.
 */
export default {
    name: "LayerComponentSubMenu",
    components: {
        LightButton,
        SliderItem
    },
    props: {
        /** current layer configuration */
        layerConf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(["folderById"]),
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
        ...mapActions("Modules/LayerTree", ["removeLayer", "updateTransparency"]),
        getPath(){
            let names = [];

            
                const parentId = this.layerConf.parentId;

                if(parentId !== undefined){
                    parent = this.folderById(parentId);
                    if(parent){
                        names.push(parent.name);
                        const grandParent = this.folderById(parent.parentId);

                        if(grandParent){
                            names.push(grandParent.name);
                            const grandGrandParent = this.folderById(grandParent.parentId);
                            if(grandGrandParent && grandGrandParent.parentId){
                                names.push(grandGrandParent.name);
                            }
                        }
                    }
                }

            

            names = names.reverse();
            return names.join("/");
        }
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-sub-menu-' + layerConf.id"
        class="d-flex flex-column layer-component-sub-menu"
    >
    <div>
        <span
            class="path"
        >
                {{ getPath() }}
        </span>
    </div>
        <div class="remove-layer-container">
            <LightButton
                :interaction="() => removeLayer(layerConf)"
                :text="'common:modules.layerTree.iconRemoveLayer'"
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
            <SliderItem
                :id="'layer-component-sub-menu-transparency-input-' + layerConf.id"
                :aria="$t('common:modules.aria.sliderAria') + `${transparency}%`"
                :label="`${transparency}%`"
                :value="transparency"
                :min="0"
                :max="100"
                :step="1"
                :interaction="$event => updateTransparency({layerConf, transparency: parseInt($event.target.value, 10)})"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    .path{
        font-size: smaller;
        color: gray;
    }    .layer-component-sub-menu {
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
                width: 100%;
            }
        }
    }
</style>

<script>
import draggable from "vuedraggable";
import {mapActions, mapGetters} from "vuex";

import Folder from "./FolderComponent.vue";
import Layer from "./LayerComponent.vue";
import {sortObjects} from "../../../shared/js/utils/sortObjects";

/**
 * @see {@link https://www.npmjs.com/package/vuedraggable/v/4.1.0?activeTab=versions}
 * @see {@link https://github.com/SortableJS/vue.draggable.next/issues/122}
 * Should be removed again after removing the compat mode
 */
draggable.compatConfig = {MODE: 3};

/**
 * Representation of a node in layertree containing folders or layers.
 */
export default {
    name: "LayerTreeNode",
    components: {
        Draggable: draggable,
        Folder,
        Layer
    },
    data () {
        return {
            isOpen: false
        };
    },
    computed: {
        ...mapGetters(["layerConfig"]),

        sortedLayerConfig: {
            get () {
                let sortedLayerConfig = [];

                Object.values(this.layerConfig).reverse().forEach(layerConfigValues => {
                    if (layerConfigValues.elements?.length > 0) {
                        sortedLayerConfig = sortedLayerConfig.concat(layerConfigValues.elements);
                    }
                });

                sortObjects(sortedLayerConfig, "zIndex", "desc");
                return sortedLayerConfig;
            },
            set (changedLayerConfig) {
                let configLength = changedLayerConfig.length;

                changedLayerConfig.forEach(conf => {
                    conf.zIndex = --configLength;
                    this.replaceByIdInLayerConfig(conf);
                });
            }
        }
    },
    methods: {
        ...mapActions("Modules/LayerTree", ["replaceByIdInLayerConfig"]),
        isFolder (conf) {
            return conf?.type === "folder";
        },

        isLayerShowInLayerTree (conf) {
            return conf?.type === "layer" && conf?.showInLayerTree === true;
        },

        getLayerArray (conf) {
            return conf?.elements ? conf.elements.filter(el => el.type === "layer") : [];
        },

        /**
         * Toggles a folder, changes data-property isOpen.
         * @param {Object} conf The current layer configuration.
         * @returns {void}
         */
        toggleFolder (conf) {
            if (this.isFolder(conf)) {
                this.isOpen = !this.isOpen;
            }
        }
    }
};
</script>

<template>
    <Draggable
        v-model="sortedLayerConfig"
        class="dragArea no-list"
        tag="ul"
        :group="{ name: 'g1' }"
        item-key="name"
        handle=".handle-layer-component-drag"
        chosen-class="chosen"
    >
        <template #item="{ element }">
            <li>
                <Folder
                    v-if="isFolder(element)"
                    :conf="element"
                    :is-open="isOpen"
                    @is-open="toggleFolder(element)"
                />
                <Layer
                    v-else-if="isLayerShowInLayerTree(element)"
                    :conf="element"
                />
                <Layer
                    v-for="(layer, i) in getLayerArray(element)"
                    v-else-if="getLayerArray(element).length > 0"
                    :key="'layer' + i"
                    :conf="layer"
                />
                <!-- <LayerTreeNode
                    v-if="element.elements"
                    v-show="isOpen"
                    :layer-config="element.elements"
                /> -->
            </li>
        </template>
    </Draggable>
</template>


<style lang="scss" scoped>
@import "~variables";
    .no-list{
        list-style: none;
        font-size: $font-size-base;
    }

    .folder{
        display: flex;
        gap: 0.25rem;
        align-items: baseline;
    }

    .chosen {
        color: $light_grey_contrast;
        background-color: lighten($accent_hover, 10%);
    }

</style>

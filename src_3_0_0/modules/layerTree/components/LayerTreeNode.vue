<script>
import Layer from "./LayerComponent.vue";
import Folder from "./FolderComponent.vue";
import getNestedValues from "../../../shared/js/utils/getNestedValues";

/**
 * Representation of a node in layertree containing folders or layers.
 */
export default {
    name: "LayerTreeNode",
    components: {Layer, Folder},
    /** current configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            isOpen: false,
            layers: []
        };
    },
    computed: {
        isFolder () {
            return Array.isArray(this.conf.Ordner) || Object.prototype.hasOwnProperty.call(this.conf, "Titel");
        },
        isLayerArray () {
            return Array.isArray(this.conf.Layer);
        },
        isLayer () {
            return typeof this.conf === "object" && Object.prototype.hasOwnProperty.call(this.conf, "id");
        },
        isLayerInFolderVisible () {
            return this.layers.find(layer => layer.visibility === true) !== undefined;
        }
    },
    created () {
        this.layers = getNestedValues(this.conf, "Layer", "Ordner").flat(Infinity);
    },
    methods: {
        /**
         * Toggles a folder, changes data-property isOpen.
         * @returns {void}
         */
        toggleFolder () {
            if (this.isFolder) {
                this.isOpen = !this.isOpen;
            }
        }
    }
};
</script>

<template>
    <div class="no-list">
        <li v-if="isFolder">
            <Folder
                :conf="conf"
                :is-open="isOpen"
                @is-open="toggleFolder()"
            />

            <ul v-show="isOpen">
                <div v-if="isLayerArray">
                    <Layer
                        v-for="(layer, i) in conf.Layer"
                        :key="'layer' + i"
                        :conf="layer"
                    />
                </div>
                <Layer
                    v-if="isLayer"
                    :conf="conf"
                />
                <LayerTreeNode
                    v-for="(node, i) in conf.Ordner"
                    :key="'folder'+i"
                    :conf="node"
                />
            </ul>
        </li>
        <template
            v-else
        >
            <div v-if="isLayerArray">
                <Layer
                    v-for="(layer2, i) in conf.Layer"
                    :key="'layer' + i"
                    :conf="layer2"
                />
            </div>
            <Layer
                v-if="isLayer"
                :conf="conf"
            />
        </template>
    </div>
</template>


<style lang="scss" scoped>
@import "~variables";
    .bold {
        font-weight: bold;
    }
    .no-list{
        list-style: none;
        font-size: $font-size-base;
    }
    .folder{
        display: flex;
        gap: 10px;
        align-items: baseline;
    }

</style>

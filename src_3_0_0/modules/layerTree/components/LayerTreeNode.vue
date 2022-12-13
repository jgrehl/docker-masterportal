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
            return this.conf.type === "folder";
        },
        isLayer () {
            return this.conf.type === "layer";
        },
        getLayerArray () {
            return this.conf.elements ? this.conf.elements.filter(el => el.type === "layer") : [];
        },
        isLayerInFolderVisible () {
            return this.layers.find(layer => layer.visibility === true) !== undefined;
        }
    },
    created () {
        this.layers = getNestedValues(this.conf, "elements", true).flat(Infinity);
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
                <LayerTreeNode
                    v-for="(node, i) in conf.elements"
                    :key="'folder'+i"
                    :conf="node"
                />
            </ul>
        </li>
        <template
            v-else
        >
            <Layer
                v-if="isLayer"
                :conf="conf"
            />
            <Layer
                v-for="(layer, i) in getLayerArray"
                :key="'layer' + i"
                :conf="layer"
            />
        </template>
    </div>
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

</style>

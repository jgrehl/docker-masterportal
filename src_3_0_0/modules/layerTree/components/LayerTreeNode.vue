<script>
import Layer from "./LayerComponent.vue";

/**
 * Representation of a node in layertree containing folders or layers.
 */
export default {
    name: "LayerTreeNode",
    components: {Layer},
    /** current configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            isOpen: false
        };
    },
    computed: {
        isFolder () {
            return Array.isArray(this.conf.Ordner);
        },
        isLayerArray () {
            return Array.isArray(this.conf.Layer);
        },
        isLayer () {
            return typeof this.conf === "object" && Object.hasOwn(this.conf, "id");
        }
    },
    methods: {
        /**
         * Replaces the value of current layerConf's visibility in state's layerConfig
         * @param {Boolean} value visible or not
         * @returns {void}
         */
        toggle () {
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
            <div
                :class="{ bold: isFolder, 'folder': true }"
                @click="toggle"
            >
                <i
                    :class="['fs-4', isOpen ? 'bi bi-folder2-open' : 'bi bi-folder2']"
                    role="img"
                />
                <h5>{{ conf.Titel }}</h5>
            </div>
            <ul v-show="isOpen">
                <!--
                    A component can recursively render itself using its
                    "name" option (inferred from filename if using SFC)
                -->
                <LayerTreeNode
                    v-for="(node, i) in conf.Ordner"
                    :key="i"
                    :conf="node"
                />
            </ul>
        </li>
        <div v-if="isLayerArray">
            <Layer
                v-for="(layer, i) in conf.Layer"
                :key="i"
                :layer-conf="layer"
            />
        </div>
        <Layer
            v-if="isLayer"
            :layer-conf="conf"
        />
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

<script>
import {mapMutations} from "vuex";
import getNestedValues from "../../../shared/js/utils/getNestedValues";
import {uniqueId} from "../../../shared/js/utils/uniqueId.js";

/**
 * Representation of a folder in layerTree.
 */
export default {
    name: "FolderComponent",
    /** current folder configuration */
    props: {
        conf: {
            type: Object,
            required: true
        },
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ["isOpen"],
    data () {
        return {
            layers: []
        };
    },
    computed: {
        allLayersVisible: {
            get () {
                return this.layers.filter(layer => layer.visibility === true).length === this.layers.length;
            },
            set () {
                // v-model: setter must be here, but does nothing - setting is handeled by click-event
            }
        },
        isLayerInFolderVisible () {
            return this.layers.find(layer => layer.visibility === true) !== undefined;
        },
        folderId () {
            return uniqueId(this.conf.Titel.replace(/[^a-zA-Z0-9]/g, ""));
        }
    },
    created () {
        this.layers = getNestedValues(this.conf, "Layer", "Ordner").flat(Infinity);
    },
    methods: {
        ...mapMutations(["replaceByIdInLayerConfig"]),
        /**
         * Toggles a folder, changes data-property isOpen.
         * @returns {void}
         */
        toggleFolder () {
            this.$emit("isOpen");
        },
        /**
         * Replaces the value of current layerConf's visibility in state's layerConfig
         * @param {Boolean} value visible or not
         * @returns {void}
         */
        visibilityInLayerTreeChanged (value) {
            const layers = getNestedValues(this.conf, "Layer", "Ordner").flat(Infinity),
                layerConfigs = [];

            layers.forEach(layer => {
                layerConfigs.push(
                    {
                        id: layer.id,
                        layer: {
                            id: layer.id,
                            visibility: value
                        }
                    }
                );
            });
            this.replaceByIdInLayerConfig({layerConfigs});
        }
    }
};
</script>

<template lang="html">
    <div
        class="folder"
    >
        <input
            v-if="(layers.length > 1)"
            :id="('layer-tree-folder-checkbox-' + folderId)"
            v-model="allLayersVisible"
            type="checkbox"
            class="form-check-input"
            @click="visibilityInLayerTreeChanged($event.target.checked)"
            @keydown="visibilityInLayerTreeChanged($event.target.checked)"
        >
        <label
            class="d-none"
            :for="('layer-tree-folder-checkbox-' + folderId)"
        >
            {{ $t("common:tree.selectAll") }}
        </label>
        <div
            :class="{ bold: isLayerInFolderVisible}"
            @click="toggleFolder"
            @keydown="toggleFolder"
        >
            <i
                :class="['fs-4', isOpen ? 'bi bi-folder2-open' : 'bi bi-folder2']"
                role="img"
            />
            {{ conf.Titel }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .folder{
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }
</style>

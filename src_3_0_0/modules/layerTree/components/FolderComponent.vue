<script>
import {mapGetters, mapMutations} from "vuex";
import getNestedValues from "../../../shared/js/utils/getNestedValues";

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
    data () {
        return {
            layers: []
        };
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),
        checkboxValue: {
            get () {
                return this.allLayersVisible;
            },
            set () {
                // v-model: setter must be here, but does nothing - setting is handeled by click-event
            }
        },
        isLayerVisible () {
            return typeof this.conf.visibility === "boolean" ? this.conf.visibility : false;
        },
        allLayersVisible () {
            return this.layers.filter(layer => layer.visibility === true).length === this.layers.length;
        },
        isLayerInFolderVisible () {
            return this.layers.find(layer => layer.visibility === true) !== undefined;
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
        <input
            v-if="(layers.length > 1)"
            :id="('layertree-folder-checkbox' + conf.Titel)"
            v-model="checkboxValue"
            type="checkbox"
            class="form-check-input"
            @click="visibilityInLayerTreeChanged($event.target.checked)"
            @keydown="visibilityInLayerTreeChanged($event.target.checked)"
        >
        <label
            v-if="(layers.length > 1)"
            :class="['mt-0 d-flex flex-column', isLayerVisible ? 'bold' : '']"
            :for="('layertree-layer-checkbox' + conf.Titel)"
        >
            {{ $t("common:tree.selectAll") }}
        </label>
    </div>
</template>

<style lang="scss" scoped>
    .bold {
        font-weight: bold;
    }
    .folder{
        display: flex;
        gap: 10px;
        align-items: center;
    }
</style>

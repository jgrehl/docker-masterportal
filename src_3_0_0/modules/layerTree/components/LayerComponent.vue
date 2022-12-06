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
        :id="'layertree-layer-' + conf.id"
        class="form-check"
    >
        <input
            :id="'layertree-layer-checkbox-' + conf.id"
            v-model="checkboxValue"
            type="checkbox"
            class="form-check-input"
            @click="visibilityInLayerTreeChanged(!isLayerVisible)"
        >
        <label
            :class="['mt-0 d-flex flex-column align-self-start', isLayerVisible ? 'bold' : '']"
            :for="'layertree-layer-checkbox-' + conf.id"
        >
            {{ conf.name }}
        </label>
    </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import {mapGetters, mapMutations} from "vuex";
import {getLayerTypes3d} from "../../../core/layers/js/layerFactory";

/**
 * Representation of a layer in layerTree.
 */
export default {
    name: "LayerComponent",
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),
        checkboxValue: {
            get () {
                return this.isLayerVisible();
            },
            set () {
                // v-model: setter must be here, but does nothing - setting is handeled by click-event
            }
        }
    },
    methods: {
        ...mapMutations(["replaceByIdInLayerConfig"]),
        /**
         * Replaces the value of current layerConf's visibility in state's layerConfig
         * @param {Boolean} value visible or not
         * @returns {void}
         */
        visibilityInLayerTreeChanged (value) {
            this.replaceByIdInLayerConfig(
                {
                    layerConfigs: [{
                        id: this.layerConf.id,
                        layer: {
                            id: this.layerConf.id,
                            visibility: value
                        }
                    }]
                }
            );
        },
        /**
         * Returns the value of layerConf's attribute visibility
         * @returns {Boolean} the value of layerConf's attribute visibility
         */
        isLayerVisible () {
            return typeof this.layerConf.visibility === "boolean" ? this.layerConf.visibility : false;
        },

        /**
     * Returns true, if layer configuration shall be shown in tree in current map mode.
     * Filteres by attribute 'showInLayerTree'.
     * @returns {boolean} true, if layer configuration shall be shown in tree
     */
        showInLayerTree () {
            const layerTypes3d = getLayerTypes3d();

            return this.layerConf.showInLayerTree !== false && (this.mode === "2D" ? !layerTypes3d.includes(this.layerConf.typ.toUpperCase()) : true);
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="showInLayerTree()"
        :id="'layertree-layer-' + layerConf.id"
        class="form-check"
    >
        <input
            :id="'layertree-layer-checkbox' + layerConf.id"
            v-model="checkboxValue"
            type="checkbox"
            class="form-check-input"
            @click="visibilityInLayerTreeChanged(!isLayerVisible())"
        >
        <label
            :class="['mt-0 d-flex flex-column align-self-start', isLayerVisible() ? 'bold' : '']"
            :for="'layertree-layer-checkbox' + layerConf.id"
        >
            <h5>{{ layerConf.name }}</h5>
        </label>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    .bold {
        font-weight: bold;
    }

    h5 {
        font-size: $font-size-base;
    }

</style>

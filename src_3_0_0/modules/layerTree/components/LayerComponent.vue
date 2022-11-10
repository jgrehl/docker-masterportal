<script>
import {mapMutations} from "vuex";

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
        }
    }
};
</script>

<template lang="html">
    <div
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

</style>

<script>
import {mapGetters, mapMutations} from "vuex";

/**
 * Representation of a layer in layerTree.
 */
export default {
    name: "LayerCheckBox",
    components: {

    },
    /** current layer configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),

        /**
         * Returns the value of layerConf's attribute visibility
         * @returns {Boolean} the value of layerConf's attribute visibility
         */
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
        }
    }
};
</script>

<template lang="html">
    <div>
        <input
            :id="'layer-tree-layer-checkbox-' + conf.id"
            :checked="isLayerVisible"
            type="checkbox"
            class="layer-tree-layer-checkbox form-check-input"
            @click="visibilityInLayerTreeChanged(!isLayerVisible)"
            @keydown.enter="visibilityInLayerTreeChanged(!isLayerVisible)"
        >
        <label
            :class="['layer-tree-layer-label', 'mt-0 d-flex flex-column align-self-start', isLayerVisible ? 'bold' : '']"
            :for="'layer-tree-layer-checkbox-' + conf.id"
            tabindex="0"
            :aria-label="$t(conf.name)"
            @keydown.enter="visibilityInLayerTreeChanged(!isLayerVisible)"
        >
            <span
                v-if="conf.shortname"
                class="shortname"
            >
                {{ conf.shortname }}
            </span>
            <span v-else>
                {{ conf.name }}
            </span>
        </label>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";


        .layer-tree-layer-title, .layer-tree-layer-checkbox {
            &:hover {
                @include primary_action_hover;
            }
            &:focus {
                @include primary_action_focus;
            }
        }

        .layer-tree-layer-label {
            cursor: pointer;
        }
        .shortname {
        font-size: $font-size-sm;
    }

</style>

<script>
import {mapGetters} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
import LayerComponentIconDrag from "./LayerComponentIconDrag.vue";
import LayerCheckBox from "./LayerCheckBox.vue";
import LayerComponentIconInfo from "./LayerComponentIconInfo.vue";
import LayerComponentIconSubMenu from "./LayerComponentIconSubMenu.vue";
import LayerComponentSubMenu from "./LayerComponentSubMenu.vue";

/**
 * Representation of a layer in layerTree.
 */
export default {
    name: "LayerComponent",
    components: {
        LayerComponentIconDrag,
        LayerCheckBox,
        LayerComponentIconInfo,
        LayerComponentIconSubMenu,
        LayerComponentSubMenu
    },
    /** current layer configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Maps", ["mode"])
    },
    methods: {
        /**
         * Returns true, if layer configuration shall be shown in tree in current map mode.
         * Filteres by attribute 'showInLayerTree'.
         * @returns {boolean} true, if layer configuration shall be shown in tree
         */
        show () {
            const showLayerTyp = this.mode === "2D" ? !layerFactory.getLayerTypes3d().includes(this.conf.typ?.toUpperCase()) : true;

            if (this.isLayerTree()) {
                return this.conf.showInLayerTree === true && showLayerTyp;
            }
            return showLayerTyp;
        },
        /**
         * Returns true, if this parent is a 'LayerTreeNode' in layer-tree and false if parent is 'LayerSelectionTreeNode' in layer-selection.
         * @returns {Boolean} true, if this parent is a 'LayerTreeNode' in layer-tree
         */
        isLayerTree () {
            return this.$parent.$options.name !== "LayerSelectionTreeNode";
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="show()"
        :id="'layer-tree-layer-' + conf.id"
        class="layer-tree-layer d-flex flex-column justify-content-between"
    >
        <div class="d-flex justify-content-between align-items-center">
            <LayerCheckBox
                :conf="conf"
                :is-layer-tree="isLayerTree()"
            />
            <div
                v-if="isLayerTree()"
                class="d-flex"
            >
                <LayerComponentIconSubMenu :layer-conf="conf" />
                <LayerComponentIconInfo :layer-conf="conf" />
                <LayerComponentIconDrag :layer-conf="conf" />
            </div>
        </div>
        <div
            v-if="isLayerTree()"
            :id="'collapse-sub-menu-' + conf.id"
            class="collapse"
        >
            <LayerComponentSubMenu :layer-conf="conf" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-tree-layer {
        font-size: $font-size-base;

        .layer-tree-layer-title {
            display: flex;
            width: 100%;
            border-radius: 10px;
        }

        .layer-tree-layer-title {
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
    }
</style>

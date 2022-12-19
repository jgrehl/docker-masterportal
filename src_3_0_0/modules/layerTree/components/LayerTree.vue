<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import LayerTreeNode from "./LayerTreeNode.vue";
import ElevatedButton from "../../../shared/modules/buttons/components/ElevatedButton.vue";

/**
 * Module to display the layers in menu.
 */
export default {
    name: "LayerTree",
    components: {
        ElevatedButton,
        LayerTreeNode
    },
    data: () => {
        return {
            layerSelectionVisible: false
        };
    },
    computed: {
        ...mapGetters(["layerConfig", "portalConfig", "allLayerConfigsStructured", "layerConfigsByArributes"]),
        ...mapGetters("Menu", ["moduleIndex"]),
        ...mapGetters("Menu/Navigation", ["entries", "isModuleActiveInMenu"]),
        ...mapGetters("Modules/LayerTree", ["active", "menuSide", "type"]),
        treeType () {
            return this.portalConfig?.tree?.type ? this.portalConfig?.tree?.type : "light";
        },
        confs () {
            if (this.treeType === "auto") {
                return this.layerConfigsByArributes({showInLayerTree: true});
            }
            return this.allLayerConfigsStructured;
        }
    },
    watch: {
        entries: {
            handler () {
                if (this.isModuleActiveInMenu(this.menuSide, "LayerSelection")) {
                    this.layerSelectionVisible = true;
                }
                else if (this.layerSelectionVisible) {
                    this.layerSelectionVisible = false;
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapMutations("Modules/LayerSelection", {setLayerSelectionActive: "setActive"}),
        ...mapActions("Menu", ["setMenuBackAndActivateItem"]),
        /**
         * Toggles a folder, changes data-property isOpen.
         * @returns {void}
         */
        addLayerToLayerTree () {
            const menuItem = {
                side: this.menuSide,
                module: {type: "LayerSelection"}
            };

            this.setLayerSelectionActive(true);
            this.setMenuBackAndActivateItem(menuItem);
        }
    }
};
</script>

<template lang="html">
    <hr>
    <div
        v-if="!layerSelectionVisible"
        id="layer-tree"
        class="layer-tree"
    >
        <template
            v-for="(conf, index) in confs"
            :key="index"
        >
            <LayerTreeNode
                :id="conf.id"
                :conf="conf"
            />
        </template>
        <div class="mt-4 d-flex justify-content-center">
            <ElevatedButton
                id="add-layer-btn"
                aria-label="$t('common:tree.addLayer')"
                :interaction="addLayerToLayerTree"
                :text="$t('common:tree.addLayer')"
                :icon="'bi-plus-circle'"
            />
        </div>
    </div>
    <hr>
</template>

<style lang="scss" scoped>
@import "~variables";
    .layer-tree{
        padding-left: $padding;
        font-size: $font-size-base;
        overflow-y: auto;
        max-height: 350px;
    }

    @include media-breakpoint-up(sm)  {
        .layer-tree{
            max-width: 400px;
        }
    }
</style>

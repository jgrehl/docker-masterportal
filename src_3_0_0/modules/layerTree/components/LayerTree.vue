<script>
import {mapActions, mapGetters} from "vuex";
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
        ...mapGetters(["portalConfig"]),
        ...mapGetters("Menu/Navigation", ["entries", "isModuleActiveInMenu"]),
        ...mapGetters("Modules/LayerTree", ["active", "menuSide", "type"]),
        treeType () {
            return this.portalConfig?.tree?.type ? this.portalConfig?.tree?.type : "light";
        },
        addLayerButton () {
            return this.portalConfig?.tree?.addLayerButton ? this.portalConfig?.tree?.addLayerButton : this.treeType === "auto";
        }
    },
    watch: {
        // @ todo remove if menu is new refactored
        entries: {
            handler () {
                if (this.isModuleActiveInMenu(this.menuSide, "layerSelection")) {
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
        ...mapActions("Menu", ["setMenuBackAndActivateItem"]),
        /**
         * Toggles a folder, changes data-property isOpen.
         * @returns {void}
         */
        showLayerSelection () {
            // @ todo remove if menu is new refactored
            const menuItem = {
                side: this.menuSide,
                module: {type: "layerSelection"}
            };

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
        <LayerTreeNode />
        <div
            v-if="addLayerButton"
            class="mt-4 d-flex justify-content-center sticky"
        >
            <ElevatedButton
                id="add-layer-btn"
                aria-label="$t('common:tree.addLayer')"
                :interaction="showLayerSelection"
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
    .sticky{
        position : sticky;
        bottom:0;
    }


    @include media-breakpoint-up(sm)  {
        .layer-tree{
            max-width: 400px;
        }
    }
</style>

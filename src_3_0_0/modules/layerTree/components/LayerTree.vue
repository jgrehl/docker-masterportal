<script>
import {mapMutations, mapGetters} from "vuex";
import LayerTreeNode from "./LayerTreeNode.vue";
import {treeSubjectsKey} from "../../../shared/js/utils/constants";
import sortBy from "../../../shared/js/utils/sortBy";
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
    computed: {
        ...mapGetters(["portalConfig", "allLayerConfigsStructured"]),
        ...mapGetters("Modules/LayerTree", ["menuSide"]),
        ...mapGetters("Modules/LayerSelection", {layerSelectionType: "type", layerSelectionName: "name"}),
        treeType () {
            return this.portalConfig?.tree?.type ? this.portalConfig?.tree?.type : "light";
        },
        addLayerButton () {
            return this.portalConfig?.tree?.addLayerButton ? this.portalConfig?.tree?.addLayerButton : this.treeType === "auto";
        }
    },
    methods: {
        ...mapMutations("Menu", ["setCurrentComponent"]),
        ...mapMutations("Modules/LayerSelection", {setLayerSelectionActive: "setActive", setSubjectDataLayerConfs: "setSubjectDataLayerConfs"}),
        /**
         * Sorts the configs by type: first folder, then layer.
         * @param {Array} configs list of layer and folder configs
         * @returns {Array} the sorted configs
         */
        sort (configs) {
            return sortBy(configs, (conf) => conf.type !== "folder");
        },
        /**
         * Shows the component LayerSelection and sets it active.
         * @returns {void}
         */
        showLayerSelection () {
            const confs = this.sort(this.allLayerConfigsStructured(treeSubjectsKey));

            this.setCurrentComponent({type: this.layerSelectionType, side: this.menuSide, props: {name: this.layerSelectionName}});
            this.setSubjectDataLayerConfs(confs);
            this.setLayerSelectionActive(true);
        }
    }
};
</script>

<template lang="html">
    <hr>
    <div
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

    .sticky{
        position : sticky;
        bottom:0;
    }

</style>

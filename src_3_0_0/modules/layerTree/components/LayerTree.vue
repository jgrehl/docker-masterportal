<script>
import {mapActions, mapMutations, mapGetters} from "vuex";
import LayerTreeNode from "./LayerTreeNode.vue";
import {treeBackgroundsKey, treeSubjectsKey} from "../../../shared/js/utils/constants";
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
        ...mapActions("Modules/LayerSelection", ["navigateForward"]),
        ...mapActions("Menu", ["changeCurrentComponent"]),
        ...mapMutations("Modules/LayerSelection", {setLayerSelectionVisible: "setVisible"}),
        /**
         * Sorts the configs by type: first folder, then layer.
         * @param {Array} configs list of layer and folder configs
         * @returns {Array} the sorted configs
         */
        sort (configs) {
            return sortBy(configs, (conf) => conf.type !== "folder");
        },
        /**
         * Shows the component LayerSelection and sets it visible.
         * @returns {void}
         */
        showLayerSelection () {
            const subjectDataLayerConfs = this.sort(this.allLayerConfigsStructured(treeSubjectsKey)),
                allBackgroundLayerConfs = this.allLayerConfigsStructured(treeBackgroundsKey),
                backgroundLayerConfs = allBackgroundLayerConfs.filter(config => !config.showInLayerTree);

            this.changeCurrentComponent({type: this.layerSelectionType, side: this.menuSide, props: {name: this.layerSelectionName}});
            this.navigateForward({lastFolderName: "root", subjectDataLayerConfs, backgroundLayerConfs});
            this.setLayerSelectionVisible(true);
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

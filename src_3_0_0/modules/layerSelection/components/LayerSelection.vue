<script>
import {mapGetters, mapActions} from "vuex";
import sortBy from "../../../shared/js/utils/sortBy";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";
import LayerCheckBox from "../../layerTree/components/LayerCheckBox.vue";
import LayerSelectionTreeNode from "./LayerSelectionTreeNode.vue";


export default {
    name: "LayerSelection",
    components: {
        FlatButton,
        LayerCheckBox,
        LayerSelectionTreeNode
    },
    computed: {
        ...mapGetters("Modules/LayerSelection", ["visible", "subjectDataLayerConfs", "backgroundLayerConfs", "layersToAdd", "type", "menuSide", "lastFolderNames"]),
        lastFolderName () {
            return this.lastFolderNames[this.lastFolderNames.length - 1];
        }

    },
    unmounted () {
        this.reset();
    },
    methods: {
        ...mapActions("Modules/LayerSelection", ["updateLayerTree", "navigateBack", "navigateForward", "reset"]),

        /**
         * Sorts the configs by type: first folder, then layer.
         * @param {Array} configs list of layer and folder configs
         * @returns {Array} the sorted configs
         */
        sort (configs) {
            return sortBy(configs, (conf) => conf.type !== "folder");
        },
        /**
         * Navigates forward after folder was clicked.
         * @param {String} lastFolderName name to show in menu to navigate back to
         * @param {Array} subjectDataLayerConfs configs to show
         * @returns {void}
         */
        folderClicked (lastFolderName, subjectDataLayerConfs) {
            this.navigateForward({lastFolderName, subjectDataLayerConfs: this.sort(subjectDataLayerConfs)});
        }
    }
};
</script>

<template>
    <div
        v-if="visible"
        :id="'layer-selection'"
        class="layer-selection"
        aria-label=""
    >
        <div class="row align-items-center justify-content-center">
            <a
                v-if="lastFolderName !== 'root'"
                id="layer-selection-navigation"
                class="p-2 mp-menu-navigation"
                href="#"
                @click="navigateBack()"
                @keypress="navigateBack()"
            >
                <h6 class="mp-menu-navigation-link mb-3"><p class="bi-chevron-left" />{{ lastFolderName }}</h6>
            </a>
            <h6 v-if="backgroundLayerConfs.length > 0">
                {{ $t("common:tree.backgrounds") }}
            </h6>
            <template
                v-for="(bgConf, index) in backgroundLayerConfs"
                :key="index"
            >
                <div class="col">
                    <LayerCheckBox
                        :conf="bgConf"
                        :is-layer-tree="false"
                    />
                </div>
            </template>
            <hr
                v-if="backgroundLayerConfs.length > 0"
                class="m-2"
            >
            <template
                v-for="(conf, index) in subjectDataLayerConfs"
                :key="index"
            >
                <LayerSelectionTreeNode
                    :conf="conf"
                    @show-node="folderClicked"
                />
            </template>
        </div>
        <div class="mt-3">
            <span>{{ $t("tree.selectedSubjectsCount", {count: layersToAdd.length}) }}</span>
            <FlatButton
                id="layer-selection-add-layer-btn"
                class="mt-2  w-100"
                aria-label="$t('tree.addSelectedSubjectsToMap')"
                :disabled="layersToAdd.length === 0"
                :interaction="updateLayerTree"
                :text="$t('tree.addSelectedSubjectsToMap')"
                :icon="'bi-plus-circle'"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.layer-selection {
    width: 100%;
    background-color: $menu-background-color;
    left: 0px;
    top: 16%;
    position: absolute;
    padding: $padding;
}
.mp-menu-navigation{
    color: $black;
    display: flex;
}

.mp-menu-navigation-link{
    display: flex;
}
</style>

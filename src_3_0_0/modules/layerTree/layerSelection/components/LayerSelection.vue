<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import sortBy from "../../../../shared/js/utils/sortBy";
import FlatButton from "../../../../shared/modules/buttons/components/FlatButton.vue";
import LayerCheckBox from "../../components/LayerCheckBox.vue";
import LayerSelectionTreeNode from "./LayerSelectionTreeNode.vue";


export default {
    name: "LayerSelection",
    components: {
        FlatButton,
        LayerCheckBox,
        LayerSelectionTreeNode
    },
    computed: {
        ...mapGetters("Modules/LayerSelection", ["active", "subjectDataLayerConfs", "backgroundLayerConfs", "layersToAdd", "type", "menuSide", "lastConfName"])

    },
    unmounted () {
        this.reset();
    },
    methods: {
        ...mapActions("Modules/LayerSelection", ["updateLayerTree", "navigateBack", "navigateForward", "reset"]),
        ...mapMutations("Menu", ["setCurrentComponent"]),
        /**
         * Sorts the configs by type: first folder, then layer.
         * @param {Array} configs list of layer and folder configs
         * @returns {Array} the sorted configs
         */
        sort (configs) {
            return sortBy(configs, (conf) => conf.type !== "folder");
        },
        /**
         * Sets new subject data configs and sets showBGLayers to false after folder was clicked.
         * @param {String} lastConfName name to show in menu to navigate back to
         * @param {Array} newConf configs to show
         * @returns {void}
         */
        folderClicked (lastConfName, newConf) {
            const subjectDataLayerConfs = this.sort(newConf);

            this.navigateForward({lastConfName, subjectDataLayerConfs});
        }
    }
};
</script>

<template>
    <div
        v-if="active"
        :id="'layer-selection'"
        class="layer-selection"
        aria-label=""
    >
        <div class="row align-items-center justify-content-center">
            <a
                v-if="lastConfName"
                :id="'layer-selection-navigation-'"
                class="p-2 mp-menu-navigation"
                href="#"
                @click="navigateBack()"
                @keypress="navigateBack()"
            >
                <h6 class="mp-menu-navigation-link mb-3"><p class="bi-chevron-left" />{{ lastConfName }}</h6>
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

.mp-menu-navigation-moduletitle{
    display: flex;
}
</style>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
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
    data () {
        return {
            selectAllConfId: -1,
            selectAllConfigs: []
        };
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),
        ...mapGetters("Modules/LayerSelection", ["visible", "subjectDataLayerConfs", "backgroundLayerConfs", "layersToAdd", "lastFolderNames", "layerInfoVisible"]),
        lastFolderName () {
            return this.lastFolderNames[this.lastFolderNames.length - 1];
        }
    },
    unmounted () {
        if (!this.layerInfoVisible) {
            this.reset();
        }
    },
    created () {
        this.provideSelectAllProps();
        this.setLayerInfoVisible(false);
    },
    methods: {
        ...mapActions("Modules/LayerSelection", ["updateLayerTree", "navigateBack", "navigateForward", "reset"]),
        ...mapMutations("Modules/LayerSelection", ["setLayerInfoVisible"]),

        /**
         * Sorts the configs by type: first folder, then layer.
         * @param {Array} configs list of layer and folder configs
         * @returns {Array} the sorted configs
         */
        sort (configs) {
            return sortBy(configs, (conf) => conf.type !== "folder");
        },
        /**
         * Navigates forwards or backwards after folder or navigation-entry was clicked.
         * @param {String} direction 'back' or 'forward'
         * @param {String} lastFolderName name to show in menu to navigate back to
         * @param {Array} subjectDataLayerConfs configs to show
         * @returns {void}
         */
        navigate (direction, lastFolderName, subjectDataLayerConfs) {
            if (direction === "forward") {
                this.navigateForward({lastFolderName, subjectDataLayerConfs: this.sort(subjectDataLayerConfs)});
            }
            else if (direction === "back") {
                this.navigateBack();
            }
            this.$nextTick(() => {
                this.selectAllConfId = -1;
                this.selectAllConfigs = [];
                this.provideSelectAllProps();
            });
        },
        /**
         * Listener for click on folder.
         * @param {String} lastFolderName name to show in menu to navigate back to
         * @param {Array} subjectDataLayerConfs configs to show
         * @returns {void}
         */
        folderClicked (lastFolderName, subjectDataLayerConfs) {
            this.navigate("forward", lastFolderName, subjectDataLayerConfs);
        },
        /**
         * Returns true, if configuration shall be controlled by SelectAllCheckBox.
         * @param {Object} conf layer or folder configuration
         * @returns {Boolean} true, if configuration shall be controlled by SelectAllCheckBox
         */
        isControlledBySelectAll (conf) {
            return conf.type === "layer" && conf.showInLayerTree === false && (this.mode === "2D" ? !layerFactory.getLayerTypes3d().includes(conf.typ?.toUpperCase()) : true);
        },
        /**
         * Provides data for SelectAllCheckBox props.
         * @returns {void}
         */
        provideSelectAllProps () {
            this.subjectDataLayerConfs.forEach(conf => {
                if (this.isControlledBySelectAll(conf) && this.selectAllConfId === -1) {
                    this.selectAllConfigs = this.subjectDataLayerConfs.filter(config => this.isControlledBySelectAll(config));
                    this.selectAllConfId = conf.id;
                }
            });
        }
    }
};
</script>

<template>
    <div
        v-if="visible"
        :id="'layer-selection'"
        class="w-100 layer-selection"
        aria-label=""
    >
        <div class="row align-items-center justify-content-center">
            <a
                v-if="lastFolderName !== 'root'"
                id="layer-selection-navigation"
                class="p-2 mp-menu-navigation"
                href="#"
                @click="navigate('back')"
                @keypress="navigate('back')"
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
                    :show-select-all-check-box="selectAllConfId === conf.id"
                    :select-all-configs="selectAllConfigs"
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

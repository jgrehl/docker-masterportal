<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
import sortBy from "../../../shared/js/utils/sortBy";
import escapeId from "../../../shared/js/utils/escapeId";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";
import LayerCheckBox from "../../layerTree/components/LayerCheckBox.vue";
import LayerSelectionTreeNode from "./LayerSelectionTreeNode.vue";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Layer Selection
 * @module modules/LayerSelection
 * @vue-data {Number} selectAllConfId - The layer id for the select all checkbox.
 * @vue-data {Array} selectAllConfigs - The layer configurations for select all checkbox.
 */
export default {
    name: "LayerSelection",
    components: {
        FlatButton,
        LayerCheckBox,
        LayerSelectionTreeNode,
        IconButton
    },
    data () {
        return {
            selectAllConfId: -1,
            selectAllConfigs: []
        };
    },
    computed: {
        ...mapGetters("Maps", ["mode"]),
        ...mapGetters(["activeOrFirstCategory", "allCategories", "invisibleBaselayerConfigs", "portalConfig"]),
        ...mapGetters("Modules/LayerSelection", ["visible", "subjectDataLayerConfs", "baselayerConfs", "layersToAdd", "lastFolderNames", "layerInfoVisible", "highlightLayerId"]),
        lastFolderName () {
            return this.lastFolderNames[this.lastFolderNames.length - 1];
        },
        categorySwitcher () {
            return this.portalConfig?.tree?.categories;
        }
    },
    watch: {
        invisibleBaselayerConfigs: {
            handler (newVal) {
                this.setBaselayerConfs(newVal);
            },
            deep: true
        }
    },
    mounted () {
        if (this.highlightLayerId) {
            const el = document.querySelector("#layer-checkbox-" + escapeId(this.highlightLayerId));

            if (el) {
                el.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
            }
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
        ...mapActions(["changeCategory"]),
        ...mapActions("Modules/LayerSelection", ["updateLayerTree", "navigateBack", "navigateForward", "reset"]),
        ...mapMutations("Modules/LayerSelection", ["setLayerInfoVisible", "setBaselayerConfs"]),

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
        },
        categorySelected (value) {
            if (typeof value === "string") {
                const category = this.allCategories.find(aCategory => aCategory.key === value);

                this.allCategories.forEach(aCategory => {
                    aCategory.active = false;
                });
                category.active = true;
                this.changeCategory(category);
            }
        },
        filterBaseLayer () {
            if (this.mode === "3D") {
                return this.baselayerConfs.filter(conf => !layerFactory.getLayerTypesNotVisibleIn3d().includes(conf.typ?.toUpperCase()));
            }
            return this.baselayerConfs;
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
        <div
            v-if="categorySwitcher"
            id="accordionFlushCategorySettings"
            class="accordion accordion-flush"
        >
            <div class="accordion-item my-2">
                <IconButton
                    :aria="$t('common:modules.layerTree.openCategories')"
                    :icon="'bi-gear-fill'"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                />
                <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                >
                    <div class="accordion-body">
                        <div
                            v-if="activeOrFirstCategory"
                            class="form-floating mb-3"
                        >
                            <select
                                id="select_category"
                                :value="activeOrFirstCategory.key"
                                class="form-select"
                                @change.prevent="categorySelected($event.target.value)"
                            >
                                <option
                                    v-for="category in allCategories"
                                    :key="category.key"
                                    :value="category.key"
                                >
                                    {{ $t(category.name) }}
                                </option>
                            </select>
                            <label for="select_category">
                                {{ $t("common:modules.layerTree.categories") }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layer-selection-navigation">
            <h6 v-if="filterBaseLayer().length > 0">
                {{ $t("common:modules.layerSelection.backgrounds") }}
            </h6>
            <div class="d-flex justify-content-start layer-selection-navigation-baselayer">
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
                <template
                    v-for="(bgConf, index) in filterBaseLayer()"
                    :key="index"
                >
                    <div class="col baselayer">
                        <LayerCheckBox
                            :conf="bgConf"
                            :is-layer-tree="false"
                        />
                    </div>
                </template>
            </div>
            <hr
                v-if="baselayerConfs.length > 0"
                class="m-2"
            >
            <div class="align-items-left justify-content-center layer-selection-navigation-dataLayer">
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
        </div>
        <div class="d-flex justify-content-center sticky layer-selection-add-layer-btn">
            <FlatButton
                id="layer-selection-add-layer-btn"
                aria-label="$t('common:modules.layerSelection.addSelectedSubjectsToMap', {count: layersToAdd.length})"
                :disabled="layersToAdd.length === 0"
                :interaction="updateLayerTree"
                :text="layersToAdd.length === 0 ? $t('common:modules.layerSelection.selectedSubjectsCount', {count: layersToAdd.length}) : $t('common:modules.layerSelection.addSelectedSubjectsToMap', {count: layersToAdd.length})"
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
    top: 120px;
    position: absolute;
    padding: $padding;
    height: calc(100% - 50px);
    padding-top: 0;
}
.layer-selection-navigation {
    height: 90%;
}

.layer-selection-navigation-baselayer {
    overflow-x: scroll;
}
.layer-selection-navigation-dataLayer {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: calc(100% - 100px);
}
.layer-selection-add-layer-btn {
    position: sticky;
    bottom: 0px;
}
.mp-menu-navigation{
    color: $black;
    display: flex;
}
.mp-menu-navigation-link{
    display: flex;
}

@include media-breakpoint-up(sm)  {
    .layer-selection-navigation-baselayer {
        overflow-x: auto;
    }
}
.baselayer {
    min-width: 35%;
}
</style>

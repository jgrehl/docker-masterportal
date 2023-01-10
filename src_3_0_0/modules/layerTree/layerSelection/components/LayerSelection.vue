<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import sortBy from "../../../../shared/js/utils/sortBy";
import FlatButton from "../../../../shared/modules/buttons/components/FlatButton.vue";
import {treeBackgroundsKey} from "../../../../shared/js/utils/constants";
import LayerCheckBox from "../../components/LayerCheckBox.vue";
import LayerSelectionTreeNode from "./LayerSelectionTreeNode.vue";


export default {
    name: "LayerSelection",
    components: {
        FlatButton,
        LayerCheckBox,
        LayerSelectionTreeNode
    },
    data: () => {
        return {
            showBGLayers: true
        };
    },
    computed: {
        ...mapGetters(["allLayerConfigsStructured"]),
        ...mapGetters("Modules/LayerSelection", ["active", "subjectDataLayerConfs", "layersToAdd", "type", "menuSide"]),
        allBackgroundLayers () {
            return this.allLayerConfigsStructured(treeBackgroundsKey);
        }

    },
    methods: {
        ...mapActions("Modules/LayerSelection", ["updateLayerTree"]),
        ...mapMutations("Modules/LayerSelection", ["setSubjectDataLayerConfs"]),
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
         * Sets new subject data configs and sets showBGLayers to false.
         * @param {String} lastConfName name to show in menu to navigate back to
         * @param {Array} newConf configs to show
         * @returns {void}
         */
        setConf (lastConfName, newConf) {
            this.showBGLayers = false;
            this.setCurrentComponent({type: this.type, side: this.menuSide, props: {name: lastConfName}});
            this.setSubjectDataLayerConfs(this.sort(newConf));
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
        <h2>{{ $t("common:tree.addSubject") }}</h2>
        <h6 v-if="showBGLayers">
            {{ $t("common:tree.backgrounds") }}
        </h6>
        <div class="row align-items-center justify-content-center">
            <template v-if="showBGLayers">
                <template
                    v-for="(bgConf, index) in allBackgroundLayers"
                    :key="index"
                >
                    <div class="col">
                        <LayerCheckBox
                            :conf="bgConf"
                            :is-layer-tree="false"
                        />
                    </div>
                </template>
            </template>
            <hr class="m-2">
            <template
                v-for="(conf, index) in subjectDataLayerConfs"
                :key="index"
            >
                <LayerSelectionTreeNode
                    :conf="conf"
                    @show-node="setConf"
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
</style>

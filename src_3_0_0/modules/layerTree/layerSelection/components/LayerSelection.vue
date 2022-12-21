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
    data: () => {
        return {
            showBGLayers: true,
            lastConf: null
        };
    },
    computed: {
        ...mapGetters(["layerConfig", "portalConfig", "allBackgroundLayerConfigs", "subjectDataLayerConfigsStructured"]),
        ...mapGetters("Modules/LayerSelection", ["active", "subjectDataLayerConfs", "layersToAdd", "layersToRemove"])

    },
    created () {
        this.setSubjectDataLayerConfs(this.subjectDataLayerConfigsStructured);
    },
    methods: {
        ...mapActions("Menu", ["mergeMenuState"]),
        ...mapActions("Modules/LayerSelection", ["updateLayerTree"]),
        ...mapMutations("Modules/LayerSelection", ["setSubjectDataLayerConfs"]),
        ...mapMutations("Menu", ["addModuleToMenuSection"]),
        setConf (newConf) {
            const sorted = sortBy(newConf, (conf) => conf.type !== "folder");

            this.lastConf = this.conf;
            this.setSubjectDataLayerConfs(sorted);
            this.showBGLayers = false;
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
        <h6>{{ $t("common:tree.backgrounds") }}</h6>
        <div class="row align-items-center justify-content-center">
            <template v-if="showBGLayers">
                <template
                    v-for="(bgConf, index) in allBackgroundLayerConfigs"
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
                id="copy-btn"
                class="mt-2  w-100"
                aria-label="$t('tree.addSelectedSubjectsToMap')"
                :disabled="layersToAdd.length === 0 && layersToRemove.length === 0"
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

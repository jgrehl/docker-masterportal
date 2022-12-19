<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import sortBy from "../../../../shared/js/utils/sortBy";
import LayerCheckBox from "../../components/LayerCheckBox.vue";
import LayerSelectionTreeNode from "./LayerSelectionTreeNode.vue";


export default {
    name: "LayerSelection",
    components: {
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
        ...mapGetters("Modules/LayerSelection", ["active", "subjectDataLayerConfs"]),
        // ...mapGetters("Menu/Navigation", ["getPath"]),

    },
    watch: {

    },
    created () {
        this.setSubjectDataLayerConfs(this.subjectDataLayerConfigsStructured);
    },
    methods: {
        ...mapActions("Menu", ["mergeMenuState"]),
        ...mapMutations("Modules/LayerSelection", ["setSubjectDataLayerConfs"]),
        ...mapMutations("Menu", ["addModuleToMenuSection"]),
        setConf (newConf) {
            // const path = this.getPath("mainMenu", "LayerSelection");
            // console.log(path);
            // path.push(0);
            // this.addModuleToMenuSection({
            //             module: {
            //                 type: "LayerSelection"
            //             },
            //             side: "mainMenu"
            //         });
            const sorted = sortBy(newConf, (conf) => conf.type !== "folder");

            this.lastConf = this.conf;
            this.setSubjectDataLayerConfs(sorted);
            this.showBGLayers = false;
            // this.$store.commit("Menu/Navigation/addEntry", path, {root: true});
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

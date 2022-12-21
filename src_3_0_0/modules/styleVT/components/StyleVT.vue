<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "StyleVT",
    computed: {
        ...mapGetters(["visibleLayerConfigs"]),
        ...mapGetters("Modules/StyleVT", [
            "active",
            "layerModel",
            "selectedLayerId",
            "selectedStyle",
            "vectorTileLayerList"
        ])
    },
    watch: {
        active (active) {
            this.startLayerProcess({active});

            if (active) {
                this.setFocusToFirstControl();
            }
        },
        visibleLayerConfigs: {
            handler () {
                this.refreshVectorTileLayerList();
            },
            deep: true
        }
    },
    mounted () {
        this.startLayerProcess({active: this.active});
        this.setFocusToFirstControl();
    },
    methods: {
        ...mapMutations("Modules/StyleVT", ["setLayerModelById"]),
        ...mapActions("Modules/StyleVT", [
            "refreshVectorTileLayerList",
            "startLayerProcess",
            "updateStyle"
        ]),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["module-styleVT-selectedLayerField"]) {
                    this.$refs["module-styleVT-selectedLayerField"].focus();
                }
            });
        }
    }
};
</script>

<template>
    <div
        v-if="active"
        id="modules-style-vt"
    >
        <p
            v-if="vectorTileLayerList.length === 0"
            id="module-styleVT-noStyleableLayers"
        >
            {{ $t("common:modules.tools.styleVT.noStyleableLayers") }}
        </p>
        <div v-else>
            <p>{{ $t("common:modules.tools.styleVT.introText") }}</p>
            <form
                id="module-styleVT-styleableLayersAvailable"
                class="form-horizontal"
                role="form"
            >
                <div class="form-group form-group-sm col-md-12">
                    <label
                        for="module-styleVT-selectedLayerField"
                        class="range-label mb-1"
                    >
                        {{ $t("common:modules.tools.styleVT.theme") }}
                    </label>
                    <select
                        id="module-styleVT-selectedLayerField"
                        ref="module-styleVT-selectedLayerField"
                        class="form-select form-select-sm"
                        @change="setLayerModelById($event.target.value)"
                    >
                        <option
                            class="float-start"
                            value=""
                            selected
                        >
                            {{ $t("common:modules.tools.styleVT.chooseTheme") }}
                        </option>
                        <option
                            v-for="vectorTileLayer in vectorTileLayerList"
                            :key="vectorTileLayer.id"
                            class="float-start"
                            :value="vectorTileLayer.id"
                            :selected="selectedLayerId(vectorTileLayer.id)"
                        >
                            {{ vectorTileLayer.name }}
                        </option>
                    </select>
                </div>
                <div
                    v-if="layerModel"
                    class="form-group form-group-sm col-md-12"
                >
                    <label
                        for="module-styleVT-selectedStyleField"
                        class="style-label"
                    >
                        {{ $t("common:modules.tools.styleVT.style") }}
                    </label>
                    <select
                        id="module-styleVT-selectedStyleField"
                        class="form-select form-select-sm"
                        @change="updateStyle($event.target.value)"
                    >
                        <option
                            v-for="vtStyle in layerModel.get('vtStyles')"
                            :key="vtStyle.id"
                            class="float-start"
                            :value="vtStyle.id"
                            :selected="selectedStyle(vtStyle.id)"
                        >
                            {{ vtStyle.name }}
                        </option>
                    </select>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import MeasureInMapTooltip from "./MeasureInMapTooltip.vue";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";

/**
 * Measurement tool to measure lines and areas in the map.
 */
export default {
    name: "MeasureInMap",
    components: {
        MeasureInMapTooltip,
        FlatButton
    },
    data () {
        return {
            deleteIcon: "bi-trash"
        };
    },
    computed: {
        ...mapGetters("Modules/Measure", [
            "active",
            "featureId",
            "tooltipCoord",
            "interaction",
            "source",
            "layer",
            "lines",
            "polygons",
            "geometryValues",
            "lineStringUnits",
            "polygonUnits",
            "selectedGeometry",
            "selectedUnit",
            "currentUnits"
        ]),
        ...mapGetters(["uiStyle"]),
        ...mapGetters("Maps", ["mode"])
    },
    watch: {
        /**
         * (Re-)Creates or removes draw interaction on opening/closing tool.
         * @param {boolean} value active state of tool
         * @returns {void}
         */
        active (value) {
            if (!value) {
                this.removeIncompleteDrawing();
                this.removeDrawInteraction();
            }
            else {
                this.createDrawInteraction();
                this.setFocusToFirstControl();
            }
        },
        /**
         * Recreates draw interaction on geometry type update.
         * @returns {void}
         */
        selectedGeometry () {
            if (this.active) {
                this.createDrawInteraction();
            }
        }
    },
    created () {
        this.$store.dispatch("Maps/checkLayer", this.layer).then((layerExists) => {
            if (!layerExists) {
                this.$store.dispatch("Maps/addLayer", this.layer);
            }
        });

    },
    unmounted () {
        this.removeIncompleteDrawing();
        this.removeDrawInteraction();
    },
    mounted () {
        if (this.active) {
            this.createDrawInteraction();
        }
    },
    methods: {
        ...mapMutations("Modules/Measure", ["setSelectedGeometry", "setSelectedUnit", "setActive"]),
        ...mapActions("Modules/Measure", ["deleteFeatures", "createDrawInteraction", "removeIncompleteDrawing", "removeDrawInteraction"]),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["measure-tool-geometry-select"] && !this.$refs["measure-tool-geometry-select"].disabled) {
                    this.$refs["measure-tool-geometry-select"].focus();
                }
                else if (this.$refs["measure-tool-unit-select"]) {
                    this.$refs["measure-tool-unit-select"].focus();
                }
            });
        },
        /**
         * removes the last drawing if it has not been completed
         * @return {void}
         */
        removeIncompleteDrawing () {
            const feature = this.lines[this.featureId] || this.polygons[this.featureId];

            if (feature && feature.get("isBeingDrawn")) {
                const layerSource = this.layer.getSource();

                if (layerSource.getFeatures().length > 0) {
                    const actualFeature = layerSource.getFeatures().slice(-1)[0];

                    layerSource.removeFeature(actualFeature);
                }
            }
        },
        isDefaultStyle () {
            return this.uiStyle !== "SIMPLE" && this.uiStyle !== "TABLE";
        },
        is3DMode () {
            return this.mode === "3D";
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="measure"
    >
        <MeasureInMapTooltip />
        <div class="form-floating mb-3">
            <select
                id="measure-tool-geometry-select"
                ref="measure-tool-geometry-select"
                class="form-select"
                aria-label="..."
                :disabled="is3DMode()"
                :value="selectedGeometry"
                @change="setSelectedGeometry($event.target.value)"
            >
                <option
                    v-for="geometryValue in geometryValues"
                    :key="'measure-tool-geometry-select-' + geometryValue"
                    :value="geometryValue"
                >
                    {{ is3DMode()
                        ? selectedGeometry
                        : $t("modules.tools.measure." +
                            (geometryValue === "LineString" ? "stretch" : "area"))
                    }}
                </option>
            </select>
            <label for="measure-tool-geometry-select">
                {{ $t("modules.tools.measure.geometry") }}
            </label>
        </div>

        <div class="form-floating">
            <select
                id="measure-tool-unit-select"
                ref="measure-tool-unit-select"
                class="form-select"
                aria-label="..."
                :value="selectedUnit"
                @change="setSelectedUnit($event.target.value)"
            >
                <option
                    v-for="(unit, i) in currentUnits"
                    :key="'measure-tool-unit-select-' + i"
                    :value="i"
                >
                    {{ unit }}
                </option>
            </select>
            <label for="measure-tool-unit-select">
                {{ $t("modules.tools.measure.measure") }}
            </label>
        </div>
        <div
            v-if="isDefaultStyle()"
        >
            <div class="inaccuracy-list">
                {{ $t("modules.tools.measure.influenceFactors") }}
                <ul>
                    <li>{{ $t("modules.tools.measure.scale") }}</li>
                    <li>{{ $t("modules.tools.measure.resolution") }}</li>
                    <li>{{ $t("modules.tools.measure.screenResolution") }}</li>
                    <li>{{ $t("modules.tools.measure.inputAccuracy") }}</li>
                    <li>{{ $t("modules.tools.measure.measureDistance") }}</li>
                </ul>
            </div>
        </div>
        <FlatButton
            id="measure-delete"
            aria-label="$t('modules.tools.measure.deleteMeasurements')"
            :interaction="deleteFeatures"
            :text="$t('modules.tools.measure.deleteMeasurements')"
            :icon="deleteIcon"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.inaccuracy-list {
    max-width: 270px;
}
</style>

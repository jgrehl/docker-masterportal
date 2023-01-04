<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersBufferAnalysis";
import mutations from "../store/mutationsBufferAnalysis";
import actions from "../store/actionsBufferAnalysis";
import {ResultType} from "../store/enums";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";

/**
 * Tool to check if a subset of features associated to a target layer are located within or outside an applied radius to all features of a source layer.
 */
export default {
    name: "BufferAnalysis",
    components: {FlatButton},
    data: () => ({resultTypeEnum: ResultType}),
    computed: {
        ...mapGetters("Modules/BufferAnalysis", Object.keys(getters)),
        selectedSourceLayer: {
            /**
             * getter for the computed property selectedSourceLayer
             * @returns {Object} the current selected source layer
             */
            get () {
                return this.$store.state.Modules.BufferAnalysis.selectedSourceLayer;
            },
            /**
             * setter for the computed property selectedSourceLayer
             * @param {Object} newLayerSelection the new selected source layer
             * @returns {void}
             */
            set (newLayerSelection) {
                this.applySelectedSourceLayer(newLayerSelection);
            }
        },
        selectedTargetLayer: {
            /**
             * getter for the computed property selectedTargetLayer
             * @returns {Object} the current selected target layer
             */
            get () {
                return this.$store.state.Modules.BufferAnalysis.selectedTargetLayer;
            },
            /**
             * setter for the computed property selectedTargetLayer
             * @param {Object} newLayerSelection the new selected target layer
             * @returns {void}
             */
            set (newLayerSelection) {
                this.applySelectedTargetLayer(newLayerSelection);
            }
        },
        resultType: {
            /**
             * getter for the computed property resultType
             * @returns {ResultType} the current selected result type
             */
            get () {
                return this.$store.state.Modules.BufferAnalysis.resultType;
            },
            /**
             * setter for the computed property resultType
             * @param {ResultType} newType the new selected result type
             * @returns {void}
             */
            set (newType) {
                this.setResultType(newType);
            }
        },
        inputBufferRadius: {
            get () {
                return this.$store.state.Modules.BufferAnalysis.inputBufferRadius;
            },
            set (newRadius) {
                this.setInputBufferRadius(newRadius);
            }
        }
    },
    watch: {
        /**
         * Watches the value of inputBufferRadius
         * debounces the input values to prevent unnecessary calculations
         * @param {Number} newBufferRadius the new selected buffer radius
         * @returns {void}
         */
        inputBufferRadius (newBufferRadius) {
            clearTimeout(this.timerId);
            this.setTimerId(setTimeout(() => {
                this.applyBufferRadius(newBufferRadius);
            }, 500));
        },
        /**
         * Sets focus if view becomes active.
         * @param {Boolean} isActive - if active or not
         * @returns {void}
         */
        active (isActive) {
            if (isActive) {
                this.setFocusToFirstControl();
                this.setSelectOptions([]);
                this.loadSelectOptions();
            }
        }
    },
    /**
     * Lifecycle hook:
     * - initializes the JSTS parser
     * - loads available options for selections
     * @returns {void}
     */
    created () {
        this.initJSTSParser();
        this.loadSelectOptions();
    },
    mounted () {
        this.$nextTick(() => {
            this.applyValuesFromSavedUrlBuffer();
        });
    },
    unmounted () {
        this.removeGeneratedLayers();
        this.resetModule();
    },
    methods: {
        ...mapMutations("Modules/BufferAnalysis", Object.keys(mutations)),
        ...mapActions("Modules/BufferAnalysis", Object.keys(actions)),
        ...mapActions("Map", ["toggleLayerVisibility"]),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["tool-bufferAnalysis-selectSourceInput"]) {
                    this.$refs["tool-bufferAnalysis-selectSourceInput"].focus();
                }
            });
        },
        /**
         * Lets you build and then copy the url to the clipboard.
         * ToDo: add "link copied" Hinweis
         * @returns {void}
         */
        buildAndCopyUrl () {
            this.buildUrlFromToolState();
            navigator.clipboard.writeText(this.savedUrl);
        }
    }
};
</script>

<template lang="html">
    <div
        id="tool-bufferAnalysis"
    >
        <div class="form-floating mb-3">
            <select
                id="tool-bufferAnalysis-selectSourceInput"
                ref="tool-bufferAnalysis-selectSourceInput"
                v-model="selectedSourceLayer"
                class="form-select"
                :aria-label="$t('modules.tools.bufferAnalysis.sourceSelectLabel')"
            >
                <option
                    v-for="layer in selectOptions"
                    :key="layer.id"
                    :value="layer"
                    :selected="selectOptions[0].name"
                >
                    {{ layer.name }}
                </option>
            </select>
            <label for="tool-bufferAnalysis-selectSourceInput">
                {{ $t("modules.tools.bufferAnalysis.sourceSelectLabel") }}
            </label>
        </div>

        <div class="form-floating mb-3">
            <input
                id="tool-bufferAnalysis-radiusTextInput"
                v-model="inputBufferRadius"
                :disabled="!selectedSourceLayer || selectedTargetLayer"
                min="0"
                max="3000"
                step="10"
                class="form-control"
                type="number"
            >
            <label
                for="tool-bufferAnalysis-radiusTextInput"
            >{{ $t("modules.tools.bufferAnalysis.rangeLabel") }}</label>
            <input
                id="tool-bufferAnalysis-radiusRangeInput"
                v-model="inputBufferRadius"
                :disabled="!selectedSourceLayer || selectedTargetLayer"
                type="range"
                class="form-range"
                min="0"
                max="3000"
                step="10"
            >
        </div>

        <div class="form-floating mb-3">
            <select
                id="tool-bufferAnalysis-resultTypeInput"
                v-model="resultType"
                class="form-select"
                :aria-label="$t('modules.tools.bufferAnalysis.resultTypeLabel')"
                :disabled="!selectedSourceLayer || !bufferRadius || selectedTargetLayer"
            >
                <option
                    :value="resultTypeEnum.WITHIN"
                >
                    {{ $t("modules.tools.bufferAnalysis.overlapping") }}
                </option>
                <option
                    :value="resultTypeEnum.OUTSIDE"
                >
                    {{ $t("modules.tools.bufferAnalysis.notOverlapping") }}
                </option>
            </select>
            <label for="tool-bufferAnalysis-resultTypeInput">
                {{ $t("modules.tools.bufferAnalysis.resultTypeLabel") }}
            </label>
        </div>

        <div class="form-floating mb-3">
            <select
                id="tool-bufferAnalysis-selectTargetInput"
                v-model="selectedTargetLayer"
                class="form-select"
                :aria-label="$t('modules.tools.bufferAnalysis.targetSelectLabel')"
                :disabled="!selectedSourceLayer || !bufferRadius || selectedTargetLayer"
            >
                <option
                    v-for="layer in selectOptions"
                    :key="layer.id"
                    :value="layer"
                >
                    {{ layer.name }}
                </option>
            </select>
            <label for="tool-bufferAnalysis-selectTargetInput">
                {{ $t("modules.tools.bufferAnalysis.targetSelectLabel") }}
            </label>
        </div>

        <div class="mb-3 d-flex justify-content-center">
            <FlatButton
                id="tool-bufferAnalysis-resetButton"
                :aria-label="$t('modules.tools.bufferAnalysis.clearButton')"
                :interaction="resetModule"
                :text="$t('modules.tools.bufferAnalysis.clearButton')"
                :icon="'bi-x-circle'"
            />
        </div>
        <div class="d-flex justify-content-center row form-floating">
            <FlatButton
                id="tool-bufferAnalysis-saveButton"
                :aria-label="$t('modules.tools.bufferAnalysis.saveButton')"
                :interaction="buildAndCopyUrl"
                :disabled="!selectedSourceLayer || !selectedTargetLayer || !bufferRadius"
                :text="$t('modules.tools.bufferAnalysis.saveButton')"
                :icon="'bi-clipboard'"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
</style>

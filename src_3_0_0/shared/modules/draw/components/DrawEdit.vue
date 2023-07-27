<script>
import {pointerMove} from "ol/events/condition.js";
import selectInteractions from "@masterportal/masterportalapi/src/maps/interactions/selectInteractions";
import modifyInteractions from "@masterportal/masterportalapi/src/maps/interactions/modifyInteractions";
import {mapActions} from "vuex";

import IconButton from "../../buttons/components/IconButton.vue";

/**
 * Shared component that provides buttons to edit drawn features.
 * @module shared/modules/draw/DrawEdit
 * @vue-prop {Object} [drawIcons={delete: "bi-eraser-fill", deleteAll: "bi-trash", modify: "bi-tools", redo: "bi-arrow-right", undo: "bi-arrow-left"}] - The icons for edit buttons.
 * @vue-prop {ol/layer/Vector} layer - The vector layer for drawings.
 * @vue-prop {String} [selectedInteraction="draw"] - The selected interaction.
 * @vue-prop {Function} [setSelectedInteraction=null] - Setter for selected interaction.
 * @vue-data {ol/interaction/Select} currentSelectInteractions=[] - The current select interactions.
 * @vue-data {ol/interaction/Modify} currentModifyInteraction=null - The current modify interaction.
 * @vue-data {String} mode="" - The current mode.
 * @vue-data {ol/feature[]} redoFeatures=null - Contains the redo features.
 * @vue-data {ol/feature[]} undoFeatures=null - Contains the undo features.
 */
export default {
    name: "DrawEdit",
    components: {
        IconButton
    },
    props: {
        drawEdits: {
            type: Array,
            default () {
                return ["deleteAll", "delete", "edit", "undo", "redo"];
            }
        },
        drawIcons: {
            type: Object,
            default () {
                return {
                    delete: "bi-eraser-fill",
                    deleteAll: "bi-trash",
                    modify: "bi-tools",
                    redo: "bi-arrow-right",
                    undo: "bi-arrow-left"
                };
            }
        },
        layer: {
            type: Object,
            required: true
        },
        selectedInteraction: {
            type: String,
            default () {
                return "draw";
            }
        },
        setSelectedInteraction: {
            type: Function,
            default () {
                return null;
            }
        }
    },
    data () {
        return {
            currentSelectInteractions: [],
            currentModifyInteraction: null,
            mode: "",
            redoFeatures: [],
            undoFeatures: []
        };
    },
    computed: {
        source () {
            return this.layer?.getSource();
        }
    },
    watch: {
        selectedInteraction (selectedInteraction) {
            if (selectedInteraction !== "delete") {
                this.currentSelectInteractions.forEach(selectInteraction => this.removeInteraction(selectInteraction));
                this.currentSelectInteractions = [];
            }
            if (selectedInteraction !== "modify") {
                this.removeInteraction(this.currentModifyInteraction);
                this.currentModifyInteraction = null;
            }
        }
    },
    mounted () {
        this.source.on("addfeature", event => {
            this.changeUndoRedoFeatures(event.feature, "draw");
        });

        this.source.on("removefeature", event => {
            this.changeUndoRedoFeatures(event.feature, "delete");
        });

        this.source.on("clear", () => {
            this.mode = "";
        });
    },
    unmounted () {
        this.currentSelectInteractions.forEach(selectInteraction => this.removeInteraction(selectInteraction));
        this.removeInteraction(this.currentModifyInteraction);
    },
    methods: {
        ...mapActions("Maps", ["addInteraction", "removeInteraction"]),

        /**
         * Regulate the draw edit interactions.
         * @param {String} drawEdit The current draw edit.
         * @returns {void}
         */
        regulateEditInteraction (drawEdit) {
            const mappingEditInteractions = {
                delete: this.regulateDelete,
                deleteAll: this.regulateDeleteAll,
                modify: this.regulateModify,
                redo: this.regulateRedo,
                undo: this.regulateUndo
            };

            mappingEditInteractions[drawEdit]();
        },

        /**
         * Regulate the draw edit delete interaction.
         * @returns {void}
         */
        regulateDelete () {
            if (typeof this.setSelectedInteraction === "function") {
                this.setSelectedInteraction("delete");
            }

            this.currentSelectInteractions.forEach(selectInteraction => this.removeInteraction(selectInteraction));
            this.currentSelectInteractions = [];

            this.currentSelectInteractions.push(selectInteractions.createSelectInteraction(this.layer));
            this.currentSelectInteractions.push(selectInteractions.createSelectInteraction(this.layer, pointerMove));
            selectInteractions.removeSelectedFeature(this.currentSelectInteractions[0], this.source);
            this.currentSelectInteractions.forEach(selectInteraction => this.addInteraction(selectInteraction));
        },

        /**
         * Regulate the draw edit delete all (clear) interaction.
         * @returns {void}
         */
        regulateDeleteAll () {
            this.mode = "deleteAll";

            this.undoFeatures.push(this.source.getFeatures());
            this.source.clear();
        },

        /**
         * Regulate the draw edit modify interaction.
         * @returns {void}
         */
        regulateModify () {
            if (typeof this.setSelectedInteraction === "function") {
                this.setSelectedInteraction("modify");
            }

            this.removeInteraction(this.currentModifyInteraction);
            this.currentModifyInteraction = modifyInteractions.createModifyInteraction(this.source);
            this.addInteraction(this.currentModifyInteraction);
        },

        /**
         * Regulate the draw edit undo.
         * @returns {void}
         */
        regulateUndo () {
            this.undoRedoFeatures(this.undoFeatures, "undo");
        },

        /**
         * Regulate the draw edit redo.
         * @returns {void}
         */
        regulateRedo () {
            this.undoRedoFeatures(this.redoFeatures, "redo");
        },

        /**
         * Regulates the undo or redo features.
         * @param {ol/feature[]} features The undo or redo features.
         * @param {String} mode The undo or redo mode.
         * @returns {void}
         */
        undoRedoFeatures (features, mode) {
            if (features.length > 0) {
                const source = this.source,
                    feature = features[features.length - 1];

                this.mode = mode;

                if (Array.isArray(feature)) {
                    this.undoRedoFeatureArray(mode, features, source);
                }
                else if (feature.mode === "draw") {
                    source.removeFeature(feature.feature);
                }
                else if (feature.mode === "delete") {
                    source.addFeature(feature.feature);
                }
            }
        },

        /**
         * Regulates the undo redo features if delete all was used.
         * @param {String} mode The undo or redo mode.
         * @param {ol/feature[]} features The undo or redo features.
         * @param {ol/source} source The vector layer.
         * @returns {void}
         */
        undoRedoFeatureArray (mode, features, source) {
            const featureArray = features.pop();

            this.mode = "deleteAll";

            if (mode === "undo") {
                source.addFeatures(featureArray);
                this.redoFeatures.push(featureArray);
            }
            else if (mode === "redo") {
                featureArray.forEach(feat => source.removeFeature(feat));
                this.undoFeatures.push(featureArray);
            }
            this.mode = "";
        },

        /**
         * Change the position of features in undo and redo feature collections.
         * @param {ol/feature} feature The ol feature.
         * @param {String} mode The draw or delete mode.
         * @returns {void}
         */
        changeUndoRedoFeatures (feature, mode) {
            const undoRedoFeature = {
                feature: feature,
                mode: mode
            };

            if (this.mode === "undo") {
                this.mode = "";
                this.undoFeatures.pop();
                this.redoFeatures.push(undoRedoFeature);
            }
            else if (this.mode === "redo") {
                this.mode = "";
                this.redoFeatures.pop();
                this.undoFeatures.push(undoRedoFeature);
            }
            else if (this.mode === "") {
                this.undoFeatures.push(undoRedoFeature);
                this.redoFeatures = [];
            }
        }
    }
};
</script>

<template>
    <div
        v-if="source?.getFeatures()?.length > 0 || undoFeatures.length > 0 || redoFeatures.length > 0"
        class="mb-4"
    >
        <div class="d-flex">
            <IconButton
                v-for="drawEdit in drawEdits"
                :id="'draw-edit-' + drawEdit"
                :key="drawEdit"
                :aria="$t('common:shared.modules.draw.drawEdit.' + drawEdit)"
                :class-array="[
                    'btn-light',
                    'me-3',
                    selectedInteraction === drawEdit ? 'active': '',
                    drawEdit === 'redo' && redoFeatures.length === 0 ? 'disabled' : '',
                    drawEdit === 'undo' && undoFeatures.length === 0 ? 'disabled' : '',
                    drawEdit !== 'redo' && drawEdit !== 'undo' && source?.getFeatures()?.length === 0 ? 'disabled' : ''
                ]"
                :interaction="() => regulateEditInteraction(drawEdit)"
                :icon="drawIcons[drawEdit]"
            />
        </div>
        <hr>
    </div>
</template>

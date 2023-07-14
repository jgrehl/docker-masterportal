<script>
import {pointerMove} from "ol/events/condition.js";
import selectInteractions from "@masterportal/masterportalapi/src/maps/interactions/selectInteractions";
import modifyInteractions from "@masterportal/masterportalapi/src/maps/interactions/modifyInteractions";
import {mapActions} from "vuex";

import IconButton from "../../buttons/components/IconButton.vue";

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
            currentModifyInteraction: null
        };
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
                modify: this.regulateModify
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
            selectInteractions.removeSelectedFeature(this.currentSelectInteractions[0], this.layer.getSource());
            this.currentSelectInteractions.forEach(selectInteraction => this.addInteraction(selectInteraction));
        },

        /**
         * Regulate the draw edit delete all (clear) interaction.
         * @returns {void}
         */
        regulateDeleteAll () {
            this.activeEdit = "";
            this.layer.getSource().clear();
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
            this.currentModifyInteraction = modifyInteractions.createModifyInteraction(this.layer.getSource());
            this.addInteraction(this.currentModifyInteraction);
        }
    }
};
</script>

<template>
    <div class="mb-4">
        <div class="d-flex">
            <IconButton
                v-for="drawEdit in drawEdits"
                :id="'draw-edit-' + drawEdit"
                :key="drawEdit"
                :aria="$t('common:shared.modules.draw.drawEdit.' + drawEdit)"
                :class-array="[
                    'btn-light',
                    'me-3',
                    selectedInteraction === drawEdit ? 'active': ''
                ]"
                :interaction="() => regulateEditInteraction(drawEdit)"
                :icon="drawIcons[drawEdit]"
            />
        </div>
        <hr>
    </div>
</template>

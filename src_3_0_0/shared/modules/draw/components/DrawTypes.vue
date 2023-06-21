<script>
import drawInteractions from "@masterportal/masterportalapi/src/maps/interactions/drawInteractions";
import {Popover} from "bootstrap";
import {mapActions, mapGetters} from "vuex";

import DrawTypesPopover from "./DrawTypesPopover.vue";
import IconButton from "../../buttons/components/IconButton.vue";

export default {
    name: "DrawTypes",
    components: {
        DrawTypesPopover,
        IconButton
    },
    props: {
        circleInnerRadius: {
            type: Number,
            default () {
                return 0;
            }
        },
        circleOuterRadius: {
            type: Number,
            default () {
                return 0;
            }
        },
        customclass: {
            type: String,
            default: null
        },
        drawTypes: {
            type: Array,
            default () {
                return ["pen", "geometries", "symbols"];
            }
        },
        drawTypesGeometrie: {
            type: Array,
            default () {
                return ["line", "box", "polygon", "circle", "doubleCircle"];
            }
        },
        drawTypesSymbols: {
            type: Array,
            default () {
                return ["point"];
            }
        },
        interactiveCircle: {
            type: Boolean,
            default () {
                return true;
            }
        },
        source: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            drawInteraction: null,
            mappingIcons: {
                geometries: "bi-heptagon",
                pen: "bi-pencil-fill",
                symbols: "bi-circle-square"
            },
            popovers: []
        };
    },
    computed: {
        ...mapGetters("Maps", ["projection"])
    },
    mounted () {
        this.processPopover(document.getElementById("draw-geometries"), "draw-types-geometries");
        this.processPopover(document.getElementById("draw-symbols"), "draw-types-symbols");
    },
    unmounted () {
        this.hidePopovers();
        this.removeInteraction(this.drawInteraction);
    },
    methods: {
        ...mapActions("Maps", ["addInteraction", "removeInteraction"]),

        /**
         * Creates a popover with content.
         * @param {HTMLElement} popoverElement The popover element.
         * @param {HTMLElement} contentElementId The content element id for popover element.
         * @returns {void}
         */
        processPopover (popoverElement, contentElementId) {
            if (popoverElement) {
                const geometriesPopover = this.createPopover(popoverElement);

                this.setPopoverContent(geometriesPopover, document.getElementById(contentElementId));
                this.popovers.push(geometriesPopover);
            }
        },

        /**
         * Creates a bootstrap popover.
         * @param {HTMLElement} element The html element.
         * @returns {Object} the popover.
         */
        createPopover (element) {
            return new Popover(element, {
                html: true,
                placement: "bottom"
            });
        },

        /**
         * Sets the popover content.
         * @param {Object} popover The popover.
         * @param {HTMLElement} element The html element which set to body.
         * @returns {void}
         */
        setPopoverContent (popover, element) {
            popover.setContent({
                ".popover-header": "",
                ".popover-body": element
            });
        },

        /**
         * Hide the popovers.
         * @returns {void}
         */
        hidePopovers () {
            this.popovers.forEach(popover => popover.hide());
        },

        /**
         * Updates the mappingIcon to current icon.
         * @param {String} icon The current icon
         * @param {String} type  The type in the mappingIcon.
         * @returns {void}
         */
        updateIcon (icon, type) {
            this.mappingIcons[type] = icon;
        },

        /**
         * Regulate the draw interactions.
         * @param {String} drawType The current draw type.
         * @returns {void}
         */
        regulateInteraction (drawType) {
            const options = {
                circleInnerRadius: this.circleInnerRadius,
                circleOuterRadius: this.circleOuterRadius,
                interactiveCircle: this.interactiveCircle
            };

            this.hidePopovers();
            this.removeInteraction(this.drawInteraction);
            this.drawInteraction = drawInteractions.changeDrawInteraction(drawType, this.source, this.projection, options);
            this.addInteraction(this.drawInteraction);
        }
    }
};
</script>

<template>
    <div class="d-flex align-items-center justify-content-around">
        <IconButton
            v-for="drawType in drawTypes"
            :id="'draw-' + drawType"
            :ref="'draw-' + drawType"
            :key="drawType"
            :aria="$t('common:shared.modules.draw.drawTypes.' + drawType)"
            :class-array="['btn-primary']"
            :interaction="() => regulateInteraction(drawType)"
            :icon="mappingIcons[drawType]"
        />
        <div
            v-show="false"
            class="draw-types-popovers"
        >
            <DrawTypesPopover
                id="draw-types-geometries"
                :elements="drawTypesGeometrie"
                @regulate-interaction="regulateInteraction"
                @update-icon="(icon) => updateIcon(icon, 'geometries')"
            />
            <DrawTypesPopover
                id="draw-types-symbols"
                :elements="drawTypesSymbols"
                @regulate-interaction="regulateInteraction"
                @update-icon="(icon) => updateIcon(icon, 'symbols')"
            />
        </div>
    </div>
</template>

<style lang="scss">
    @import "~variables";

    .popover-body {
        padding: 0.5rem;
        background-color: $primary;
    }
</style>

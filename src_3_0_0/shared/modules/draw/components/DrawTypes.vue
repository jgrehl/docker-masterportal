<script>
import drawInteractions from "@masterportal/masterportalapi/src/maps/interactions/drawInteractions";
import {mapActions, mapGetters} from "vuex";

import IconButton from "../../buttons/components/IconButton.vue";

/**
 * Shared component that provides buttons for two-level selection of geometries and symbols.
 * @module shared/modules/draw/DrawTypes
 * @vue-prop {Object} [circleOptions={innerRadius: 100, interactive: true, outerRadius: 500}] - The circle Options.
 * @vue-prop {Object} currentLayout - The current layout for the styling.
 * @vue-prop {Object} [currentLayoutOuterCircle={}] - The current layout for styling the outer circle. Only used for double circle.
 * @vue-prop {Object} [drawIcons={box: "bi-square", circle: "bi-circle", doubleCircle: "bi-record-circle", geometries: "bi-hexagon-fill", line: "bi-slash-lg", pen: "bi-pencil-fill", point: "bi-circle-fill", polygon: "bi-octagon", symbols: "bi-circle-square"}] - The icons for draw buttons.
 * @vue-prop {String[]} [drawTypes=["pen", "geometries", "symbols"]] - The drawing types.
 * @vue-prop {String} [selectedDrawType=""] - The selected draw type.
 * @vue-prop {String} [selectedDrawTypeMain=""] - The selected draw type main.
 * @vue-prop {Function} setSelectedDrawType - Setter for selected draw type.
 * @vue-prop {Function} [setSelectedDrawTypeMain=null] - Setter for selected draw type main.
 * @vue-prop {ol/source/Vector} source - The vector source for drawings.
 * @vue-data {ol/interaction/Draw} drawInteraction=null - The current draw interaction.
 */
export default {
    name: "DrawTypes",
    components: {
        IconButton
    },
    props: {
        circleOptions: {
            type: Object,
            default () {
                return {
                    innerRadius: 0,
                    interactive: true,
                    outerRadius: 0
                };
            }
        },
        currentLayout: {
            type: Object,
            required: true
        },
        currentLayoutOuterCircle: {
            type: Object,
            default () {
                return {};
            }
        },
        drawIcons: {
            type: Object,
            default () {
                return {
                    box: "bi-square",
                    circle: "bi-circle",
                    doubleCircle: "bi-record-circle",
                    geometries: "bi-hexagon-fill",
                    line: "bi-slash-lg",
                    pen: "bi-pencil-fill",
                    point: "bi-circle-fill",
                    polygon: "bi-octagon",
                    symbols: "bi-circle-square"
                };
            }
        },
        drawTypes: {
            type: Array,
            default () {
                return ["pen", "geometries", "symbols"];
            }
        },
        selectedDrawType: {
            type: String,
            default () {
                return "";
            }
        },
        selectedDrawTypeMain: {
            type: String,
            default () {
                return "";
            }
        },
        setSelectedDrawType: {
            type: Function,
            required: true
        },
        setSelectedDrawTypeMain: {
            type: Function,
            default () {
                return null;
            }
        },
        source: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            drawInteraction: null
        };
    },
    computed: {
        ...mapGetters("Maps", ["projection"])
    },
    watch: {
        currentLayout (currentLayout) {
            drawInteractions.setStyleObject(currentLayout);
        },
        currentLayoutOuterCircle (currentLayoutOuterCircle) {
            drawInteractions.setStyleObject(currentLayoutOuterCircle, true);
        }
    },
    mounted () {
        drawInteractions.setStyleObject(this.currentLayout);
        if (Object.keys(this.currentLayoutOuterCircle).length > 0) {
            drawInteractions.setStyleObject(this.currentLayoutOuterCircle, true);
        }

        this.regulateInteraction(this.selectedDrawType);
    },
    unmounted () {
        this.removeInteraction(this.drawInteraction);
    },
    methods: {
        ...mapActions("Maps", ["addInteraction", "removeInteraction"]),

        /**
         * Regulate the interaction.
         * @param {String} drawType The current draw type.
         * @returns {void}
         */
        regulateInteraction (drawType) {
            if (typeof this.setSelectedDrawTypeMain === "function") {
                this.setSelectedDrawTypeMain(this.selectedDrawTypeMain !== drawType ? drawType : "");
            }

            this.removeInteraction(this.drawInteraction);

            if (this.selectedDrawType === drawType) {
                this.setSelectedDrawType("");
            }
            else {
                this.regulateDrawInteraction(drawType);
            }
        },

        /**
         * Regulate the draw interaction for valid draw types.
         * @param {String} drawType The current draw type.
         * @returns {void}
         */
        regulateDrawInteraction (drawType) {
            this.drawInteraction = drawInteractions.createDrawInteraction(drawType, this.source);

            if (this.drawInteraction !== null) {
                if (drawType === "circle" || drawType === "doubleCircle") {
                    this.regulateStaticCircleInteraction(drawType);
                }

                this.addInteraction(this.drawInteraction);
                this.setSelectedDrawType(drawType);
            }
        },

        /**
         * Regulate the draw interactions for static circles.
         * @param {String} drawType The current draw type.
         * @returns {void}
         */
        regulateStaticCircleInteraction (drawType) {
            drawInteractions.drawCircle(this.drawInteraction, drawType, this.projection, this.source, this.circleOptions);
        }
    }
};
</script>

<template>
    <div class="d-flex mb-5 align-items-center justify-content-around">
        <IconButton
            v-for="drawType in drawTypes"
            :id="'draw-' + drawType"
            :key="drawType"
            :aria="$t('common:shared.modules.draw.drawTypes.' + drawType)"
            :class-array="[
                'btn-primary',
                selectedDrawType === drawType || selectedDrawTypeMain === drawType ? 'active': ''
            ]"
            :interaction="() => regulateInteraction(drawType)"
            :icon="drawIcons[drawType]"
        />
    </div>
</template>

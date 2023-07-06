<script>
import drawInteractions from "@masterportal/masterportalapi/src/maps/interactions/drawInteractions";
import {mapActions, mapGetters} from "vuex";

import IconButton from "../../buttons/components/IconButton.vue";

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

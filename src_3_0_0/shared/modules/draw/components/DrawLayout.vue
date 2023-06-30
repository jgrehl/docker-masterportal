<script>
import {convertColor} from "../../../js/utils/convertColor";

export default {
    name: "DrawLayout",
    props: {
        circleType: {
            type: String,
            default () {
                return "innerCircle";
            }
        },
        currentLayout: {
            type: Object,
            required: true
        },
        selectedDrawType: {
            type: String,
            required: true
        },
        setCurrentLayout: {
            type: Function,
            required: true
        },
        strokeRange: {
            type: Array,
            default () {
                return [1, 32];
            }
        }
    },
    data () {
        return {
            mappingLayout: {
                fillColor: {
                    drawTypes: ["box", "circle", "doubleCircle", "point", "polygon"],
                    icon: "bi-paint-bucket"
                },
                strokeColor: {
                    drawTypes: ["box", "circle", "doubleCircle", "line", "pen", "point", "polygon"],
                    icon: "bi-pencil-fill"
                },
                strokeWidth: {
                    drawTypes: ["box", "circle", "doubleCircle", "line", "pen", "point", "polygon"],
                    icon: "bi-border-width"
                },
                fillTransparency: {
                    drawTypes: ["box", "circle", "doubleCircle", "point", "polygon"],
                    icon: "bi-droplet-half"
                }
            },
            activeLayoutKey: null
        };
    },
    computed: {
        /**
         * Return the mapping layout filtered by selected draw type.
         * @returns {Object} The mapping layout for selected draw type.
         */
        mappingLayoutBySelectedDrawType () {
            const filteredMappingLayout = {};

            Object.keys(this.mappingLayout).forEach(layout => {
                if (this.mappingLayout[layout]?.drawTypes?.includes(this.selectedDrawType)) {
                    filteredMappingLayout[layout] = this.mappingLayout[layout];
                }
            });

            return filteredMappingLayout;
        }
    },
    methods: {
        convertColor,

        /**
         * Sets the active layoutKey.
         * @param {String} layoutKey The key of layout element.
         * @returns {void}
         */
        setActiveLayoutKey (layoutKey) {
            this.activeLayoutKey = this.activeLayoutKey !== layoutKey ? layoutKey : null;
        },

        /**
         * Update tzhe current layout.
         * @param {String} layoutKey The key of layout element.
         * @param {String} value The value to be set.
         * @returns {void}
         */
        updateCurrentLayout (layoutKey, value) {
            const currentLayout = {...this.currentLayout};

            if (layoutKey === "fillColor" || layoutKey === "strokeColor") {
                currentLayout[layoutKey] = convertColor(value, "rgb");
            }
            else {
                currentLayout[layoutKey] = value;
            }

            this.setCurrentLayout(currentLayout);
        }
    }
};
</script>

<template>
    <div class="d-flex flex-column justify-content-around">
        <div class="d-flex flex-row align-items-center justify-content-around mb-4">
            <button
                v-if="selectedDrawType === 'doubleCircle'"
                :id="'draw-layout-' + circleType"
                class="btn btn-light"
                type="button"
                disabled="true"
            >
                <i
                    :class="[circleType, 'bi-circle']"
                    role="img"
                />
            </button>
            <button
                v-for="layoutKey in Object.keys(mappingLayoutBySelectedDrawType)"
                :id="'draw-layout' + circleType + '-' + layoutKey"
                :key="layoutKey"
                tabindex="0"
                class="btn btn-light"
                type="button"
                :aria-label="$t('common:shared.modules.draw.drawLayout.' + layoutKey)"
                :title="$t('common:shared.modules.draw.drawLayout.' + layoutKey)"
                @click="setActiveLayoutKey(layoutKey)"
            >
                <label
                    v-if="layoutKey === 'fillColor' || layoutKey === 'strokeColor'"
                    :for="'color-picker-' + circleType + '-' + layoutKey"
                >
                    <i
                        :class="mappingLayout[layoutKey].icon"
                        role="img"
                    />
                    <input
                        :id="'color-picker-' + circleType + '-' + layoutKey"
                        type="color"
                        :value="convertColor(currentLayout[layoutKey], 'hex')"
                        @input="event => updateCurrentLayout(layoutKey, event.target.value)"
                    >
                </label>
                <label
                    v-else-if="layoutKey === 'fillTransparency'"
                    :for="'text-fill-transparency-' + circleType + '-' + layoutKey"
                >
                    <i
                        :class="mappingLayout[layoutKey].icon"
                        role="img"
                    />
                    <input
                        :id="'text-fill-transparency-' + circleType + '-' + layoutKey"
                        type="text"
                        :title="`${currentLayout[layoutKey]}%`"
                        :value="`${currentLayout[layoutKey]}%`"
                        disabled="true"
                        @click="showTransparency = !showTransparency"
                    >
                </label>
                <label
                    v-else-if="layoutKey === 'strokeWidth'"
                    :for="'text-stroke-width-' + circleType + '-' + layoutKey"
                >
                    <i
                        :class="mappingLayout[layoutKey].icon"
                        role="img"
                    />
                    <input
                        :id="'text-stroke-width-' + circleType + '-' + layoutKey"
                        type="text"
                        :title="`${currentLayout[layoutKey]}px`"
                        :value="`${currentLayout[layoutKey]}px`"
                        disabled="true"
                        @click="showStrokeWidth = !showStrokeWidth"
                    >
                </label>
            </button>
        </div>
        <div
            v-if="activeLayoutKey === 'strokeWidth'"
            class="d-flex mb-4"
        >
            <input
                :id="'slider-stroke-width-' + circleType"
                class="mx-3"
                type="range"
                :title="`${currentLayout.strokeWidth}px`"
                :value="currentLayout.strokeWidth"
                :min="strokeRange[0]"
                :max="strokeRange[1]"
                step="1"
                @input="event => updateCurrentLayout('strokeWidth', event.target.value)"
            >
            <label
                :for="'slider-stroke-width-' + circleType"
            >
                {{ `${currentLayout.strokeWidth}px` }}
            </label>
        </div>
        <div
            v-else-if="activeLayoutKey === 'fillTransparency'"
            class="d-flex mb-4"
        >
            <input
                :id="'slider-fill-transparency-' + circleType"
                class="mx-3"
                type="range"
                :title="`${currentLayout.fillTransparency}%`"
                :value="currentLayout.fillTransparency"
                min="0"
                max="100"
                step="1"
                @input="event => updateCurrentLayout('fillTransparency', event.target.value)"
            >
            <label
                :for="'slider-fill-transparency-' + circleType"
            >
                {{ `${currentLayout.fillTransparency}%` }}
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~mixins";

.btn {
    width: 2.5rem;
    height: 2.5rem;
    position: sticky;
    text-align: center;
    top: auto;
    font-size: 1.5rem;
    border-radius: 50%;
    border: solid $white 1px;
    /* position label in center of button */
    > label {
        position: absolute;
        cursor: pointer;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1.5rem;
    }
}

.btn:disabled {
    opacity: 1;

    > i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    > i.innerCircle {
        font-size: 1.2rem;
    }
}

input {
    cursor: pointer;
    border: none;
}

input[type="text"] {
    font-size: 1rem;
    width: 3rem;
    text-align: center;
}

input[type="color"] {
    height: 0.75rem;
    width: 2.7rem;
}

input[type="range"] {
    accent-color: $secondary;
    width: 100%
}

</style>

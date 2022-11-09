<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import upperFirst from "../../../shared/js/utils/upperFirst";
import isModuleVisible from "../../../shared/js/utils/isModuleVisible";

/**
 * Control layout component that places controls on the map.
 */
export default {
    name: "ControlBar",
    data () {
        return {
            categorizedControls: {
                initialVisible: [],
                expandable: []
            }
        };
    },
    computed: {
        ...mapGetters(["controlsConfig", "deviceMode", "uiStyle"]),
        ...mapGetters("Controls", ["activatedExpandable", "componentMap"]),
        ...mapGetters("Maps", ["mode"])
    },
    watch: {
        /**
         * Watch the controlsConfig and update the categorizedControls.
         * @param {Object} controlsConfig Controls as configured in config.json.
         * @returns {void}
         */
        controlsConfig (controlsConfig) {
            this.categorizedControls.initialVisible = [];
            this.categorizedControls.expandable = [];

            this.initializeControls(controlsConfig);
        }
    },
    mounted () {
        this.initializeControls(this.controlsConfig);
    },
    methods: {
        ...mapActions("Controls", ["mergeControlState"]),
        ...mapMutations("Controls", ["setActivatedExpandable"]),

        /**
         * Initialize the controls.
         * @param {Object} controlsConfig Controls as configured in config.json.
         * @returns {void}
         */
        initializeControls (controlsConfig) {
            if (!this.isSimpleStyle()) {
                this.prepareControls(controlsConfig);

                if (controlsConfig?.expandable) {
                    this.prepareControls(controlsConfig.expandable, true);
                }
            }
        },

        /**
         * Checks if uiStyle is "SIMPLE":
         * @returns {Boolean} Is ui style simple
         */
        isSimpleStyle () {
            return this.uiStyle === "SIMPLE";
        },

        /**
         * Prepares the configured tools to be the right component form.
         * @param {Object} controlsConfig Controls as configured in config.json.
         * @param {Boolean} [expandable=true] Indicates whether controls are extensible
         * @returns {void}
         */
        prepareControls (controlsConfig, expandable = false) {
            Object.keys(controlsConfig).forEach(controlKey => {
                if (this.componentMap[controlKey]) {
                    const controlValues = controlsConfig[controlKey];

                    if (controlValues === true) {
                        this.fillCategorizedControls(controlKey, expandable);
                    }
                    else if (typeof controlValues === "object" && controlKey !== "expandable") {
                        this.mergeControlState({controlKey, controlValues});
                        this.fillCategorizedControls(controlKey, expandable);
                    }
                }
            });
        },

        /**
         * Fills the attribute categorizedControls with controls.
         * @param {String} controlKey The key of the control.
         * @param {Boolean} expandable Indicates whether controls are extensible
         * @returns {void}
         */
        fillCategorizedControls (controlKey, expandable) {
            const control = {
                component: this.componentMap[controlKey],
                key: controlKey
            };

            if (expandable) {
                this.categorizedControls.expandable.push(control);
            }
            else {
                this.categorizedControls.initialVisible.push(control);
            }
        },

        /**
         * Checks if the control is to be applied in the map- and device mode.
         * @param {String} key The key of the control.
         * @returns {Boolean} The control is shown.
         */
        checkIsVisible (key) {
            const supportedMapModes = this.$store.getters[`Controls/${upperFirst(key)}/supportedMapModes`],
                supportedDevices = this.$store.getters[`Controls/${upperFirst(key)}/supportedDevices`];

            return isModuleVisible(this.mode, this.deviceMode, supportedMapModes, supportedDevices);
        }
    }
};
</script>

<template>
    <div
        class="btn-group-vertical m-5 btn-group-controls shadow"
        role="group"
    >
        <div
            v-for="(control, index) in categorizedControls.initialVisible"
            :key="index"
        >
            <component
                :is="control.component"
                v-if="checkIsVisible(control.key)"
                :key="control.key"
                v-bind="control.props"
            />
        </div>
        <div v-if="categorizedControls.expandable.length >= 1">
            <hr>
            <div
                class="btn-group-vertical"
                role="group"
            >
                <div v-if="activatedExpandable">
                    <div
                        v-for="(control, index) in categorizedControls.expandable"
                        :key="index"
                    >
                        <component
                            :is="control.component"
                            v-if="checkIsVisible(control.key)"
                            :key="control.key"
                            v-bind="control.props"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    class="control-icon-controls bootstrap-icon my-2 control-button-controls"
                    @click="setActivatedExpandable(!activatedExpandable)"
                >
                    <i class="bi-three-dots" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .btn-group-controls {
        display: none;
        background-color: $white;
        border: solid $white 4px;
        border-radius: 25px;
        position: absolute;
        bottom: 0;
    }

    .control-button-controls {
        display: block;
        text-align: center;
        top: auto;

        font-size: calc(#{$icon_length} - 0.35 * #{$icon_length});
        height: $icon_length;
        width: $icon_length;
    }

    .control-icon-controls {
        background-color: $primary;
        color: $black;

        pointer-events: all;
        cursor: pointer;
        border: solid $white 1px;
        border-radius: 50%;

        /* position icon in center of button */
        > i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            // adjust line-height to use same height as ::before Element
            line-height: 0;
        }

        > p {
            color: $black;
            font-family: $font_family_accent;
            font-size: 17px;
            padding: .25rem 0 0 0
        }

        /* pseudo-class state effects */
        &:hover {
            background-color: darken($primary, 10%);
            border-color: $white;
        }
        &:focus {
            background-color: darken($primary, 15%);
            outline: 1px solid darken($primary, 15%);
            border-color: $white;
        }
        &:checked {
            border-color: $white;
        }
        &:active {
            background-color: darken($primary, 5%);
            border-color: $white;
        }

        &:disabled {
            background-color: $light-grey;
            color: $dark_grey;
            cursor: default;
            border-color: $white;
        }
    }

    @include media-breakpoint-up(sm) {
        .btn-group-controls {
            display: block;
        }
    }
</style>

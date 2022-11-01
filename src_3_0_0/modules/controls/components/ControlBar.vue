<script>
import {mapGetters} from "vuex";

/**
 * Control layout component that places controls on the map.
 */
export default {
    name: "ControlBar",
    data () {
        return {
            activatedExpandable: false,
            categorizedControls: {
                sidebar: [],
                expandable: []
            }
        };
    },
    computed: {
        ...mapGetters(["controlsConfig", "isMobile", "uiStyle"]),
        ...mapGetters("Controls", ["componentMap", "mobileHiddenControls", "expandableControls"])
    },
    mounted () {
        if (this.controlsConfig?.expandable) {
            Object.keys(this.controlsConfig.expandable).forEach(control => {
                this.expandableControls.push(control);
            });
            this.prepareControls(this.controlsConfig.expandable);
            delete this.controlsConfig.expandable;
        }
        this.prepareControls(this.controlsConfig);
    },
    methods: {
        /**
         * @param {String} componentName name of the control as noted in config.json
         * @returns {Boolean} true if control should be hidden in mobile screen width
         */
        hiddenMobile (componentName) {
            return this.mobileHiddenControls.includes(componentName);
        },
        hiddenMobileIsExpandable () {
            return this.expandableControls.every(element => this.mobileHiddenControls.includes(element));
        },
        isSimpleStyle () {
            return this.uiStyle === "SIMPLE";
        },
        toggleExpandable () {
            this.activatedExpandable = !this.activatedExpandable;
        },
        /**
         * prepares the configured tools to be the right component form
         * @param {Object} configuredControls controls as configured in config.json
         * @returns {void}
         */
        prepareControls (configuredControls) {
            this.$controlAddons?.forEach(controlName => {
                const addonControlConfig = configuredControls[controlName];

                if (addonControlConfig) {
                    if (addonControlConfig.hiddenMobile) {
                        this.mobileHiddenControls.push(controlName);
                    }
                    if (addonControlConfig.expandableControl) {
                        this.expandableControls.push(controlName);
                    }
                }
            }, this);

            Object
                .keys(configuredControls)
                .filter(key => configuredControls[key])
                .map(key => {
                    if (this.componentMap[key]) {
                        return {
                            component: this.componentMap[key],
                            props: typeof configuredControls[key] === "object" ? configuredControls[key] : {},
                            key
                        };
                    }
                    return key;
                })
                .filter(x => x !== "mousePosition") // "mousePosition" is currently handled in footer
                .forEach(c => {
                    if (this.expandableControls.includes(c.key)) {
                        this.categorizedControls.expandable.push(c);
                        if (configuredControls[c.key]?.hiddenMobile === true) {
                            this.mobileHiddenControls.push(c.key);
                        }
                    }
                    else {
                        // defaulting to sidebar
                        this.categorizedControls.sidebar.push(c);
                        if (configuredControls[c.key]?.hiddenMobile === true) {
                            this.mobileHiddenControls.push(c.key);
                        }
                    }
                });
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
            v-for="(control, index) in categorizedControls['sidebar']"
            :key="index"
        >
            <component
                :is="control.component"
                :key="control.key"
                :class="[
                    isMobile && hiddenMobile(control.key) ? 'd-none' : '',
                ]"
                v-bind="control.props"
            />
        </div>
        <div v-if="expandableControls.length >= 1">
            <hr>
            <div
                class="btn-group-vertical"
                role="group"
            >
                <div v-if="activatedExpandable">
                    <div
                        v-for="(control, index) in categorizedControls['expandable']"
                        :key="index"
                    >
                        <component
                            :is="control.component"
                            :key="control.key"
                            :class="[
                                isMobile && hiddenMobile(control.key) ? 'd-none' : ''
                            ]"
                            v-bind="control.props"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    class="control-icon-controls bootstrap-icon my-2 control-button-controls"
                    @click="toggleExpandable"
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
</style>

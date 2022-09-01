<script>
import {mapGetters} from "vuex";

const fallbackTopRight = {
        key: "top-right-fallback",
        fallback: true
    },
    fallbackBottomRight = {
        key: "bottom-right-fallback",
        fallback: true
    };

/* TODO
 * This was the planned concept:
 * 1. scrollable if too many controls are included within
 * 2. open-/closable on mobile resolution, that is: only x (per default 3) control
 * controls are to be shown, and the rest can be opened/closed via a button
 * (think: openable toolbox); when open and place is not sufficient, the bar
 * is to be scrollable again
 *
 * However, positioning is currently in discussion, and a separate ticket
 * was made regarding the creation of a control concept. Stopping above implementation
 * in favour of stability until concept is ready.
 */

/**
 * Control layout component that places controls on the map.
 */
export default {
    name: "ControlBar",
    data () {
        return {
            categories: [
                {categoryName: "top", className: "top-controls"},
                {categoryName: "separator", className: "control-separator"},
                {categoryName: "bottom", className: "bottom-controls"}
            ]
        };
    },
    computed: {
        ...mapGetters(["controlsConfig", "isMobile", "uiStyle"]),
        ...mapGetters("Controls", ["componentMap", "mobileHiddenControls", "bottomControls"]),
        /** @returns {Object} contains controls to-be-rendered sorted by placement */
        categorizedControls () {
            const categorizedControls = {
                top: [],
                bottom: []
            };

            if (this.controlsConfig === null) {
                return {
                    top: [fallbackTopRight],
                    bottom: [fallbackBottomRight]
                };
            }

            this.$controlAddons.forEach(controlName => {
                const addonControlConfig = this.controlsConfig[controlName];

                if (addonControlConfig) {
                    if (addonControlConfig.hiddenMobile) {
                        this.mobileHiddenControls.push(controlName);
                    }
                    if (addonControlConfig.bottomControl) {
                        this.bottomControls.push(controlName);
                    }
                }
            }, this);

            Object
                .keys(this.controlsConfig)
                .filter(key => this.controlsConfig[key])
                .map(key => {
                    if (this.componentMap[key]) {
                        return {
                            component: this.componentMap[key],
                            props: typeof this.controlsConfig[key] === "object" ? this.controlsConfig[key] : {},
                            key
                        };
                    }
                    return key;
                })
                .filter(x => x !== "mousePosition") // "mousePosition" is currently handled in footer
                .forEach(c => {
                    if (this.bottomControls.includes(c.key)) {
                        categorizedControls.bottom.push(c);
                    }
                    else {
                        // defaulting to top-right corner
                        categorizedControls.top.push(c);
                    }
                });

            categorizedControls.top.push(fallbackTopRight);
            categorizedControls.bottom.unshift(fallbackBottomRight);

            return categorizedControls;
        }
    },
    methods: {
        /**
         * @param {String} componentName name of the control as noted in config.json
         * @returns {Boolean} true if control should be hidden in mobile screen width
         */
        hiddenMobile (componentName) {
            return this.mobileHiddenControls.includes(componentName);
        },
        isSimpleStyle () {
            return this.uiStyle === "SIMPLE";
        }
    }
};
</script>

<template>
    <ul
        v-if="!isSimpleStyle()"
        class="right-bar"
    >
        <template v-for="({categoryName, className}, categoryIndex) in categories">
            <li
                v-if="categoryName === 'separator'"
                :key="categoryIndex"
                :class="className"
                aria-hidden="true"
            />
            <template
                v-for="(control, index) in categorizedControls[categoryName]"
                v-else
            >
                <li
                    :key="`${categoryIndex}-${index}`"
                >
                    <component
                        :is="control.component"
                        :key="control.key"
                        :class="[
                            index !== categorizedControls[categoryName].length - 1 ? 'spaced' : '',
                            isMobile && hiddenMobile(control.key) ? 'hidden' : '',
                            className
                        ]"
                        v-bind="control.props"
                    />
                </li>
            </template>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .right-bar {
        pointer-events: none;

        padding: 5px;
        margin: 5px 5px 12px 5px;

        display: flex;
        flex-direction: column;

        list-style-type: none;

        .control-separator {
            flex-grow: 1;
        }

        .hidden {
            display: none;
        }

        .spaced {
            margin-bottom: 0.5em;
        }

        .top-controls, .bottom-controls {
            pointer-events: all;
        }
    }
</style>

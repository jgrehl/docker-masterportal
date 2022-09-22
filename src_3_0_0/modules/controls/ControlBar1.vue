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

/**
 * Control layout component that places controls on the map.
 */
export default {
    name: "ControlBar1",
    data () {
        return {
            categories: [
                {categoryName: "sidebar"},
                {categoryName: "menu"}
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
    <div
        class="btn-group-vertical m-5 btn-group-controls"
        role="group"
    >
        <!-- v-if="categories.categoryName === 'sidebar'" -->
        <div
            v-for="(control, index) in categorizedControls['top']"
            :key="index"
        >
            <component
                :is="control.component"
                :key="control.key"
                :class="[
                    isMobile && hiddenMobile(control.key) ? 'hidden' : '',
                ]"
                v-bind="control.props"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .btn-control {
        background-color: $white;
    }

    .btn-group-controls {
        background-color: $white;
        border: solid $white 4px;
        border-radius: 25px;
    }
</style>

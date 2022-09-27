<script>
import {mapGetters} from "vuex";
import {Popover} from "bootstrap";

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
        ...mapGetters("Controls", ["componentMap", "mobileHiddenControls", "menuControls"]),
        /** @returns {Object} contains controls to-be-rendered sorted by placement */
        categorizedControls () {
            const categorizedControls = {
                sidebar: [],
                menu: []
            };

            this.$controlAddons.forEach(controlName => {
                const addonControlConfig = this.controlsConfig[controlName];

                if (addonControlConfig) {
                    if (addonControlConfig.hiddenMobile) {
                        this.mobileHiddenControls.push(controlName);
                    }
                    if (addonControlConfig.menuControl) {
                        this.menuControls.push(controlName);
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
                    if (this.menuControls.includes(c.key)) {
                        categorizedControls.menu.push(c);
                    }
                    else {
                        // defaulting to top-right corner
                        categorizedControls.sidebar.push(c);
                    }
                });

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
        },
        hasMenuControls () {
            console.log(this.menuControls.lenght);
            return this.menuControls.lenght >= 1;
        }
    }
};
</script>

<template>
    <div
        class="btn-group-vertical m-5 btn-group-controls"
        role="group"
    >
        <!-- sidebar -->
        <div
            v-for="(control, index) in categorizedControls['sidebar']"
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
        <div v-if="menuControls.length >= 1">
            <hr>
            <div
                class="btn-group"
                role="group"
            >
                <button
                    type="button"
                    class="control-icon bootstrap-icon btn my-2 standalone dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i class="bi-three-dots" />
                </button>
                <div
                    v-for="(control, index) in categorizedControls['menu']"
                    :key="index"
                    class="dropdown-menu"
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
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .btn-group-controls {
        background-color: $white;
        border: solid $white 4px;
        border-radius: 25px;
    }
</style>

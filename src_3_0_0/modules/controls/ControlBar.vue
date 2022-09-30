<script>
import {mapGetters} from "vuex";

/**
 * Control layout component that places controls on the map.
 */
export default {
    name: "ControlBar",
    data () {
        return {
            activatedMenu: false,
            categorizedControls: {
                sidebar: [],
                menu: []
            }
        };
    },
    computed: {
        ...mapGetters(["controlsConfig", "isMobile", "uiStyle"]),
        ...mapGetters("Controls", ["componentMap", "mobileHiddenControls", "menuControls"])
    },
    mounted () {
        if (this.controlsConfig.expandable) {
            Object.keys(this.controlsConfig.expandable).forEach(control => {
                this.menuControls.push(control);
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
        hiddenMobileIsMenu () {
            return this.menuControls.every(element => this.mobileHiddenControls.includes(element));
        },
        isSimpleStyle () {
            return this.uiStyle === "SIMPLE";
        },
        toggleMenu () {
            this.activatedMenu = !this.activatedMenu;
        },
        prepareControls (configuredControls) {
            this.$controlAddons?.forEach(controlName => {
                const addonControlConfig = configuredControls[controlName];

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
                    if (this.menuControls.includes(c.key)) {
                        this.categorizedControls.menu.push(c);
                        if (configuredControls[c.key].hiddenMobile === true) {
                            this.mobileHiddenControls.push(c.key);
                        }
                    }
                    else {
                        // defaulting to sidebar
                        this.categorizedControls.sidebar.push(c);
                        if (configuredControls[c.key].hiddenMobile === true) {
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
        <div v-if="menuControls.length >= 1">
            <hr>
            <div
                class="btn-group-vertical"
                role="group"
            >
                <div v-if="activatedMenu">
                    <div
                        v-for="(control, index) in categorizedControls['menu']"
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
                    class="control-icon bootstrap-icon my-2 standalone"
                    @click="toggleMenu"
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
</style>

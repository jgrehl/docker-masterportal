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
    <div
        class="btn-group-vertical m-5"
        role="group"
    >
        <div
            v-for="({categoryName, className}, categoryIndex) in categories"
            :key="categoryIndex"
        >
            <li
                v-if="categoryName === 'separator'"
                :key="categoryIndex"
                :class="className"
                aria-hidden="true"
            />
            <div
                v-for="(control, index) in categorizedControls[categoryName]"
                v-else
                :key="index"
            >
                <button
                    type="button"
                    class="btn btn-control"
                >
                    {{ control }}
                </button>
            </div>
            <div
                class="btn-group"
                role="group"
            >
                <button
                    type="button"
                    class="btn btn-control dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Dropdown
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                        >Dropdown link</a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                        >Dropdown link</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .btn-control {
        background-color: $white;
    }
</style>

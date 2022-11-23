<script>
import {mapActions, mapGetters} from "vuex";
import ControlIcon from "../../components/ControlIcon.vue";
import upperFirst from "../../../../shared/js/utils/upperFirst";

export default {
    name: "StartModule",
    components: {
        ControlIcon
    },
    data () {
        return {
            configuredModuleStates: []
        };
    },
    computed: {
        ...mapGetters("Controls/StartModule", ["mainMenu", "secondaryMenu"]),

        component () {
            return ControlIcon;
        }
    },
    created () {
        this.getModuleStates(this.mainMenu, "mainMenu");
        this.getModuleStates(this.secondaryMenu, "secondaryMenu");
    },
    methods: {
        ...mapActions("Menu", ["activateMenuNavigation", "resetMenu"]),

        /**
         * Gets the module state.
         * @param {Object[]} configuredModules The configured modules.
         * @param {String} menuSide The menu side.
         * @returns {void}
         */
        getModuleStates (configuredModules, menuSide) {
            configuredModules.forEach(module => {
                if (module?.type) {
                    this.extendModuleState(module, menuSide);
                    this.configuredModuleStates.push({
                        menuSide: menuSide,
                        state: this.$store.state.Modules[upperFirst(module.type)]
                    });
                }
            });
        },

        /**
         * Add attributes to module state, because to show in menu.
         * @param {Object} module The module.
         * @param {String} menuSide The menu side.
         * @returns {void}
         */
        extendModuleState (module, menuSide) {
            this.$store.state.Modules[upperFirst(module.type)] = {
                ...this.$store.state.Modules[upperFirst(module.type)],
                ...{
                    alwaysActivated: true,
                    isVisibleInMenu: false,
                    menuSide: menuSide
                },
                ...module
            };
        },

        /**
         * Activates or deactivates the associated module of the clicked control.
         * @param {Object} moduleState The vuex states the clicked module-control.
         * @param {String} menuSide The menu side.
         * @returns {void}
         */
        onClick (moduleState, menuSide) {
            this.resetMenu({side: menuSide, module: {type: upperFirst(moduleState.type)}});

            if (!moduleState.active) {
                this.activateMenuNavigation({side: menuSide, module: {type: upperFirst(moduleState.type)}});
            }

            this.$store.commit(`Modules/${upperFirst(moduleState.type)}/setActive`, !moduleState.active);
        }
    }
};
</script>

<template>
    <div id="start-module-button">
        <template v-for="configuredModule in configuredModuleStates">
            <component
                :is="component"
                :key="'control-module-' + configuredModule.state.type"
                :icon-name="configuredModule.state.icon"
                class="control"
                :title="$t(configuredModule.state.name)"
                :disabled="false"
                :on-click="() => onClick(configuredModule.state, configuredModule.menuSide)"
            />
        </template>
    </div>
</template>

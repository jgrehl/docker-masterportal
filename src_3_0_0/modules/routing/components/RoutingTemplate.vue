<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersRouting";
import actions from "../store/actionsRouting";
import mutations from "../store/mutationsRouting";
import * as constantsRouting from "../store/constantsRouting";
import RoutingLoadingSpinner from "./RoutingLoadingSpinner.vue";
import store from "../../../app-store/index";

export default {
    name: "RoutingTemplate",
    components: {
        RoutingLoadingSpinner
    },
    data () {
        return {
            constantsRouting
        };
    },
    computed: {
        ...mapGetters("Modules/Routing", Object.keys(getters)),
        ...mapGetters("Modules/Routing/Directions", ["isLoadingDirections"]),
        ...mapGetters("Modules/Routing/Isochrones", ["isLoadingIsochrones"]),
        /**
         * Computed value to get the current component for the active tab
         * @returns {Object} vue component to render
         */
        activeRoutingToolOptionComponent () {
            return this.filteredRoutingToolOptions.find(option => option.id === this.activeRoutingToolOption)?.component;
        }
    },
    async created () {
        await this.initRouting();
    },
    destroyed () {
        store.dispatch("Modules/Routing/Isochrones/closeIsochrones");
        store.dispatch("Modules/Routing/Directions/closeDirections");
    },
    methods: {
        ...mapMutations("Modules/Routing", Object.keys(mutations)),
        ...mapActions("Modules/Routing", Object.keys(actions)),
        /**
         * Changes the active tab
         * Will not change the tab if a batch process is running
         * @param {String} option to change to
         * @returns {void}
         */
        changeActiveRoutingToolOption (option) {
            if (this.taskHandler) {
                return;
            }
            this.setActiveRoutingToolOption(option);
        },
        /**
         * Toggles the quickHelp module with the routing option
         * @returns {void}
         */
        toggleHelp () {
            if (!store.getters["QuickHelp/active"]) {
                store.commit("QuickHelp/setQuickHelpKey", "routing");
                store.commit("QuickHelp/setActive", true);
            }
            else {
                store.commit("QuickHelp/setActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <div id="#toolBody">
        <div
            v-if="active"
            id="routing"
        >
            <div
                class="d-flex"
            >
                <div
                    v-for="routingToolOption of filteredRoutingToolOptions"
                    :key="routingToolOption.id"
                    :style="{
                        width: `calc(100% / ${filteredRoutingToolOptions.length})`,
                    }"
                    :class="[
                        'routingtooltab d-flex justify-content-center py-3 pointer',
                        activeRoutingToolOption === routingToolOption.id ? 'active' : '',
                    ]"
                    @click="changeActiveRoutingToolOption(routingToolOption.id)"
                    @keydown.enter="changeActiveRoutingToolOption(routingToolOption.id)"
                >
                    <span class="bootstrap-icon">
                        <i class="bi-three-dots-vertical" />
                    </span>
                    <span>{{ $t("common:modules.tools.routing.tabs." + routingToolOption.id) }}</span>
                    <RoutingLoadingSpinner
                        v-if="(routingToolOption.id === 'DIRECTIONS' && isLoadingDirections) || (routingToolOption.id === 'ISOCHRONES' && isLoadingIsochrones)"
                        class="ms-2"
                    />
                </div>

                <div
                    class="d-flex flex-column justify-content-center ms-2"
                    :title="$t('common:modules.tools.routing.helpTooltip')"
                    @click="toggleHelp()"
                    @keydown.enter="toggleHelp()"
                >
                    <span class="bootstrap-icon">
                        <i class="bi-question-circle-fill" />
                    </span>
                </div>
            </div>


            <hr>

            <component :is="activeRoutingToolOptionComponent" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.pointer {
  cursor: pointer;
}
.routingtooltab.active {
  background: #dbdbdb;
}
.bi-question-circle-fill {
    font-size: $font_size_huge;
}
</style>

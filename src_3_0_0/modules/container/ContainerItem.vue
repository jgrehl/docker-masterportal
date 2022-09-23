<script>
import {mapGetters} from "vuex";
import moduleCollection from "../../core/modules/moduleCollection";

/**
 * Only for testing modules until the menu is ready!
 */
export default {
    name: "ContainerItem",
    data () {
        return {
            configuredModules: []
        };
    },
    computed: {
        ...mapGetters(["allConfigsLoaded"])
    },
    watch: {
        allConfigsLoaded (value) {
            if (value) {
                this.configuredModules = moduleCollection.getConfiguredModuleComponentsByNavigation("navigationSecondary");
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="configuredModules.length > 0"
        id="offcanvasRight"
        class="offcanvas show offcanvas-end"
        tabindex="-1"
        aria-labelledby="offcanvasRightLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="offcanvasRightLabel"
                class="offcanvas-title"
            >
                {{ configuredModules[0].name }}
            </h5>
        </div>
        <div class="offcanvas-body">
            <component
                :is="configuredModules[0]"
                :key="configuredModules[0].name"
            />
        </div>
    </div>
</template>

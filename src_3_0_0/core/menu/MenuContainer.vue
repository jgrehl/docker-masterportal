<script>
import {mapGetters, mapMutations} from "vuex";
import PortalTitle from "./portalTitle/components/PortalTitle.vue";
import MenuNavigation from "./navigation/components/MenuNavigation.vue";
import ResizeHandle from "../../sharedComponents/ResizeHandle.vue";

export default {
    name: "MenuContainer",
    components: {
        PortalTitle,
        MenuNavigation,
        ResizeHandle
    },
    data () {
        return {
            menuItems: []
        };
    },
    computed: {
        ...mapGetters("Menu", ["componentMap", "configuration"]),
        ...mapGetters("MenuNavigation", ["lastEntry"]),
        ...mapGetters(["isMobile", "portalConfig"]),
        activeMenuItem () {
            return this.menuItems.find(menuItem => menuItem.key === this.lastEntry);
        }
    },
    // watch: {
    // },
    mounted () {
        this.loadMenuItems();
    },
    methods: {
        ...mapMutations("MenuNavigation", ["removeLastEntry", "addEntry"]),
        loadMenuItems () {
            Object
                .keys(this.configuration)
                .forEach(key => {
                    if (this.componentMap[key] && typeof this.configuration[key] === "object" && this.configuration[key].title) {
                        this.menuItems.push({
                            component: this.componentMap[key],
                            props: this.configuration[key],
                            key
                        });
                    }
                });
        },
        removeShowClass () {
            document.getElementById("menu-offcanvas")?.classList.remove("show");
        }
    }
};
</script>

<template>
    <div
        id="menu-offcanvas"
        class="offcanvas offcanvas-start"
        :class="{
            show: configuration.initiallyOpen,
            fullWidthCanvas: isMobile
        }"
        tabindex="-1"
        aria-labelledby="offcanvasLabel"
        data-bs-scroll="true"
        data-bs-backdrop="false"
    >
        <div class="offcanvas-header">
            <PortalTitle
                v-if="portalConfig.portalTitle"
                v-bind="portalConfig.portalTitle"
            />
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                :aria-label="$t('common:menu.ariaLabelClose')"
                @click="removeShowClass"
            />
        </div>
        <div class="offcanvas-body">
            <MenuNavigation ref="menuNavigation" />

            <div v-if="!lastEntry">
                <!-- TODO: ESLint: Visible, non-interactive elements with click handlers must have at least one keyboard listener.(vuejs-accessibility/click-events-have-key-events) -->
                <!-- eslint-disable-next-line -->
                <a
                    v-for="comp in menuItems"
                    :key="comp.key"
                    @click="addEntry(comp.key)"
                >
                    {{ comp.props.title }}
                </a>
            </div>
            <component
                :is="activeMenuItem.component"
                v-bind="activeMenuItem.props"
                v-if="lastEntry"
            />
        </div>
        <ResizeHandle
            v-if="!isMobile"
            id="menuContainerHandle"
            handle-position="r"
            :min-width="0.1"
            :max-width="0.5"
        >
            <div>&#8942;</div>
        </ResizeHandle>
    </div>
</template>

<style lang="scss" scoped>
.fullWidthCanvas {
    width: 100%;
}
#menuContainerHandle {
    width: 12px;

    & > div {
        position: absolute;
        top: 50%;
        left: 4px;
    }
}
</style>

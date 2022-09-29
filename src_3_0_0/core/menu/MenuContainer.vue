<script>
import {mapGetters} from "vuex";
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
            menuItems: [],
            activeComp: null
        };
    },
    computed: {
        ...mapGetters("Menu", ["componentMap"]),
        ...mapGetters(["portalConfig"]),
        activeComponent: {
            get () {
                return this.activeComp;
            },
            set (value) {
                this.activeComp = value;
            }
        }
    },
    // watch: {
    //     allConfigsLoaded (value) {
    //         if (value) {
    //             this.menuItems = [];
    //
    //         }
    //     }
    // },
    mounted () {
        this.loadMenuItems();
    },
    methods: {
        loadMenuItems () {
            Object
                .keys(this.portalConfig)
                .forEach(key => {
                    if (this.componentMap[key] && typeof this.portalConfig[key] === "object" && this.portalConfig[key].title) {
                        this.menuItems.push({
                            component: this.componentMap[key],
                            props: this.portalConfig[key],
                            key
                        });
                    }
                });
        },
        activateMenuItem (compKey) {
            this.activeComponent = this.menuItems.find(menuItem => menuItem.key === compKey);
            this.$refs.menuNavigation.addEntry(this.activeComponent.props.title);

        }
    }
};
</script>

<template>
    <div
        id="menu-offcanvas"
        class="offcanvas offcanvas-start"
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
            />
        </div>
        <div class="offcanvas-body">
            <MenuNavigation ref="menuNavigation" />

            <div v-if="!activeComponent">
                <a
                    v-for="comp in menuItems"
                    :key="comp.key"
                    @click="activateMenuItem(comp.key)"
                >
                    {{ comp.props.title }}
                </a>
            </div>
            <component
                :is="activeComponent.component"
                v-bind="activeComponent.props"
                v-if="activeComponent"
            />
        </div>
        <ResizeHandle
            id="menuContainerHandle"
            handle-position="r"
            :max-width="0.5"
        >
            <div>&#8942;</div>
        </ResizeHandle>
    </div>
</template>

<style lang="scss" scoped>
#menuContainerHandle {
    width: 12px;

    & > div {
        position: absolute;
        top: 50%;
        left: 4px;
    }
}
</style>

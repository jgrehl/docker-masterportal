<script>
import {mapGetters} from "vuex";
import PortalTitle from "./portalTitle/components/PortalTitle.vue";
import ResizeHandle from "../../sharedComponents/ResizeHandle.vue";

export default {
    name: "MenuContainer",
    components: {
        PortalTitle,
        ResizeHandle
    },
    data () {
        return {
            comps: []
        };
    },
    computed: {
        ...mapGetters("Menu", ["componentMap"]),
        ...mapGetters(["allConfigsLoaded", "portalConfig"])
    },
    watch: {
        allConfigsLoaded (value) {
            if (value) {
                this.comps = [];
                Object
                    .keys(this.portalConfig)
                    .forEach(key => {
                        if (this.componentMap[key]) {
                            this.comps.push({
                                component: this.componentMap[key],
                                props: typeof this.portalConfig[key] === "object" ? this.portalConfig[key] : {},
                                key
                            });
                        }
                    });
            }
        }
    },
    mounted () {
        // console.log(this.comps)
    }
};
</script>

<template>
    <div
        id="menu-offcanvas"
        class="offcanvas offcanvas-start"
        tabindex="-1"
        aria-labelledby="offcanvasLabel"
    >
        <div class="offcanvas-header">
            <PortalTitle />
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                :aria-label="$t('common:menu.ariaLabelClose')"
            />
        </div>
        <div class="offcanvas-body">
            <template
                v-for="(comp) in comps"
            >
                <component
                    :is="comp.component"
                    :key="comp.key"
                    v-bind="comp.props"
                />
            </template>
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

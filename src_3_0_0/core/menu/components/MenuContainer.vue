<script>
import {mapGetters} from "vuex";

export default {
    name: "MenuContainer",
    components: {
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
            <h5
                id="offcanvasLabel"
                class="offcanvas-title"
            >
                {{ $t("common:menu.name") }}
            </h5>
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
    </div>
</template>

<style scoped>

</style>

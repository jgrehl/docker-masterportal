<script>
import {mapGetters} from "vuex";
import PortalTitle from "./portalTitle/components/PortalTitle.vue";

export default {
    name: "MenuContainerHeader",
    components: {
        PortalTitle
    },
    props: {
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["mainTitle", "secondaryTitle"]),
        title () {
            if (this.side === "mainMenu" && this.mainTitle) {
                return this.mainTitle;
            }
            if (this.side === "secondaryMenu" && this.secondaryTitle) {
                return this.mainTitle;
            }
            return null;
        }
    },
    methods: {
        removeShowClass () {
            document.getElementById(`menu-offcanvas-${this.side}`)?.classList.remove("show");
        }
    }
};
</script>

<template>
    <div class="offcanvas-header">
        <PortalTitle
            v-if="title"
            v-bind="title"
        />
        <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            :aria-label="$t('common:menu.ariaLabelClose')"
            @click="removeShowClass"
        />
    </div>
</template>

<style scoped>

</style>

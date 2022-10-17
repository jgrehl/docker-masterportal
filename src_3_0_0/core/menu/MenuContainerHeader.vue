<script>
import {mapGetters} from "vuex";
import MenuContainerHeaderTitle from "./MenuContainerHeaderTitle.vue";

export default {
    name: "MenuContainerHeader",
    components: {
        MenuContainerHeaderTitle
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
                return {...this.mainTitle, idAppendix: this.side};
            }
            if (this.side === "secondaryMenu" && this.secondaryTitle) {
                return {...this.secondaryTitle, idAppendix: this.side};
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
        <MenuContainerHeaderTitle
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

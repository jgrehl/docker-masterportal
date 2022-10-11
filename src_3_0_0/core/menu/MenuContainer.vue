<script>
import {mapGetters} from "vuex";
import ResizeHandle from "../../sharedComponents/ResizeHandle.vue";

export default {
    name: "MenuContainer",
    components: {
        ResizeHandle
    },
    props: {
        side: {
            type: String,
            default: "start",
            validator: value => value === "start" || value === "end"
        }
    },
    computed: {
        ...mapGetters(["isMobile"])
    },
    methods: {
        removeShowClass () {
            document.getElementById("menu-offcanvas")?.classList.remove("show");
        }
    }
};
</script>

<template>
    <div
        :id="'menu-offcanvas-' + side"
        class="offcanvas"
        :class="{
            'offcanvas-start': side === 'start',
            'offcanvas-end': side === 'end',
            fullWidthCanvas: isMobile
        }"
        tabindex="-1"
        aria-labelledby="offcanvasLabel"
        data-bs-scroll="true"
        data-bs-backdrop="false"
    >
        <div class="offcanvas-header">
            <slot name="header" />
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                :aria-label="$t('common:menu.ariaLabelClose')"
                @click="removeShowClass"
            />
        </div>
        <div class="offcanvas-body">
            <slot name="body" />
        </div>
        <ResizeHandle
            v-if="!isMobile"
            class="menuContainerHandle"
            :handle-position="side === 'start' ? 'r' : 'l'"
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
.menuContainerHandle {
    width: 12px;

    & > div {
        position: absolute;
        top: 50%;
        left: 4px;
    }
}
</style>

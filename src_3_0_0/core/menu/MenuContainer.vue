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
        ...mapGetters(["isMobile"]),
        handlePosition () {
            return this.side === "main" ? "r" : "l";
        }
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
            'offcanvas-start': !isMobile && side === 'start',
            'offcanvas-end': !isMobile && side === 'end',
            'offcanvas-bottom': isMobile,
            mobileOffCanvas: isMobile
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
            :class="isMobile ? 'mobileContainerHandle' : 'menuContainerHandle'"
            :handle-position="handlePosition()"
            :min-width="!isMobile ? 0.1 : 1"
            :max-width="!isMobile ? 0.5 : 1"
            :min-height="isMobile ? 0.1 : 1"
            :max-height="isMobile ? 0.5 : 1"
        >
            <div>&#8942;</div>
        </ResizeHandle>
    </div>
</template>

<style lang="scss" scoped>
.menuContainerHandle {
    width: 12px;

    & > div {
        position: absolute;
        top: 50%;
        left: 4px;
    }
}
.mobileContainerHandle {
    height: 12px;

    & > div {
        position: absolute;
        transform: rotate(90deg);
        left: 50%;
        top: -2.5px;
    }
}
.mobileOffCanvas {
    height: 20%;
    width: 100%;
}
</style>

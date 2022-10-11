<script>
import {mapGetters} from "vuex";
import MenuBody from "./MenuBody.vue";
import MenuHeader from "./MenuHeader.vue";
import ResizeHandle from "../../sharedComponents/ResizeHandle.vue";

export default {
    name: "MenuContainer",
    components: {
        MenuBody,
        MenuHeader,
        ResizeHandle
    },
    props: {
        side: {
            type: String,
            default: "main",
            validator: value => value === "main" || value === "secondary"
        }
    },
    computed: {
        ...mapGetters(["isMobile"]),
        handlePosition () {
            return this.side === "main" ? "r" : "l";
        }
    }
};
</script>

<template>
    <div
        :id="'menu-offcanvas-' + side"
        class="offcanvas"
        :class="{
            'offcanvas-start': !isMobile && side === 'main',
            'offcanvas-end': !isMobile && side === 'secondary',
            'offcanvas-bottom': isMobile,
            mobileOffCanvas: isMobile
        }"
        tabindex="-1"
        aria-labelledby="offcanvasLabel"
        data-bs-scroll="true"
        data-bs-backdrop="false"
    >
        <template v-if="isMobile">
            <ResizeHandle
                class="mobile-container-handle"
                handle-position="t"
                :min-height="0.1"
                :max-height="0.5"
            >
                <MenuHeader :side="side" />
            </ResizeHandle>
            <ResizeHandle
                class="mobile-container-handle"
                handle-position="t"
                :min-height="0.1"
                :max-height="0.5"
            >
                <MenuBody :side="side" />
            </ResizeHandle>
        </template>
        <template v-else>
            <MenuHeader :side="side" />
            <MenuBody :side="side" />
            <ResizeHandle
                class="menu-container-handle"
                :handle-position="handlePosition"
                :min-width="0.1"
                :max-width="0.5"
            >
                &#8942;
            </ResizeHandle>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.menu-container-handle {
    display: flex;
    width: 12px;
    align-items: center;
    justify-content: center;
}
.mobile-container-handle {
    position: static;
    width: auto;
    height: auto;
    background-color: transparent;
}
.mobileOffCanvas {
    height: 20%;
    width: 100%;
}
</style>

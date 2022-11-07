<script>
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerHeaderTitle",
    props: {
        /** Appendix set on the id to make it unique. Needed, as the menu can be rendered multiple times. */
        idAppendix: {
            type: String,
            required: true
        },
        /** name text */
        text: {
            type: String,
            required: true
        },
        /** URL of an external website to link to */
        link: {
            type: String,
            default: ""
        },
        /** Path to an external image file */
        logo: {
            type: String,
            default: ""
        },
        /** Shown on hovering the name logo */
        toolTip: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters(["isMobile"])
    }
};
</script>

<template>
    <a
        v-if="!isMobile"
        :id="'menu-offcanvas-header-title-' + idAppendix"
        :href="link ? link : '#'"
        :target="link ? '_blank' : '_self'"
        :data-bs-toggle="text"
        data-bs-placement="bottom"
        :title="toolTip"
        class="header-title"
    >

        <img
            v-if="logo"
            :src="logo"
            :alt="text"
        >
        <h1>{{ $t(text) }}</h1>
    </a>
</template>

<style lang="scss" scoped>
@import "~variables";

.header-title {
    display: grid;
    grid-template-columns: 7.5em 20.5em;
    grid-column-gap: 1em;
    align-items: center;
    overflow-wrap: break-word;

    img {
        max-height: 40px;
    }

    h1 {
        color: $secondary_contrast;
        font-size: 26px;
        font-family: $font_family_narrow;
    }
}
</style>

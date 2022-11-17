<script>
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
    }
};
</script>

<template>
    <a
        :id="'mp-menu-header-title-' + idAppendix"
        :href="link ? link : '#'"
        :target="link ? '_blank' : '_self'"
        :title="toolTip"
        class="mp-menu-header-title"
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

.mp-menu-header-title {
        padding: $padding;
        width: 100%;
        display: flex;
        justify-content: space-around;
        overflow-wrap: break-word;

        img {
            max-height: 30px;
            flex-grow: 0;
            flex-shrink: 0;
        }

        h1 {
            color: $dark_blue;
            font-size: $font_size_huge;
            flex-grow: 1;
            margin-left: 20px;
        }
    }

@include media-breakpoint-up(sm)  {
    .mp-menu-header-title {

        img {
            max-height: 40px;
        }

    }
}

</style>

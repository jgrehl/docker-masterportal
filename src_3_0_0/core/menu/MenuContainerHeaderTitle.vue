<script>
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerHeaderTitle",
    props: {
        idAppendix: {
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
        /** title text */
        text: {
            type: String,
            default: ""
        },
        /** Shown on hovering the title logo */
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
    <div
        v-if="!isMobile && (text !== '' || logo !== '' || link !== '' || toolTip !== '')"
        :id="'menu-offcanvas-header-title-' + idAppendix"
        class="header-title"
    >
        <a
            :href="link"
            target="_blank"
            :data-bs-toggle="text"
            data-bs-placement="bottom"
            :title="toolTip"
            class="tabbable"
        >

            <img
                v-if="logo !== ''"
                :src="logo"
                :alt="text"
            >
            <h1 v-html="text" />
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

/* TODO(roehlipa): Update focus, hover and active style */
.header-title {
    margin-left: 10px;
    overflow: hidden;
    line-height: 50px;
    float: left;

    a {
        display: block;
        text-decoration: none;

        img {
            display: inline-block;
            vertical-align: middle;
            margin: 0 5px;
            max-height: 40px;
        }

        h1 {
            color: $secondary_contrast;
            margin-left: 5px;
            font-size: 26px;
            font-family: $font_family_narrow;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            vertical-align: middle;
        }
    }
}
</style>

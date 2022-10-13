<script>

import {mapGetters} from "vuex";

export default {
    name: "PortalTitle",
    props: {
        /** portal name */
        text: {
            type: String,
            default: ""
        },
        /** Path to an external image file */
        logo: {
            type: String,
            default: ""
        },
        /** URL of an external website to link to */
        link: {
            type: String,
            default: ""
        },
        /** Shown on hovering the portal logo */
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
        class="portal-title"
    >
        <a
            :href="link"
            target="_blank"
            :data-bs-toggle="text"
            data-bs-placement="bottom"
            :title="toolTip"
            class="tabable"
        >

            <img
                v-if="logo !== ''"
                id="logo"
                :src="logo"
                :alt="text"
            >
            <h1
                id="title-text"
                v-html="text"
            />
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.portal-title {
    margin-left: 10px;
    overflow: hidden;
    line-height: 50px;
    float: left;
    a {
        text-decoration: none;
        display: block;
        img {
            margin: 0 5px 0 5px;
            max-height: 40px;
            display: inline-block;
            vertical-align: middle;
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

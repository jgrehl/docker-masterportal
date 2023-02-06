<script>
import {mapGetters} from "vuex";
import ScaleLine from "./ScaleLine.vue";

/**
 * Footer that is displayed below the map. Links can be displayed here.
 */
export default {
    name: "PortalFooter",
    components: {
        ScaleLine
    },
    computed: {
        ...mapGetters(["isMobile"]),
        ...mapGetters("Modules/PortalFooter", [
            "scaleLine",
            "seperator",
            "urls"
        ]),
        /**
         * Returns the alias length for relevant device mode.
         * @returns {Number} The alias length for the relevant device mode.
         */
        aliasLength () {
            if (this.isMobile) {
                return this.urls.filter(url => url.alias_mobil).length;
            }

            return this.urls.filter(url => url.alias).length;
        }
    }
};
</script>

<template lang="html">
    <footer
        id="module-portal-footer"
        class="portal-footer d-flex px-2 py-1"
    >
        <div
            v-for="(url, index) in urls"
            :key="`portal-footer-url-${index}`"
        >
            <span>
                {{ $t(url.bezeichnung) }}
                <a
                    :href="url.url"
                    target="_blank"
                    class="p-0"
                >
                    {{ $t(isMobile ? $t(url.alias_mobile) : $t(url.alias)) }}
                </a>
                <span
                    v-if="index < aliasLength - 1"
                    class="d-md-inline-block px-2"
                >
                    <b
                        v-html="seperator"
                    />
                </span>
            </span>
        </div>
        <span
            class="spacer"
        />
        <ScaleLine
            v-if="scaleLine"
        />
    </footer>
</template>

<style lang="scss" scoped>
    @import "~mixins";
    @import "~variables";

    .portal-footer {
        background-color: $menu-background-color;
        box-shadow: 0 -6px 12px $shadow;
        font-family: $font_family_narrow;
        // font-size: $font-size-sm;
        font-size: 12px; // todo rem auf welcher Grudnlage 14 oder 16px???
        flex-wrap: nowrap;
        margin-top: auto;
        pointer-events: auto;
        position: relative;
        width: 100%;

        a[target=_blank]{
            color: $secondary;
            padding: .2rem;
            &:hover{
                @include primary_action_hover;
            }
        }

        .spacer {
            flex-grow: 1;
        }
    }

    @include media-breakpoint-up(sm)  {
        .portal-footer {
            left: 36px;
            width: calc( 100% + 72px); // zweimal den Menucollapse-Button...
        }
    }

</style>

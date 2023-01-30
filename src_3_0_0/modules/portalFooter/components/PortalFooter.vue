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
        ...mapGetters(["deviceMode"]),
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
            if (this.deviceMode === "Mobile") {
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
        class="d-flex px-2 py-1"
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
                    {{ $t(deviceMode === "Mobile" ? $t(url.alias_mobile) : $t(url.alias)) }}
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

    #module-portal-footer {
        box-shadow: 0 -6px 12px $shadow;
        font-family: $font_family_narrow;
        // font-size: $font-size-sm;
        font-size: 12px; // todo rem auf welcher Grudnlage 14 oder 16px???
        flex-wrap: wrap;

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
</style>

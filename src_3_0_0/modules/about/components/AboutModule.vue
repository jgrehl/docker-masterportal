<script>
import {mapActions, mapGetters} from "vuex";

/**
 * The About Module gives information about the metadata, contact and current version of the portal
 * @module modules/AboutModule
 */
export default {
    name: "AboutModule",
    computed: {
        ...mapGetters(["configJs"]),
        ...mapGetters("Modules/About", [
            "abstractText",
            "contact",
            "cswUrl",
            "downloadLink",
            "logo",
            "logoText",
            "metaUrl",
            "showAdditionalMetaData",
            "version"
        ])
    },
    mounted () {
        this.initializeAboutInfo();
    },

    methods: {
        ...mapActions("Modules/About", ["initializeAboutInfo"])
    }
};
</script>

<template lang="html">
    <div
        id="modules-about"
    >
        <div class="pb-5">
            <div
                class="pb-2 abstract"
                v-html="abstractText"
            />
            <div v-if="showAdditionalMetaData && metaUrl.length > 0">
                <p
                    class="float-end"
                >
                    <a
                        :href="metaUrl"
                        target="_blank"
                    >
                        {{ $t("common:modules.about.additionalMetadata") }}
                    </a>
                </p>
            </div>
            <div
                v-if="contact"
                class="pt-5 pb-2 contact"
            >
                <h4>{{ $t("common:modules.about.contact") }}</h4>
                <p
                    v-html="contact.name"
                />
                <p
                    v-for="(positionName) in contact?.positionName"
                    :key="positionName"
                    v-html="positionName"
                />
                <p>
                    {{ contact?.street + "  " + contact?.postalCode }}
                </p>
                <p>
                    {{ contact?.city }}
                </p>
                <a
                    :href="contact?.email"
                >
                    {{ contact?.email }}
                </a>
            </div>
        </div>
        <div
            class="py-2 logoAndVersion"
        >
            <a
                class="logo"
            >
                <img
                    v-if="logo"
                    :src="logo"
                    :alt="logoText"
                >
            </a>
            <h4 class="mb-0 version">
                <a
                    :href="downloadLink + version + '.zip'"
                >
                    {{ $t("common:modules.about.version") + version }}

                </a>
            </h4>
        </div>
    </div>
</template>

<style lang="scss">
    @import "~variables";

    .abstract > p {
        font-size: $font-size-base;
    }

    .logoAndVersion {
        background-color: white;
        bottom: 0;
        margin-left: -1.5rem;
        position: absolute;
        width: 100%;
        display: flex;
    }
    .logo {
        margin-left: 0.5rem;
    }
    .version {
        display: flex;
        align-items: flex-end;
    }
</style>

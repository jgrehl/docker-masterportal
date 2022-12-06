<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {isWebLink} from "../../../shared/js/utils/urlHelper";

/**
 * The Layer Information that gives the user information, links and the legend for a layer
 */
export default {
    name: "LayerInformation",
    data () {
        return {
            activeTab: "layerinfo-legend"
        };
    },
    computed: {
        ...mapGetters(["configJs"]),
        ...mapGetters("Modules/LayerInformation", [
            "abstractText",
            "active",
            "datePublication",
            "dateRevision",
            "downloadLinks",
            "layerInfo",
            "metaURLs",
            "noMetadataLoaded",
            "periodicityKey",
            "showUrlGlobal",
            "title"
        ]),
        showAdditionalMetaData () {
            return this.layerInfo.metaURL !== null && typeof this.abstractText !== "undefined" && this.abstractText !== this.noMetadataLoaded;
        },
        showCustomMetaData () {
            return this.customText;
        },
        showPublication () {
            return typeof this.datePublication !== "undefined" && this.datePublication !== null && this.datePublication !== "";
        },
        showRevision () {
            return typeof this.dateRevision !== "undefined" && this.dateRevision !== null && this.dateRevision !== "";
        },
        showPeriodicity () {
            return this.periodicityKey !== "" && this.periodicityKey !== null && this.periodicityKey !== undefined;
        },
        showDownloadLinks () {
            return this.downloadLinks !== null;
        },
        showUrl () {
            return (this.layerInfo.url !== null && this.layerInfo.typ !== "SensorThings" && this.showUrlGlobal === true) || (this.layerInfo.url !== null && this.layerInfo.typ !== "SensorThings" && this.showUrlGlobal === undefined && this.layerInfo.urlIsVisible !== false);
        },
        showAttachFile () {
            return this.downloadLinks && this.downloadLinks.length > 1;
        },
        layerUrl () {
            return this.layerInfo.typ === "OAF" ? this.layerInfo.url : this.layerInfo.url + "?SERVICE=" + this.layerInfo.typ + "&REQUEST=GetCapabilities";
        },
        legendURL  () {
            return this.layerInfo.legendURL;
        }
    },

    created () {
        this.setConfigParams(this.configJs);
    },

    mounted () {
        if (this.configJs?.metaDataCatalogueId) {
            this.setMetaDataCatalogueId(this.configJs.metaDataCatalogueId);
        }
    },

    methods: {
        ...mapActions("Modules/LayerInformation", ["setConfigParams"]),
        ...mapMutations("Modules/LayerInformation", ["setMetaDataCatalogueId"]),
        isWebLink,

        /**
         * checks if the given tab name is currently active
         * @param {String} tab the tab name
         * @returns {Boolean}  true if the given tab name is active
         */
        isActiveTab (tab) {
            return this.activeTab === tab;
        },
        /**
         * set the current tab id after clicking.
         * @param {Object[]} evt the target of current click event
         * @returns {void}
         */
        setActiveTab (evt) {
            if (evt && evt.target && evt.target.hash) {
                this.activeTab = evt.target.hash.substring(1);
            }
        },
        /**
         * returns the classnames for the tab
         * @param {String} tab name of the tab depending on property activeTab
         * @returns {String} classNames of the tab
         */
        getTabPaneClasses (tab) {
            return {active: this.isActiveTab(tab), show: this.isActiveTab(tab), "tab-pane": true, fade: true};
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="modules-layer-information"
        class="body"
    >
        <h4
            class="subtitle"
            :title="title"
        >
            {{ title }}
        </h4>
        <div
            class="mb-2 abstract"
            v-html="abstractText"
        />
        <div v-if="showAdditionalMetaData">
            <p
                v-for="url in metaURLs"
                :key="url"
                class="float-end"
            >
                <a
                    :href="url"
                    target="_blank"
                >
                    {{ $t("common:modules.layerInformation.additionalMetadata") }}
                </a>
            </p>
        </div>
        <p v-if="showPublication">
            {{ $t("common:modules.layerInformation.publicationCreation") }}: {{ datePublication }}
        </p>
        <p v-if="showRevision">
            {{ $t("common:modules.layerInformation.lastModified") }}: {{ dateRevision }}
        </p>
        <p v-if="showPeriodicity">
            {{ $t("common:modules.layerInformation.periodicityTitle") }}: {{ $t(periodicityKey) }}
        </p>
        <template
            v-if="showCustomMetaData"
        >
            <div
                v-for="(key, value) in customText"
                :key="key"
            >
                <p
                    v-if="isWebLink(key)"
                    class="mb-0"
                >
                    {{ value + ": " }}
                    <a
                        :href="value"
                        target="_blank"
                    >{{ key }}</a>
                </p>
                <p
                    v-else
                    class="mb-0"
                >
                    {{ value + ": " + key }}
                </p>
            </div>
        </template>
        <hr>
        <ul class="nav nav-tabs">
            <li
                v-if="legendURL !== 'ignore'"
                value="layerinfo-legend"
                class="nav-item"
            >
                <a
                    href="#layerinfo-legend"
                    class="nav-link"
                    :class="{active: isActiveTab('layerinfo-legend') }"
                    @click="setActiveTab"
                >{{ $t("common:modules.layerInformation.legend") }}
                </a>
            </li>
            <li
                v-if="showDownloadLinks"
                value="LayerInfoDataDownload"
                class="nav-item"
            >
                <a
                    href="#LayerInfoDataDownload"
                    class="nav-link"
                    :class="{active: isActiveTab('LayerInfoDataDownload') }"
                    @click="setActiveTab"
                >{{ $t("common:modules.layerInformation.downloadDataset") }}
                </a>
            </li>
            <li
                v-if="showUrl"
                value="url"
                class="nav-item"
            >
                <a
                    href="#url"
                    class="nav-link"
                    :class="{active: isActiveTab('url') }"
                    @click="setActiveTab"
                >{{ $t(layerInfo.typ) }} - {{ $t("common:modules.layerInformation.addressSuffix") }}
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <div
                v-if="legendURL !== 'ignore'"
                id="layerinfo-legend"
                :class="getTabPaneClasses('layerinfo-legend')"
                :show="isActiveTab('layerinfo-legend')"
                :type="String('layerinfo-legend')"
            />
            <div
                id="LayerInfoDataDownload"
                class="row"
                :class="getTabPaneClasses('LayerInfoDataDownload')"
                :show="isActiveTab('LayerInfoDataDownload')"
                :type="String('LayerInfoDataDownload')"
            >
                <div class="col-lg-7">
                    <ul
                        v-if="showDownloadLinks"
                        class="pt-5"
                    >
                        <li
                            v-for="downloadLink in downloadLinks"
                            :key="downloadLink.linkName"
                        >
                            <a
                                :href="downloadLink.link"
                                target="_blank"
                            >
                                {{ $t(downloadLink.linkName) }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div
                    v-if="(showAttachFile)"
                    class="col-lg-5 pt-5"
                >
                    <span class="download-note">{{ $t(("common:modules.layerInformation.attachFileMessage")) }}</span>
                </div>
            </div>
            <div
                v-if="showUrl"
                id="url"
                :show="isActiveTab('url')"
                :class="getTabPaneClasses('url')"
                :type="String('url')"
            >
                <div>
                    <ul class="pt-5">
                        <li>
                            <a
                                :href="layerUrl"
                                target="_blank"
                            >
                                {{ layerInfo.url }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .subtitle {
        color: $light_red;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        max-width: 100%;
        padding-top: 1px;
        margin-bottom: 9px;
    }
    hr {
        margin: 15px 0 10px 0;
    }

    .body {
        >ul {
            background-color: $white;
        }
        max-height: 66vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 5px 10px;
        font-size: $font-size-base;
    }

    .layerInformation {
        position: absolute;
        overflow: unset;
        top: 20px;
        right: 60px;
        max-width:600px;
        width: 45vw;
        margin: 0 10px 30px 10px;
        z-index: 1010;
        background-color: $white;
        box-shadow: 8px 8px 12px rgba(0, 0, 0, 0.176);
        border: 1px solid $light_grey;

        @include media-breakpoint-down(sm) {
            inset: 12px auto auto 0;
            max-width:750px;
            width: 95vw;
            max-height: 80vh;
        }
    }

    .header {
        padding: 10px 10px 5px 10px;
        border-bottom: 1px solid $light_grey;
        cursor: move;
    }
    .bi-x-lg {
        &:hover {
            opacity: 0.7;
            cursor: pointer;
        }
    }

    .nav-tabs {
        display: flex;
        >li {
            font-size: $font-size-base;
            >a {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .tab-content {
        .tab-pane {
            >ul {
                >li {
                    >a {
                        font-size: $font-size-base;
                        text-overflow: ellipsis;
                        display: inline-block;
                        max-width: 95%;
                        overflow: hidden;
                    }
                }
            }
        }
        #layerinfo-legend {
            max-width: 95%;
            overflow: auto;
        }
    }

    .mb-2 {
        margin-bottom: 2rem;
    }

    .dropdown-toggle {
        width: 100%;
    }

    .dropdown-menu {
        width: 100%;
        a.active {
            background-color: $accent_active;
            color: white;
        }
        a:hover {
            background-color: $accent_hover;
        }
    }

    .download-note {
        font-weight: bold;
    }

    .pt-5 {
        padding-top: 5px;
    }

</style>

<script>
import axios from "axios";
import Cluster from "ol/source/Cluster";
import {mapGetters, mapMutations, mapActions} from "vuex";
import {Vector} from "ol/layer.js";

import mutations from "../store/mutationsPrint";
import thousandsSeparator from "../../../shared/js/utils/thousandsSeparator";
import getVisibleLayer from "../js/getVisibleLayer";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";
import InputText from "../../../shared/modules/inputs/components/InputText.vue";

/**
 * Tool to print a part of the map
 */
export default {
    name: "PrintMap",
    components: {FlatButton, InputText},
    data () {
        return {
            printIcon: "bi-printer",
            downloadIcon: "bi-download",
            docTitleId: "docTitle",
            outputFileTitleId: "outputFileTitle"
        };
    },
    computed: {
        ...mapGetters("Modules/Print", [
            "active",
            "autoAdjustScale",
            "capabilitiesFilter",
            "currentFormat",
            "currentLayoutName",
            "currentMapScale",
            "defaultCapabilitiesFilter",
            "fileDownloads",
            "filename",
            "formatList",
            "isGfiAvailable",
            "isGfiSelected",
            "isScaleSelectedManually",
            "layoutMapInfo",
            "layoutList",
            "printMapMarker",
            "printService",
            "printServiceId",
            "scaleList",
            "title",
            "visibleLayerList"
        ]),
        ...mapGetters("Maps", ["scales, size", "scale"]),
        ...mapGetters("Modules/GetFeatureInfo", ["currentFeature"]),

        currentScale: {
            get () {
                return this.$store.state.Modules.Print.currentScale;
            },
            set (value) {
                this.setCurrentScale(value);
            }
        },
        documentTitle: {
            get () {
                return this.title;
            },
            set (value) {
                this.setTitle(value);
            }
        },
        dpiForPdf: {
            get () {
                return this.$store.state.Modules.Print.dpiForPdf;
            },
            set (value) {
                this.setDpiForPdf(value);
            }
        },
        dpiList: {
            get () {
                return this.$store.state.Modules.Print.dpiList;
            },
            set (value) {
                this.setDpiList(value);
            }
        },
        shownLayoutList: {
            get () {
                let filterArray = [];

                if (Object.keys(this.capabilitiesFilter).length > 0 &&
                    this.capabilitiesFilter.layouts &&
                    this.capabilitiesFilter.layouts.length > 0) {
                    filterArray = this.capabilitiesFilter.layouts;
                }
                else
                if (Object.keys(this.defaultCapabilitiesFilter).length > 0 &&
                    this.defaultCapabilitiesFilter.layouts &&
                    this.defaultCapabilitiesFilter.layouts.length > 0) {
                    filterArray = this.defaultCapabilitiesFilter.layouts;
                }
                return this.layoutList.filter(function (el) {
                    let res = filterArray.length === 0;

                    filterArray.forEach(function (layoutFilter) {
                        if (el.name.match(layoutFilter) !== null) {
                            res = true;
                        }
                        return !res;
                    });
                    return res;
                }, this);
            },
            set (value) {
                this.setLayoutList(value);
            }
        },
        shownFormatList: {
            get () {
                let filterArray = [];

                if (Object.keys(this.capabilitiesFilter).length > 0 &&
                    this.capabilitiesFilter.outputFormats &&
                    this.capabilitiesFilter.outputFormats.length > 0) {
                    filterArray = this.capabilitiesFilter.outputFormats;
                }
                else
                if (Object.keys(this.defaultCapabilitiesFilter).length > 0 &&
                    this.defaultCapabilitiesFilter.outputFormats &&
                    this.defaultCapabilitiesFilter.outputFormats.length > 0) {
                    filterArray = this.defaultCapabilitiesFilter.outputFormats;
                }
                return this.formatList.filter(function (el) {
                    return filterArray.indexOf(el.name) > -1 || filterArray.length === 0;
                }, this);
            },
            set (value) {
                this.setFormatList(value);
            }
        },
        outputTitle: {
            get () {
                return this.filename;
            },
            set (value) {
                this.setFilename(value);
                this.isValid(value);
            }
        }
    },
    watch: {
        active: function () {
            if (this.active) {
                this.setIsScaleSelectedManually(false);
                this.retrieveCapabilites();
                this.setCurrentMapScale(this.scale);
            }
            else {
                this.setFileDownloads([]);
                this.togglePostrenderListener();
            }
        },
        scale: function (value) {
            this.setCurrentMapScale(value);
        }
    },
    created () {
        this.setServiceId(this.printServiceId);
    },
    mounted () {
        if (this.shownLayoutList.length === 0) {
            this.$nextTick(() => {
                if (this.active) {
                    this.retrieveCapabilites();
                    this.setCurrentMapScale(this.scale);
                    this.togglePostrenderListener();
                    this.updateCanvasByFeaturesLoadend(this.visibleLayerList);
                }
            });
        }

        this.setCurrentMapScale(this.scale);
    },
    methods: {
        ...mapMutations("Modules/Print", Object.keys(mutations)),
        ...mapActions("Modules/Print", [
            "retrieveCapabilites",
            "togglePostrenderListener",
            "createMapFishServiceUrl",
            "startPrint",
            "getOptimalResolution",
            "updateCanvasLayer",
            "getAttributeInLayoutByName"
        ]),
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Waits until the features of Vector layers are loaded and then renders the canvas again.
         * Cluster layer are considered.
         * @param {module:ol/layer/Base~BaseLayer[]} visibleLayerList A list which contains the visible layers.
         * @returns {void}
         */
        updateCanvasByFeaturesLoadend (visibleLayerList) {
            visibleLayerList.forEach(layer => {
                if (layer instanceof Vector) {
                    let layerSource = layer.getSource();

                    if (layer.getSource() instanceof Cluster) {
                        layerSource = layerSource.getSource();
                    }

                    layerSource.once("featuresloadend", () => {
                        getVisibleLayer(this.printMapMarker);
                        this.updateCanvasLayer();
                        this.togglePostrenderListener();
                    });
                }
            });
        },

        /**
         * returns the "beautified" scale to be shown in the dropdown box
         * @param {Number} scale the scale to beautify
         * @returns {String} the beautified scale
         */
        returnScale (scale) {
            if (typeof scale !== "number") {
                return "";
            }
            else if (scale < 10000) {
                return String(scale);
            }
            return thousandsSeparator(scale, " ");
        },

        /**
         * if Scale is changed
         * @param {event} event the click event
         * @returns {void}
         */
        async scaleChanged (event) {
            const scale = parseInt(event.target.value, 10),
                resolution = {
                    "scale": scale,
                    "mapSize": mapCollection.getMap("2D").getSize(),
                    "printMapSize": this.layoutMapInfo
                };

            this.setIsScaleSelectedManually(true);
            this.getOptimalResolution(resolution);
            this.updateCanvasLayer();
            await mapCollection.getMap("2D").render();
        },

        /**
         * if Layout is changed
         * @param {String} value the chosen layout
         * @returns {void}
         */
        async layoutChanged (value) {
            this.resetLayoutParameter();
            this.setCurrentLayoutName(value);
            this.setCurrentLayout(this.layoutList.find(layout => layout.name === value));
            this.getAttributeInLayoutByName("gfi");
            this.getAttributeInLayoutByName("legend");
            this.updateCanvasLayer();
            await mapCollection.getMap("2D").render();
        },

        /**
        * resets the available attriubtes gfi and legend to the default parameters
        * @returns {void}
        */
        resetLayoutParameter () {
            this.setIsGfiAvailable(false);
            this.setIsLegendAvailable(false);
        },

        /**
         * Starts the print
         * @returns {void}
         */
        print () {
            const currentPrintLength = this.fileDownloads.filter(file => file.finishState === false).length;

            if (currentPrintLength <= 10) {
                const index = this.fileDownloads.length;

                this.addFileDownload({
                    index: index,
                    title: this.title,
                    finishState: false,
                    downloadUrl: null,
                    filename: this.filename,
                    outputFormat: this.outputFormat
                });

                this.setPrintStarted(true);
                this.startPrint({
                    index,
                    getResponse: async (url, payload) => {
                        return axios.post(url, payload);
                    }
                });
            }
            else {
                this.addSingleAlert({
                    category: "error",
                    content: this.$t("common:modules.tools.print.alertMessage")
                });
            }
        },

        /**
         * Downloads the pdf for print.
         * @param {Object} button the clicked button
         * @param {String} downloadUrl The url to the file.
         * @param {String} filename The file name.
         * @returns {void}
         */
        download (button, downloadUrl, filename) {
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (button.classList.contains("btn-primary")) {
                button.classList.remove("btn-primary");
                button.classList.add("btn-secondary");
            }
        },

        /**
         * validates the value of the outputFileTitle input field
         * @param {String} value - input value
         * @returns {void}
         */
        isValid (value) {
            const regex = /^[a-zA-Z\-_]+$/,
                valid = regex.test(value);

            if (!valid) {
                document.getElementById("outputFileTitleWarning").classList.remove("active");
                document.getElementById("outputFileTitle").classList.add("danger");

                document.getElementById("printBtn").disabled = true;
            }
            else {
                document.getElementById("outputFileTitleWarning").classList.add("active");
                document.getElementById("outputFileTitle").classList.remove("danger");
                document.getElementById("printBtn").disabled = false;
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="modules-print"
    >
        <form
            id="printToolNew"
            class="form-horizontal"
        >
            <div>
                <InputText
                    :id="docTitleId"
                    :model="documentTitle"
                    :label="$t('modules.tools.print.titleLabel')"
                    :placeholder="$t('modules.tools.print.titleLabel')"
                    :value="$t('modules.tools.print.titleLabel')"
                />
            </div>
            <div class="form-floating mb-3">
                <select
                    id="printLayout"
                    class="form-select"
                    aria-label="$t('modules.tools.print.layoutLabel')"
                    @change="layoutChanged($event.target.value)"
                >
                    <option
                        v-for="(layout, i) in shownLayoutList"
                        :key="i"
                        :value="layout.name"
                        :selected="layout.name === currentLayoutName"
                    >
                        {{ layout.name }}
                    </option>
                </select>
                <label for="printLayout">
                    {{ $t("modules.tools.print.layoutLabel") }}
                </label>
            </div>
            <div class="form-floating mb-3">
                <select
                    id="printFormat"
                    class="form-select"
                    @change="setCurrentFormat($event.target.value)"
                >
                    <option
                        v-for="(format, i) in shownFormatList"
                        :key="i"
                        :value="format"
                        :selected="format === currentFormat"
                    >
                        {{ format }}
                    </option>
                </select>
                <label for="printFormat">
                    {{ $t("common:modules.tools.print.formatLabel") }}
                </label>
            </div>
            <div
                v-if="dpiList.length > 0"
                class="form-floating mb-3"
            >
                <select
                    id="printDpi"
                    class="form-select"
                    @change="setDpiForPdf($event.target.value)"
                >
                    <option
                        v-for="(dpi, i) in dpiList"
                        :key="i"
                        :value="dpi"
                        :selected="dpi === dpiForPdf"
                    >
                        {{ dpi }}
                    </option>
                </select>
                <label for="printDpi">
                    {{ $t("common:modules.tools.print.dpiLabel") }}
                </label>
            </div>
            <div class="form-floating scale">
                <select
                    id="printScale"
                    v-model="currentScale"
                    class="form-select"
                    @change="scaleChanged($event)"
                >
                    <option
                        v-for="(scale, i) in scaleList"
                        :key="i"
                        :value="scale"
                        :selected="scale === currentScale"
                    >
                        1 : {{ returnScale(scale) }}
                    </option>
                </select>
                <label for="printScale">
                    {{ $t("common:modules.tools.print.scaleLabel") }}
                </label>
                <div class="row info mb-3 mt-2">
                    <span class="col-1 info-icon d-flex align-items-center">
                        <i class="bi-info-circle-fill" />
                    </span>
                    <div class="col info-text ps-3">
                        {{ $t("common:modules.tools.print.hintInfoScale") }}
                    </div>
                </div>
            </div>
            <div
                v-if="printService === 'plotservice'"
                class="form-group form-group-sm row"
            >
                <InputText
                    :id="outputFileTitleId"
                    v-model="outputTitle"
                    :label="$t('modules.tools.print.outputfileTitleLabel')"
                    :placeholder="$t('modules.tools.print.outputfileTitleLabel')"
                />
                <small
                    id="outputFileTitleWarning"
                    class="offset-md-5 col-md-7 active"
                >
                    {{ $t("common:modules.tools.print.validationWarning") }}
                </small>
            </div>
            <div class="form-check form-switch mb-3 d-flex align-items-center">
                <input
                    id="autoAdjustScale"
                    type="checkbox"
                    role="switch"
                    aria-checked="print with info"
                    :checked="autoAdjustScale && !isScaleSelectedManually"
                    class="form-check-input"
                    @change="setAutoAdjustScale($event.target.checked)"
                >
                <label
                    class="form-check-label ps-2 pt-2"
                    for="autoAdjustScale"
                >
                    {{ $t("common:modules.tools.print.autoAdjustScale") }}
                </label>
            </div>
            <div
                v-if="isGfiAvailable"
            >
                <div class="form-check form-switch mb-3 d-flex align-items-center">
                    <input
                        id="printGfi"
                        type="checkbox"
                        role="switch"
                        aria-checked="print with info"
                        class="form-check-input"
                        :disabled="currentFeature === null"
                        :checked="isGfiSelected"
                        @change="setIsGfiSelected($event.target.checked)"
                    >
                    <label
                        class="form-check-label ps-2 pt-2"
                        for="printGfi"
                    >
                        {{ $t("common:modules.tools.print.withInfoLabel") }}
                    </label>
                </div>
            </div>
            <div class="form-group form-group-sm row">
                <div class="col-md-12 d-flex justify-content-center">
                    <FlatButton
                        id="printBtn"
                        aria-label="$t('modules.tools.print.printLabel')"
                        :interaction="print"
                        :text="$t('modules.tools.print.printLabel')"
                        :icon="printIcon"
                    />
                </div>
            </div>
        </form>
        <div id="modules-print-downloads-container">
            <div
                v-for="file in fileDownloads"
                id="modules-print-download-container"
                :key="file.index"
                class="row"
            >
                <div class="col-md-3 modules-print-download-title-container">
                    <span
                        v-if="printService === 'plotservice'"
                        class="modules-print-download-title"
                    >
                        {{ file.filename + "." + file.outputFormat }}
                    </span>
                    <span
                        v-else
                        class="modules-print-download-title"
                    >
                        {{ file.title }}
                    </span>
                </div>
                <div class="col-md-2 modules-print-download-icon-container">
                    <div
                        v-if="!file.finishState"
                        class="modules-print-download-loader"
                    />
                    <div
                        v-else
                        class="bootstrap-icon modules-print-download-icon"
                    >
                        <i class="bi-check-lg" />
                    </div>
                </div>
                <div class="col-md-7 d-grid gap-2 modules-print-download-button-container">
                    <FlatButton
                        v-if="file.finishState"
                        aria-label="$t('modules.tools.print.downloadFile')"
                        :interaction="($event) => download($event.target, file.downloadUrl, file.filename)"
                        :text="$t('modules.tools.print.downloadFile')"
                        :icon="downloadIcon"
                    />

                    <button
                        v-else
                        class="btn btn-outline-default modules-print-download-button-disabled rounded-pill"
                        disabled
                    >
                        {{ $t("common:modules.tools.print.createDownloadFile") }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .form-check-input {
        width: 2.5rem;
        height: 1.5rem;
    }
    .info {
        max-width: fit-content;
        .info-icon {
            font-size: 1.5rem;
        }
        .info-text {
            font-size: $font-size-sm;
        }
    }

    #outputFileTitle.danger {
        border-color: red
    }
    #outputFileTitleWarning {
        color: red;
    }
    #outputFileTitleWarning.active {
        display: none;
    }
    #modules-print-downloads-container {
        margin-top: 30px;

        #modules-print-download-container {
            padding-left: 15px;
            margin-top: 10px;

            .modules-print-download-title-container {
                padding: 8px 0 0 0;
            }

            .modules-print-download-icon-container {
                margin: 5px 0 0 0;
            }

            .modules-print-download-icon {
                font-size: $font-size-lg;
                color: darkgreen;
            }

            .modules-print-download-button-disabled {
                border-color: $dark_grey;
                color: $dark-grey;
            }

            .modules-print-download-loader {
                border: 4px solid $primary;
                border-radius: 50%;
                border-top: 4px solid $dark_blue;
                width: 25px;
                height: 25px;
                -webkit-animation: spin 1s linear infinite; /* Safari */
                animation: spin 1s linear infinite;

            }
            /* Safari */
            @-webkit-keyframes spin {
                0% { -webkit-transform: rotate(0deg); }
                100% { -webkit-transform: rotate(360deg); }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        }
    }
</style>

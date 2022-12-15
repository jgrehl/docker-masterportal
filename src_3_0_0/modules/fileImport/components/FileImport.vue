<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import isObject from "../../../shared/js/utils/isObject";
import store from "../../../app-store";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";

export default {
    name: "FileImport",
    components: {FlatButton},
    data () {
        return {
            dzIsDropHovering: false
        };
    },
    computed: {
        ...mapGetters("Modules/FileImport", ["importedFileNames", "enableZoomToExtend", "featureExtents"]),

        dropZoneAdditionalClass: function () {
            return this.dzIsDropHovering ? "dzReady" : "";
        }
    },
    watch: {
        /**
         * Listens to the active property change.
         * @param {Boolean} isActive Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (isActive) {
            if (isActive) {
                this.setFocusToFirstControl();
                this.modifyImportedFileNames(this.importedFileNames);
                this.modifyImportedFileExtent(this.featureExtents, this.importedFileNames);
            }
        }
    },
    methods: {
        ...mapActions("Modules/FileImport", [
            "importKML",
            "importGeoJSON"
        ]),
        ...mapActions("Maps", ["addNewLayerIfNotExists", "zoomToExtent"]),
        ...mapMutations("Modules/FileImport", ["setFeatureExtents", "setLayer"]),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["upload-label"]) {
                    this.$refs["upload-label"].focus();
                }
            });
        },
        onDZDragenter () {
            this.dzIsDropHovering = true;
        },
        onDZDragend () {
            this.dzIsDropHovering = false;
        },
        onDZMouseenter () {
            this.dzIsHovering = true;
        },
        onDZMouseleave () {
            this.dzIsHovering = false;
        },
        onInputChange (e) {
            if (e.target.files !== undefined) {
                this.addFile(e.target.files);
            }
        },
        onDrop (e) {
            this.dzIsDropHovering = false;
            if (e.dataTransfer.files !== undefined) {
                this.addFile(e.dataTransfer.files);
            }
        },
        addFile (files) {
            Array.from(files).forEach(file => {
                if (this.importedFileNames.includes(file)) {
                    return;
                }
                const reader = new FileReader();

                reader.onload = async f => {
                    const vectorLayer = await store.dispatch("Maps/addNewLayerIfNotExists", {layerName: "importDrawLayer"}, {root: true}),
                        fileNameSplit = file.name.split("."),
                        fileExtension = fileNameSplit.length > 0 ? fileNameSplit[fileNameSplit.length - 1].toLowerCase() : "";

                    if (fileExtension === "geojson" || fileExtension === "json") {
                        this.importGeoJSON({raw: f.target.result, layer: vectorLayer, filename: file.name});
                    }
                    else {
                        this.importKML({raw: f.target.result, layer: vectorLayer, filename: file.name});
                    }

                    this.setLayer(vectorLayer);
                };

                reader.readAsText(file);
            });
        },
        triggerClickOnFileInput (event) {
            if (event.which === 32 || event.which === 13) {
                this.$refs["upload-input-file"].click();
            }
        },
        /**
         * Zoom to the feature of imported file
         * @param {String} fileName the file name
         * @returns {void}
         */
        zoomTo (fileName) {
            if (!isObject(this.featureExtents) || !Object.prototype.hasOwnProperty.call(this.featureExtents, fileName)) {
                return;
            }

            this.zoomToExtent({extent: this.featureExtents[fileName]});
        },
        /**
         * Check if there are still features from the imported file.
         * If there are no features existed from the same imported file, the file name will be removed.
         * @param {String[]} fileNames the imported file name lists
         * @returns {void}
         */
        modifyImportedFileNames (fileNames) {
            const modifiedFileNames = [];

            if (typeof this.layer !== "undefined" && Array.isArray(fileNames) && fileNames.length) {
                fileNames.forEach(name => {
                    this.layer.getSource().getFeatures().forEach(feature => {
                        if (feature.get("source") && feature.get("source") === name && !modifiedFileNames.includes(name)) {
                            modifiedFileNames.push(name);
                        }
                    });
                });

                this.setImportedFileNames(modifiedFileNames);
            }
        },
        /**
         * Check if there are still features from the imported file.
         * If there are no features existed from the same imported file, the file name will be removed.
         * @param {Object} featureExtents the feature extent object, key is the file name and value is the feature extent
         * @param {String[]} fileNames the imported file name lists
         * @returns {void}
         */
        modifyImportedFileExtent (featureExtents, fileNames) {
            const modifiedFeatureExtents = {};

            fileNames.forEach(name => {
                modifiedFeatureExtents[name] = featureExtents[name];
            });

            this.setFeatureExtents(modifiedFeatureExtents);
        }
    }
};
</script>

<template lang="html">
    <div
        id="file-import"
    >
        <p
            class="mb-3"
            v-html="$t('modules.tools.fileImport.captions.introInfo')"
        />
        <p
            class="mb-3"
            v-html="$t('modules.tools.fileImport.captions.introFormats')"
        />
        <div
            class="vh-center-outer-wrapper drop-area-fake mb-3"
            :class="dropZoneAdditionalClass"
        >
            <div
                class="vh-center-inner-wrapper"
            >
                <p
                    class="caption"
                >
                    {{ $t("modules.tools.fileImport.captions.dropzone") }}
                </p>
            </div>

            <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
            <div
                class="drop-area"
                @drop.prevent="onDrop"
                @dragover.prevent
                @dragenter.prevent="onDZDragenter"
                @dragleave="onDZDragend"
                @mouseenter="onDZMouseenter"
                @mouseleave="onDZMouseleave"
            />
            <!--
                The previous element does not provide a @focusin or @focus reaction as would
                be considered correct by the linting rule set. Since it's a drop-area for file
                dropping by mouse, the concept does not apply. Keyboard users may use the
                matching input fields.
            -->
        </div>
        <div
            class="d-flex justify-content-center"
        >
            <label
                ref="upload-label"
                class="btn btn-secondary btn-icon"
                tabindex="0"
                @keydown="triggerClickOnFileInput"
            >
                <input
                    ref="upload-input-file"
                    type="file"
                    @change="onInputChange"
                >
                <i class="bi-box-arrow-in-down" />
                {{ $t("modules.tools.fileImport.captions.browse") }}
            </label>
        </div>

        <div v-if="importedFileNames.length > 0">
            <div class="h-seperator" />
            <p class="mb-3">
                <label
                    class="successfullyImportedLabel"
                    for="succesfully-imported-files"
                >
                    {{ $t("modules.tools.fileImport.successfullyImportedLabel") }}
                </label>
                <ul id="succesfully-imported-files">
                    <li
                        v-for="(filename, index) in importedFileNames"
                        :key="index"
                        :class="enableZoomToExtend ? 'hasZoom' : ''"
                    >
                        <span>
                            {{ filename }}
                        </span>
                        <FlatButton
                            v-if="enableZoomToExtend"
                            :aria-label="$t(`common:modules.tools.fileImport.fileZoom`, {filename: filename})"
                            :interaction="() => zoomTo(filename)"
                            :text="$t('modules.tools.fileImport.zoom')"
                            :icon="'bi-rocket-takeoff-fill'"
                        />
                    </li>
                </ul>
            </p>
            <div class="h-seperator" />
            <p
                class="mb-3 introDrawTool"
                v-html="$t('modules.tools.fileImport.captions.introDrawTool')"
            />
            <div
                class="d-flex justify-content-center"
            >
                <FlatButton
                    aria-label="$t('modules.tools.fileImport.captions.drawTool')"
                    :interaction="() => openDrawTool"
                    :text="$t('modules.tools.fileImport.captions.drawTool')"
                    :icon="'bi-pencil-fill'"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .h-seperator {
        margin:12px 0 12px 0;
        border: 1px solid #DDDDDD;
    }

    input[type="file"] {
        display: none;
    }
    input[type="button"] {
        display: none;
    }
    .drop-area-fake {
        background-color: $white;
        border-radius: 12px;
        border: 2px dashed $dark_blue;
        padding:24px;
        transition: background 0.25s, border-color 0.25s;

        &.dzReady {
            border-color:transparent;
            background-color: $dark_blue;

            p.caption {
                color: $white;
            }
        }

        p.caption {
            color: $dark_blue;
            margin:0;
            text-align:center;
            transition: color 0.35s;
            font-family: $font_family_accent;
            font-size: $font-size-lg;
        }
    }
    .drop-area {
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index:10;
    }
    .vh-center-outer-wrapper {
        top:0;
        left:0;
        right:0;
        bottom:0;
        text-align:center;
        position:relative;

        &:before {
            content:'';
            display:inline-block;
            height:100%;
            vertical-align:middle;
            margin-right:-0.25em;
        }
    }
    .vh-center-inner-wrapper {
        text-align:left;
        display:inline-block;
        vertical-align:middle;
        position:relative;
    }

    .successfullyImportedLabel {
        font-weight: bold;
    }
    .introDrawTool {
        font-style: italic;
    }

    li {
        &.hasZoom {
            display: inline-block;
            width: 100%;
            &:not(:last-child) {
                margin-bottom: 5px;
            }
            span {
                &:first-child {
                    display: inline-block;
                    margin-top: 5px;
                    width: calc(100% - 80px);
                }
                &:last-child {
                    display: inline-block;
                    margin-top: 0;
                }
            }
        }
    }
</style>

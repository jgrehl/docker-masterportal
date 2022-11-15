<script>
import {mapActions, mapGetters} from "vuex";

/**
 * Module to load a config.json to runtime.
 */
export default {
    name: "OpenConfig",
    computed: {
        ...mapGetters("Modules/OpenConfig", ["active", "icon"])
    },
    mounted () {
        this.setFocusToFirstControl();
    },
    methods: {
        ...mapActions("Modules/OpenConfig", ["processConfigJsonOnload"]),
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs["file-upload-label"]) {
                    this.$refs["file-upload-label"].focus();
                }
            });
        },

        /**
         * Triggers the file input.
         * @param {Event} event The keyboard event.
         * @returns {void}
         */
        triggerClickOnFileInput (event) {
            if (event.which === 32 || event.which === 13) {
                this.$refs["file-upload-input"].click();
            }
        },

        /**
         * Loads the config.json file
         * @param {Event} event The file input event.
         * @returns {void}
         */
        loadFile (event) {
            const targetFile = event.target.files[0];

            if (targetFile?.type === "application/json") {
                const reader = new FileReader();

                reader.onload = (evt) => {
                    this.processConfigJsonOnload(evt);
                    this.addSingleAlert({
                        category: "succes",
                        content: this.$t("common:modules.tools.openConfig.loadFileSuccess", {targetFileName: targetFile?.name})
                    });
                };
                reader.readAsText(event.target.files[0]);
            }
            else {
                this.addSingleAlert({
                    category: "error",
                    content: this.$t("common:modules.tools.openConfig.loadFileFailed", {targetFileName: targetFile?.name, targetFileFormat: targetFile?.name.split(".")[1]})
                });
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="open-config"
    >
        <h2 class="ms-3">
            {{ $t("modules.tools.openConfig.headline") }}
        </h2>
        <p class="my-5 ms-3">
            {{ $t("modules.tools.openConfig.explanation") }}
        </p>
        <div
            id="open-config-input-button"
            class="d-flex justify-content-center"
        >
            <label
                ref="file-upload-label"
                class="btn btn-secondary"
                tabindex="0"
                @keydown="triggerClickOnFileInput"
            >
                <input
                    ref="file-upload-input"
                    type="file"
                    @change="loadFile"
                >
                <span
                    class="bootstrap-icon pe-4"
                    aria-hidden="true"
                >
                    <i :class="icon" />
                </span>
                {{ $t("modules.tools.openConfig.openFile") }}
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    p {
        color: $black;
    }

    input[type="file"] {
        display: none;
    }

    .upload-button-wrapper {
        color: $white;
    }

</style>

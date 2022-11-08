<script>
import {mapActions, mapGetters} from "vuex";

/**
 * Module to load a config.json to runtime.
 */
export default {
    name: "OpenConfig",
    computed: {
        ...mapGetters("Modules/OpenConfig", ["icon"])
    },
    mounted () {
        this.setFocusToFirstControl();
    },
    methods: {
        ...mapActions("Modules/OpenConfig", ["processConfigJsonOnload"]),

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

                reader.onload = this.processConfigJsonOnload;
                reader.readAsText(event.target.files[0]);
            }
            else {
                /**
                 * @todo Alerting ergänzen
                 */
                console.warn(`Das Dateiformat ${targetFile?.name.split(".")[1]} wird nicht unterstützt. Bitte wählen Sie eine Datei mit der Endung ".json" aus.`);
                console.warn(`The ${targetFile?.name.split(".")[1]} file format is not supported. Please select a file with the extension ".json"`);
            }
        }
    }
};
</script>

<template lang="html">
    <div
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
                class="btn upload-button-wrapper"
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
        background-color: $secondary_focus;
        &:focus {
            @include primary_action_focus;
        }
        &:hover {
            @include primary_action_hover;
        }
    }

</style>

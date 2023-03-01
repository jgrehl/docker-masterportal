<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ContactFormularInput from "./ContactFormularInput.vue";
import FlatButton from "../../../shared/modules/buttons/components/FlatButton.vue";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

export default {
    name: "ContactFormular",
    components: {
        ContactFormularInput,
        FlatButton,
        IconButton
    },
    data () {
        return {
            sendIcon: "bi-send",
            dzIsDropHovering: false,
            fileUploaded: false,
            uploadedImages: []
        };
    },
    computed: {
        ...mapGetters("Modules/Contact", [
            "contactInfo",
            "maxLines",
            "username",
            "mail",
            "message",
            "phone",
            "showPrivacyPolicy",
            "privacyPolicyAccepted",
            "privacyPolicyLink",
            "validForm",
            "validMail",
            "validMessage",
            "validPhone",
            "validUsername",
            "fileUpload",
            "fileArray",
            "maxFileSize"
        ]),
        dropZoneAdditionalClass: function () {
            return this.dzIsDropHovering ? "dzReady" : "";
        }
    },
    methods: {
        ...mapMutations("Modules/Contact", [
            "setUsername",
            "setMail",
            "setPhone",
            "setMessage",
            "togglePrivacyPolicyAccepted",
            "setFileArray"
        ]),
        ...mapActions("Modules/Contact", ["send", "importFile"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        triggerClickOnFileInput (event) {
            if (event.which === 32 || event.which === 13) {
                this.$refs["upload-input-file"].click();
            }
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
                e.target.value = null;
            }
        },
        onDrop (e) {
            this.dzIsDropHovering = false;
            if (e.dataTransfer.files !== undefined) {
                this.addFile(e.dataTransfer.files);
            }
        },
        addFile (files) {
            const allFiles = [];

            Array.from(files).forEach(file => {
                // Check if filesize exceeds configured size
                // Default 1MB
                if (file.size > this.maxFileSize) {
                    this.addSingleAlert({
                        category: "error",
                        content: this.$t("common:modules.tools.contact.fileSizeMessage")
                    });
                }
                else if (!file.type.includes("image")) {
                    this.addSingleAlert({
                        category: "error",
                        content: this.$t("common:modules.tools.contact.fileFormatMessage")
                    });
                }
                else {
                    const reader = new FileReader();

                    reader.addEventListener("load", () => {
                        const fileNameSplit = file.name.split("."),
                            fileExtension = fileNameSplit.length > 0 ? fileNameSplit[fileNameSplit.length - 1].toLowerCase() : "";

                        if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg") {
                            this.fileUploaded = true;
                            this.uploadedImages.push({src: reader.result, name: file.name});
                            allFiles.push({imgString: reader.result, name: file.name, fileExtension: fileExtension});
                        }
                        else {
                            this.addSingleAlert({
                                category: "error",
                                content: this.$t("common:modules.tools.contact.fileFormatMessage")
                            });
                        }

                    }, false);

                    if (file) {
                        // convert image file to base64 string
                        reader.readAsDataURL(file);
                    }
                }
            });
            this.setFileArray(allFiles);
        },
        removeAttachment (target) {
            this.fileArray.forEach(image => {
                if (image.imgString === target) {
                    const index = this.fileArray[image];

                    this.fileArray.splice(index, 1);
                }
            });
            this.uploadedImages.forEach(image => {
                if (image === target) {
                    const index = this.uploadedImages[image];

                    this.uploadedImages.splice(index, 1);
                }
            });
        }
    }
};
</script>

<template lang="html">
    <div id="contact-formular">
        <div
            v-if="contactInfo"
            id="module-contact-addionalInformation"
            class="form-floating"
        >
            {{ contactInfo }}
        </div>
        <form
            @submit.prevent="send"
        >
            <ContactFormularInput
                :change-function="setUsername"
                input-name="username"
                :input-value="username"
                label-text="Name"
                :valid-input="validUsername"
                :focus-on-creation="true"
                autocomplete="name"
            />
            <ContactFormularInput
                :change-function="setMail"
                input-name="mail"
                input-type="email"
                :input-value="mail"
                label-text="E-Mail"
                :valid-input="validMail"
                autocomplete="email"
            />
            <ContactFormularInput
                :change-function="setPhone"
                input-name="phone"
                input-type="tel"
                :input-value="phone"
                label-text="Tel."
                :valid-input="validPhone"
                autocomplete="tel"
            />
            <ContactFormularInput
                :change-function="setMessage"
                html-element="textarea"
                input-name="message"
                :input-value="message"
                :label-text="$t('common:modules.tools.contact.messageLabel')"
                :rows="maxLines"
                :valid-input="validMessage"
            />
            <div
                v-if="showPrivacyPolicy"
                id="module-contact-privacyPolicy"
                class="form-group"
            >
                <label
                    id="module-contact-privacyPolicy-label"
                    for="module-contact-privacyPolicy-input"
                >
                    <input
                        id="module-contact-privacyPolicy-input"
                        :value="privacyPolicyAccepted"
                        type="checkbox"
                        @click="togglePrivacyPolicyAccepted"
                    >
                    {{ $t("common:modules.tools.contact.privacyPolicy.label") }}
                </label>
                <p v-html="$t('common:modules.tools.contact.privacyPolicy.info', {privacyPolicyLink})" />
            </div>
            <div v-if="fileUpload">
                <div
                    id="accordionFlushFile"
                    class="accordion accordion-flush mb-3"
                >
                    <div class="accordion-item">
                        <h2
                            id="flush-headingOne"
                            class="accordion-header"
                        >
                            <button
                                class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseOne"
                                aria-expanded="false"
                                aria-controls="flush-collapseOne"
                            >
                                <i class="bi-image-fill me-2" />
                                {{ $t('modules.tools.contact.addFileButton') }}
                            </button>
                        </h2>
                        <div
                            id="flush-collapseOne"
                            class="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushFile"
                        >
                            <div class="accordion-body">
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
                                            <i class="bi-box-arrow-in-down" />
                                            {{ $t("modules.tools.fileImport.captions.dropzone") }}
                                        </p>
                                    </div>
                                    <div>
                                        {{ $t("modules.tools.fileImport.captions.or") }}
                                        <label
                                            ref="upload-label"
                                            class="fake-link"
                                            tabindex="0"
                                            @keydown="triggerClickOnFileInput"
                                        >
                                            {{ $t("modules.tools.fileImport.captions.browse") }}
                                            <input
                                                ref="upload-input-file"
                                                type="file"
                                                name="image"
                                                @change="onInputChange"
                                            >
                                        </label>
                                    </div>
                                    <div v-if="fileUploaded">
                                        <div
                                            v-for="image in uploadedImages"
                                            :key="image"
                                            class="row d-flex"
                                        >
                                            <img
                                                :src="image.src"
                                                class="col-2"
                                                height="40"
                                                alt="Image preview"
                                            >
                                            <span class="d-flex align-items-center col">
                                                {{ image.name }}
                                            </span>
                                            <IconButton
                                                :aria="$t('modules.tools.fileUpload.removeAttachment')"
                                                :icon="'bi-trash'"
                                                :interaction="() => removeAttachment(image)"
                                                class="remove-btn col-3"
                                            />
                                        </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <FlatButton
                    id="module-contact-send-message"
                    aria-label="$t('modules.tools.contact.sendButton')"
                    type="submit"
                    :text="$t('modules.tools.contact.sendButton')"
                    :icon="sendIcon"
                    :disabled="!validForm"
                />
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
    input[type="checkbox"] {
        cursor: pointer;
    }

    #module-contact-privacyPolicy {
        label, span {
            cursor: pointer;
        }
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
            margin-right:-0.25rem;
        }
    }
    .vh-center-inner-wrapper {
        text-align:left;
        display:inline-block;
        vertical-align:middle;
        position:relative;
    }
    .fake-link {
        z-index: 20;
        position: relative;
        color: $secondary;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
    .remove-btn {
        z-index: 20;
        position: relative;
    }
</style>

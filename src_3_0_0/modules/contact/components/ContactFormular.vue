<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ContactFormularInput from "./ContactFormularInput.vue";
import actions from "../store/actionsContact";
import getters from "../store/gettersContact";
import mutations from "../store/mutationsContact";

export default {
    name: "ContactFormular",
    components: {
        ContactFormularInput
    },
    computed: {
        ...mapGetters("Modules/Contact", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
        // warn if deprecated param is used
        if (this.serviceID) {
            console.warn("Contact Tool: The parameter 'serviceID' is deprecated in the next major release! Please use serviceId instead.");
        }
    },
    methods: {
        ...mapMutations("Modules/Contact", Object.keys(mutations)),
        ...mapActions("Modules/Contact", Object.keys(actions)),

        close () {
            this.setActive(false);
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="contact-formular"
    >
        <div
            v-if="contactInfo"
            id="tool-contact-addionalInformation"
            class="form-group contents"
        >
            {{ contactInfo }}
        </div>
        <form
            class="contents"
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
                id="tool-contact-privacyPolicy"
                class="form-group"
            >
                <label
                    id="tool-contact-privacyPolicy-label"
                    for="tool-contact-privacyPolicy-input"
                >
                    <input
                        id="tool-contact-privacyPolicy-input"
                        :value="privacyPolicyAccepted"
                        type="checkbox"
                        @click="togglePrivacyPolicyAccepted"
                    >
                    {{ $t("common:modules.tools.contact.privacyPolicy.label") }}
                </label>
                <p v-html="$t('common:modules.tools.contact.privacyPolicy.info', {privacyPolicyLink})" />
            </div>
            <button
                id="tool-contact-send-message"
                type="submit"
                class="btn btn-primary float-end"
                :disabled="!validForm"
            >
                {{ $t("common:modules.tools.contact.sendButton") }}
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    input[type="checkbox"] {
        cursor: pointer;
    }

    #tool-contact-privacyPolicy {
        label, span {
            cursor: pointer;
        }
    }

    .contents {
        /* avoids making the form broader */
        max-width: 300px;
    }
</style>

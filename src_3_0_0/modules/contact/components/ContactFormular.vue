<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ContactFormularInput from "./ContactFormularInput.vue";
import FlatButton from "../../../shared/components/FlatButton.vue";

export default {
    name: "ContactFormular",
    components: {
        ContactFormularInput,
        FlatButton
    },
    data () {
        return {
            sendIcon: "bi-send"
        };
    },
    computed: {
        ...mapGetters("Modules/Contact", [
            "active",
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
            "validUsername"
        ])
    },
    methods: {
        ...mapMutations("Modules/Contact", [
            "setUsername",
            "setMail",
            "setPhone",
            "setMessage",
            "togglePrivacyPolicyAccepted"
        ]),
        ...mapActions("Modules/Contact", ["send"])
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
            id="module-contact-addionalInformation"
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
            <FlatButton
                id="module-contact-send-message"
                aria-label="$t('modules.tools.contact.sendButton')"
                type="submit"
                :text="$t('modules.tools.contact.sendButton')"
                :icon="sendIcon"
                :disabled="!validForm"
            />
        </form>
    </div>
</template>

<style lang="scss" scoped>
    input[type="checkbox"] {
        cursor: pointer;
    }

    #module-contact-privacyPolicy {
        label, span {
            cursor: pointer;
        }
    }

    .contents {
        /* avoids making the form broader */
        max-width: 300px;
    }
</style>

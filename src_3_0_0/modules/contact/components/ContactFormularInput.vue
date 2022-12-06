<script>
import {minMessageLength} from "../store/constantsContact";

export default {
    name: "ContactFormularInput",
    props: {
        changeFunction: {
            type: Function,
            required: true
        },
        htmlElement: {
            type: String,
            default: "input",
            validator: function (value) {
                // only these are explicitly supported
                return ["input", "textarea"].indexOf(value) !== -1;
            }
        },
        inputName: {
            type: String,
            required: true
        },
        inputType: {
            type: String,
            default: "text"
        },
        inputValue: {
            type: String,
            required: true
        },
        labelText: {
            type: String,
            required: true
        },
        rows: {
            type: Number,
            default: 5
        },
        validInput: {
            type: Boolean,
            required: true
        },
        focusOnCreation: {
            type: Boolean,
            default: false,
            required: false
        },
        autocomplete: {
            type: String,
            default: "off"
        }
    },
    data: function () {
        return {
            minMessageLength
        };
    },
    created () {
        if (this.focusOnCreation) {
            this.$nextTick(() => {
                if (this.$refs[`module-contact-${this.inputName}-input`]) {
                    this.$refs[`module-contact-${this.inputName}-input`].focus();
                }
            });
        }
    },
    methods: {
        help (target) {
            if (!target.classList.contains("is-valid")) {
                target.classList.add("is-invalid");
                target.classList.remove("mb-5");
            }
        }
    }
};
</script>

<template>
    <div
        :class="[
            'has-feedback'
        ]"
    >
        <div
            class="form-floating"
            :class="validInput ? 'mb-5' : 'mb-3'"
        >
            <component
                :is="htmlElement"
                :id="`module-contact-${inputName}-input`"
                :ref="`module-contact-${inputName}-input`"
                :value="inputValue"
                :autocomplete="autocomplete"
                :type="htmlElement === 'input' ? inputType : ''"
                class="mb-5"
                :class="[(htmlElement === 'select' ? 'form-select' : 'form-control'), (validInput ? 'is-valid' : '')]"
                :aria-describedby="`module-contact-${inputName}-help`"
                :placeholder="$t(`common:modules.tools.contact.placeholder.${inputName}`)"
                :style="htmlElement === 'textarea' ? 'height: 100px' : ''"
                @focus="help($event.currentTarget)"
                @keyup="changeFunction($event.currentTarget.value)"
            />

            <label
                :class="[
                    htmlElement === 'textarea' ? 'force-border' : ''
                ]"
                :for="`module-contact-${inputName}-input`"
            >{{ labelText }}</label>
            <span
                :id="`module-contact-${inputName}-help`"
                class="invalid-feedback"
            >
                {{ $t(
                    `common:modules.tools.contact.error.${inputName + (inputName === "message" ? "Input" : "")}`,
                    {length: minMessageLength}
                ) }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.invalid-feedback {
    max-width: fit-content;
}

</style>

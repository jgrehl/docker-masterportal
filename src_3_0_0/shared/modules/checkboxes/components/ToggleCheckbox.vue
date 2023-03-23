<script>
export default {
    name: "ToggleCheckbox",
    props: {
        defaultState: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: "Switch off filter"
        },
        textOn: {
            type: String,
            default: "on"
        },
        textOff: {
            type: String,
            default: "off"
        }
    },
    emits: ["change"],
    data () {
        return {
            currentState: false
        };
    },

    computed: {
        isActive () {
            return this.currentState;
        },
        checkedValue: {
            get () {
                return this.currentState;
            },
            set (newValue) {
                this.currentState = newValue;
                this.$emit("change", newValue);
            }
        }
    },

    beforeMount () {
        this.currentState = this.defaultState;
    },

    methods: {
        /**
         * Toggles the state
         * @param {Event} event - dom event
         * @returns {void} emits change with currentState as payload
         */
        toggle: function (event) {
            if (event.type === "click" || event.which === 32 || event.which === 13) {
                this.currentState = !this.currentState;

                this.$emit("change", this.currentState);
            }
        },
        /**
         * Sets the current State. Required to Undo a change if e.g. a Layer couldn't be loaded.
         * @param {boolean} newValue the new Value
         * @returns {void}
         */
        setActive: function (newValue) {
            this.currentState = newValue;
        }
    }
};
</script>

<template>
    <div
        class="form-check form-switch"
        :class="{'off': !isActive}"
        tabindex="0"
        @keydown="toggle($event)"
    >
        <input
            :id="id"
            v-model="checkedValue"
            class="form-check-input"
            aria-label="checkbox"
            type="checkbox"
            :title="title"
            :checked="isActive"
            disabled="!isActive"
            @click="toggle($event)"
            @keydown="toggle($event)"
        >
        <label
            v-if="isActive"
            class="form-check-label active"
            for="id"
            @click="toggle($event)"
            @keydown="toggle($event)"
        >
            {{ textOff }}
        </label>
        <label
            v-else
            class="form-check-label"
            for="id"
            @click="toggle($event)"
            @keydown="toggle($event)"
        >
            {{ textOn }}
        </label>
    </div>
</template>

<style lang="scss" scoped>

</style>

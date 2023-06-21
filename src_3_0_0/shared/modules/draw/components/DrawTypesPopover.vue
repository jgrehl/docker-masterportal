<script>
import IconButton from "../../buttons/components/IconButton.vue";

export default {
    name: "DrawTypesPopover",
    components: {
        IconButton
    },
    props: {
        elements: {
            type: Array,
            required: true
        }
    },
    emits: ["regulateInteraction", "updateIcon"],
    data () {
        return {
            mappingIcons: {
                box: "bi-square",
                circle: "bi-circle",
                doubleCircle: "bi-record-circle",
                line: "bi-slash-lg",
                point: "bi-circle-fill",
                polygon: "bi-octagon",
                symbol: "bi-emoji-sunglasses-fill"
            }
        };
    },
    methods: {
        /**
         * Emits the drawType to the parent component.
         * @param {String} drawType The current draw type.
         * @returns {void}
         */
        emitElementToParent (drawType) {
            this.$emit("regulateInteraction", drawType);
            this.$emit("updateIcon", this.mappingIcons[drawType]);
        }
    }
};
</script>

<template>
    <div
        class="d-flex align-items-center justify-content-between"
    >
        <IconButton
            v-for="element in elements"
            :id="'draw-types-' + element"
            :key="element"
            :aria="$t('common:shared.modules.draw.drawTypes.' + element)"
            :class-array="['btn-primary', 'mx-1']"
            :interaction="() => emitElementToParent(element)"
            :icon="mappingIcons[element]"
        />
    </div>
</template>

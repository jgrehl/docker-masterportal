<script>
import Layer from "../../components/LayerComponent.vue";
import LightButton from "../../../../shared/modules/buttons/components/LightButton.vue";

/**
 * Representation of a node in layertree containing folders or layers.
 */
export default {
    name: "LayerSelectionTreeNode",
    components: {Layer, LightButton},
    /** current configuration */
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    emits: ["showNode"],
    computed: {
        isFolder () {
            return this.conf.type === "folder";
        },
        isLayer () {
            return this.conf.type === "layer";
        }
    },
    methods: {
        /**
         * Toggles a folder, changes data-property isOpen.
         * @returns {void}
         */
        folderClicked () {
            if (this.conf.elements) {
                this.$emit("showNode", this.conf.name, this.conf.elements);
            }
        }
    }
};
</script>

<template>
    <div class="no-list">
        <div v-if="isFolder">
            <LightButton
                :interaction="folderClicked"
                :text="$t(conf.name)"
                icon="bi-question-circle"
                icon-end="bi-chevron-right"
                customclass="w-100 justify-content-start"
            />
        </div>
        <template
            v-else
        >
            <Layer
                v-if="isLayer"
                :conf="conf"
            />
        </template>
    </div>
</template>


<style lang="scss" scoped>
@import "~variables";

    .folder{
        display: flex;
        gap: 0.25rem;
        align-items: baseline;
    }

</style>

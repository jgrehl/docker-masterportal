<script>
import Layer from "../../components/LayerComponent.vue";

/**
 * Representation of a node in layertree containing folders or layers.
 */
export default {
    name: "LayerSelectionTreeNode",
    components: {Layer},
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
                this.$emit("showNode", this.conf.elements);
            }
        }
    }
};
</script>

<template>
    <div class="no-list">
        <div v-if="isFolder">
            <button
                class="btn btn-light d-flex align-items-center w-100"
                type="button"
                @click="folderClicked"
                @keydown="folderClicked"
            >
                <i
                    :class="['fs-4', 'me-4', 'bi-question-circle']"
                    role="img"
                />
                <div
                    class="d-flex flex-column align-items-start"
                >
                    <span class="name">{{ $t(conf.name) }}</span>
                    <span class="btn-description text-wrap pt-2">{{ $t(conf.description) }}</span>
                </div>
                <i
                    class="fs-4 chevron bi-chevron-right"
                    role="img"
                />
            </button>
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
    .chevron{
        position: absolute;
        right: 2rem;
    }
    .btn-description {
        border-radius: 25px;
        font-size: $font-size-sm;
    }
    .name{
        white-space: nowrap;
    }

</style>

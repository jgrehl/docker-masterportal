<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import IconButton from "../../../../shared/modules/buttons/components/IconButton.vue";

export default {
    name: "AddLayer",
    components: {
        IconButton
    },
    props: {
        searchResult: {
            type: Object,
            required: false,
            default: undefined
        }
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [])
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["addSearchResultToTopicTree"]),
        ...mapMutations("Modules/SearchBar", ["setSearchResultsActive"]),
        /**
         * Adds a layer to the topic tree
         * @param {Object} searchResult a single search result
         * @returns {void}
         */
        async addLayerFromOverview (searchResult) {
            await this.addSearchResultToTopicTree(searchResult);
            this.setSearchResultsActive(false);
        }
    }
};
</script>

<template lang="html">
    <IconButton
        :aria="$t('common:modules.contact.removeAttachment')"
        :icon="'bi-plus-circle'"
        :interaction="() => addLayerFromOverview (searchResult)"
        class="remove-btn col-3"
    />
</template>

<style lang="scss" scoped>
@import "~variables";
.btn {
    display: flex;
    align-items: center;
    justify-content: left;
    white-space: nowrap;
    min-height: 2.5rem;
    width: 80%;

    i {
        font-size: 1.3rem;
        padding-right: 1rem;
    }
    i:last-child {
        padding-left: .5rem;
        padding-right: 0;
    }
    .btn-texts {
        text-align: left;

    }
    .btn-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>

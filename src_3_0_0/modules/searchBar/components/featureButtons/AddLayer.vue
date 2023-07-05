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
        },
        clickStatus: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ["updateClickStatus"],
    data () {
        return {
            localClickStatus: false,
            icon: "bi-plus-circle"
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["showAllResults"])
    },
    watch: {
        /**
         * Syncs the localClickstatus with the clickStatus of the parent element.
         * @param {Boolean} value click status of parent element
         * @returns {void}
        */
        clickStatus: {
            handler (value) {
                if (value === true) {
                    this.localClickStatus = true;
                }
                else {
                    this.localClickStatus = false;
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["addSingleSearchResultToTopicTree"]),
        ...mapMutations("Modules/SearchBar", ["setSearchResultsActive", "addSelectedSearchResults", "removeSelectedSearchResults"]),
        /**
         * Adds a layer to the topic tree if clicked from the result overview or collects the layer for later adding by the main add button
         * @param {Boolean} value true if selected
         * @param {Object} searchResult a single search result
         * @returns {void}
         */
        addOrCollectLayer (value, searchResult) {
            console.log(this.showAllResults)
            if (this.showAllResults === true) {
                this.localClickStatus = value;
                this.$emit("updateClickStatus", value);
                if (value === true) {
                    this.addSelectedSearchResults(searchResult);
                }
                else {
                    this.removeSelectedSearchResults(searchResult);
                }
            }
            else {
                this.addSingleSearchResultToTopicTree(searchResult);
            }
        }
    }
};
</script>

<template lang="html">
    <IconButton
        :aria="$t('common:modules.contact.removeAttachment')"
        :icon="localClickStatus === false ? 'bi-plus-circle' : 'bi-plus-circle-fill'"
        :interaction="() => (addOrCollectLayer (!localClickStatus, searchResult))"
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

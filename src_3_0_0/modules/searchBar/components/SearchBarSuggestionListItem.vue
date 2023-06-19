<script>
import {mapGetters} from "vuex";

/**
 * Search Bar Suggestion List Item
 * @module modules/SearchBarSuggestionListItem
 */
export default {
    name: "SearchBarSuggestionListItem",
    props: {
        searchResult: {
            type: Object,
            required: false,
            default: undefined
        }
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["featureButtonsMap"])
    }
};
</script>

<template lang="html">
    <div id="search-bar-suggestion-list-item">
        <div class="d-flex flex-row bd-highlight bold mb-2">
            <button
                type="button"
                class="btn btn-light d-flex"
                :title="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                :aria-label="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                @click="interaction"
                @keydown.enter="interaction"
            >
                <span class="btn-title">
                    {{ searchResult.name }}
                </span>
            </button>
            <!-- todo: replace placeholder with buttons-->
            <div
                v-if="searchResult.searchInterfaceId==='gazetteer'"
                title="placeholder"
                class="ms-auto mt-1 p-2"
            >
                <i
                    class="bi-sign-turn-right mr-2"
                />
                <i
                    class="bi-house mr-2"
                />
                <i
                    class="bi-geo mr-2"
                />
            </div>
            <div
                v-if="searchResult.searchInterfaceId==='elasticSearch'"
                title="placeholder"
                class="ms-auto mt-1 p-2"
            >
                <component
                    :is="featureButtonsMap[searchResult.featureButtons[0].charAt(0).toUpperCase()+searchResult.featureButtons[0].slice(1)]"
                />
            </div>
        </div>
    </div>
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

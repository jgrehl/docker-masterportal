<script>
/**
 * SearchBarUtil to access search results.
 * @module modules/SearchBar
 * @vue-computed {String} searchInputValue - The v-bind of search input value.
 */
export default {
    name: "SearchBarUtil",
    props: {
        searchInputValue: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String,
            default: ""
        },
        searchFunction: {
            type: Function,
            required: true
        }
    }
};
</script>

<template lang="html">
    <div class="input-group mb-3">
        <button
            id="search-button"
            class="btn btn-primary"
            :aria-label="$t(placeholder)"
            type="button"
            @click="searchFunction"
        >
            <i
                class="bi-search"
                role="img"
            />
        </button>
        <input
            id="search-bar-input"
            :v-model="searchInputValue"
            type="search"
            class="form-control"
            :placeholder="$t(placeholder)"
            :aria-label="$t(placeholder)"
            @click="searchFunction"
            @input="searchFunction"
            @keydown.enter="searchFunction"
        >
    </div>
</template>

<style lang="scss" scoped>
    #search-bar {
        #search-button {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
    }
</style>


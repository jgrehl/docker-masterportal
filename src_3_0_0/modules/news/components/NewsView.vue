<script>
import moment from "moment";
import {mapGetters} from "vuex";
import sortBy from "../../../shared/js/utils/sortBy";

/**
 * Shows the news as history.
 */
export default {
    name: "NewsView",
    components: {},
    computed: {
        ...mapGetters("Modules/News", ["active", "news"])
    },
    methods: {
        /**
         * Formats the date.
         * @returns {void}
         */
        formatDate (date) {
            if (typeof date === "string") {
                return moment(date).format("DD.MM.YYYY");
            }
            return "";
        },
        /**
         * Sorts the news descending by date in 'displayFrom'.
         * @param {Array} news the news to show
         * @returns {Array} sorted news
         */
        sortByDate (news) {
            return sortBy(news, "displayFrom").reverse();
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="news-view"
    >
        <div class="title d-flex flex-column justify-content-center mb-3 ps-2 bold">
            {{ $t("modules.tools.news.headline") }}
        </div>
        <template
            v-for="(aNews, index) in sortByDate(news)"
            :key="index"
        >
            <div class="small-text ps-2">
                {{ formatDate(aNews.displayFrom) }}
            </div>
            <div
                v-if="aNews.title && aNews.title.trim().length > 0"
                class="bold p-2"
            >
                {{ aNews.title }}
            </div>
            <div
                class="small-text p-2 mb-5"
                v-html="aNews.content"
            />
        </template>
        <div />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.small-text {
    font-size: $font-size-sm;
    }
</style>

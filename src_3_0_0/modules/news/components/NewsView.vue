<script>
import moment from "moment";
import {mapGetters} from "vuex";

/**
 * 
 */
export default {
    name: "NewsView",
    components: {},
    computed: {
        ...mapGetters("Modules/News", ["active", "news"]),      
    },
    created (){
        console.log(this.news);
    },
    methods: {
        /**
         * Formats the date.
         * @returns {void}
         */
        formatDate (date) {
          return moment(date).format("MM.DD.YYYY")
        },
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="news-view"
    >
        <div  class="title d-flex flex-column justify-content-center mb-3">{{ $t("modules.tools.news.headline") }}</div>
        <template 
        v-for="(aNews, index) in news"
        :key="index"
        >
            <div class="small-text mb-auto p-2">
                {{formatDate(aNews.displayFrom)}}
            </div>  
            <div class="bold mb-auto p-2">
                {{aNews.title ? aNews.title : aNews.category}}
            </div> 
            <div 
                class="small-text  mb-auto p-2"
                v-html="aNews.content"
            />
            <hr>
        </template>
        <div>
           
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.small-text {
    font-size: $font-size-sm;
    }
</style>

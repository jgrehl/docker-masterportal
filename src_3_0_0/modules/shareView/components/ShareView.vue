<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersShareView";
import mutations from "../store/mutationsShareView";

/**
 * Tool to switch the scale of the map. Listens to changes of the map's scale and sets the scale to this value.
 */
export default {
    name: "ShareView",
    components: {
    },
    computed: {
        ...mapGetters("Tools/ShareView", Object.keys(getters)),
        ...mapGetters("Maps", ["getView"])
    },

    methods: {
        ...mapMutations("Tools/ShareView", Object.keys(mutations)),
        ...mapActions("Tools/SaveSelection", Object.keys(mutations)),

        async share () {
            const shareData = {
                title: "Masterportal",
                text: "Schau mal!",
                url: "https://developer.mozilla.org"
            };

            try {
                await navigator.share(shareData);
            }
            catch (err) {
                // console.log(`Error: ${err}`);
            }
        }
    }
};
</script>

<template lang="html">
    <div class="start-btn">
        <h2>Diese Karte teilen via..</h2>
        <button @click="share">
            Teilen Mobil
        </button>
        <!-- Twitter (url, text, @mention) -->
        <a
            class="btn btn-secondary"
            href="https://twitter.com/share?url=google.com&text=GoogleHiervia=<USERNAME>"
        >
            Twitter
        </a>

        <!-- Facebook (url) -->
        <a
            class="btn btn-secondary"
            href="https://www.facebook.com/sharer/sharer.php?u=google.com"
        >
            Facebook
        </a>

        <div class="form-group form-group-sm">
            <label for="tool-saveSelection-input-url">Test URL</label>
            <input
                id="tool-saveSelection-input-url"
                ref="tool-saveSelection-input-url"
                type="text"
                class="form-control form-control-sm"
                :value="url"
                @click="copyToClipboard($event.currentTarget)"
            >
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    @import "~variables";

.start-btn {
    z-index: 10;
    background-color: white;
    height: 500px;
    width: 300px;

}
</style>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Action button to display at each search result and to execute configured actions.
 * @module modules/SearchBar
 * @vue-prop {String} actionName - name of the action to call on click on button
 * @vue-prop {Object} actionArgs - to call the action with
 * @vue-data {Object} iconsByActions - contains the icons by action names to display on button
 */
export default {
    name: "ActionButton",
    components: {
        IconButton
    },
    props: {
        actionName: {
            type: String,
            required: true
        },
        actionArgs: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            iconsByActions: {
                addLayerToTopicTree: "bi-plus-circle",
                activateLayerInTopicTree: "bi-eye",
                highlightFeature: "bi-lightbulb",
                openGetFeatureInfo: "bi-info",
                setMarker: "bi-geo-alt-fill",
                zoomToResult: "bi-zoom-in"
            }
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["showAllResults"])
    },
    methods: {
        ...mapActions("Modules/SearchBar", [
            "activateLayerInTopicTree",
            "addLayerToTopicTree",
            "highlightFeature",
            "openGetFeatureInfo",
            "setMarker",
            "zoomToResult"
        ]),
        ...mapMutations("Modules/SearchBar", ["setSearchResultsActive"]),
        /**
         * Calls the event of this button.
         * @returns {void}
         */
        callAction () {
            this[this.actionName](this.actionArgs);
            if (this.actionArgs.closeResults) {
                this.setSearchResultsActive(false);
            }
        }
    }
};
</script>

<template lang="html">
    <IconButton
        :aria="$t('common:modules.searchBar.actions.'+actionName)"
        :icon="iconsByActions[actionName]"
        :interaction="callAction"
        class="ms-2"
    />
</template>

<style lang="scss" scoped>
</style>

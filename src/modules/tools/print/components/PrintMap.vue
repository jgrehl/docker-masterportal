<script>
import {mapGetters} from "vuex";
import {getComponent} from "../../../../utils/getComponent";
import getVisibleLayer from "../utils/getVisibleLayer";

/**
 * Tool to print a part of the map
 */
export default {
    name: "PrintMap",
    computed: {
        ...mapGetters("Tools/Gfi", ["currentFeature"])
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * sets listener to laylerlist.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);

        // warn if deprecated param is used
        if (this.mapfishServiceId) {
            console.warn("Print Tool: The parameter 'mapfishServiceId' is deprecated in the next major release! Please use printServiceId instead.");
        }

        // this.setServiceId(this.mapfishServiceId && this.mapfishServiceId !== "" ? this.mapfishServiceId : this.printServiceId);

        Backbone.Events.listenTo(Radio.channel("ModelList"), {
            "updatedSelectedLayerList": () => {
                if (typeof this.eventListener !== "undefined") {
                    getVisibleLayer(this.printMapMarker);
                    this.updateCanvasLayer();
                    this.updateCanvasByFeaturesLoadend(this.visibleLayerList);
                }
            }
        });
    },

    methods: {
        /**
         * Selcts the gfi
         * @param {event} evt the click event
         * @returns {void}
         */
        selectGfi (evt) {
            this.setIsGfiSelected = evt.target.checked;
        },

        /**
         * Sets active to false.
         * @param {event} event the click event
         * @returns {void}
         */
        close (event) {
            event.stopPropagation();
            this.setActive(false);

            const model = getComponent(this.$store.state.Tools.Print.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :show-in-sidebar="true"
        :initial-width="400"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <form>
                <div
                    v-if="isLegendAvailable"
                    class="form-group form-group-sm row"
                >
                    <label
                        class="col-md-5 control-label"
                        for="printLegend"
                    >
                        {{ $t("common:modules.tools.print.withLegendLabel") }}
                    </label>
                    <div class="col-md-7">
                        <div class="form-check">
                            <input
                                id="printLegend"
                                type="checkbox"
                                class="form-check-input"
                                :checked="isLegendSelected"
                                @change="setIsLegendSelected($event.target.checked)"
                            >
                        </div>
                    </div>
                </div>
                <div
                    v-if="isGfiAvailable"
                    class="form-group form-group-sm row"
                >
                    <label
                        class="col-md-5 col-form-label pt-0"
                        for="printGfi"
                    >
                        {{ $t("common:modules.tools.print.withInfoLabel") }}
                    </label>
                    <div class="col-md-7">
                        <div class="form-check">
                            <input
                                id="printGfi"
                                type="checkbox"
                                class="form-check-input"
                                :disabled="currentFeature === null"
                                :checked="isGfiSelected"
                                @change="setIsGfiSelected($event.target.checked)"
                            >
                        </div>
                    </div>
                </div>
            </form>
        </template>
    </ToolTemplate>
</template>

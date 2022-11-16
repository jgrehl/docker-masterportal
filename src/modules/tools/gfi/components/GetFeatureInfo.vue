<script>
import {mapGetters} from "vuex";
import MobileTemplate from "./templates/MobileTemplate.vue";
import TableTemplate from "./templates/TableTemplate.vue";
import AttachedTemplate from "./templates/AttachedTemplate.vue";

export default {
    name: "GetFeatureInfo",
    components: {
        MobileTemplate,
        // DetachedTemplate,
        TableTemplate,
        AttachedTemplate
    },

    computed: {
        // gfiWindow is deprecated
        ...mapGetters({
            isMobile: "mobile",
            gfiWindow: "gfiWindow"
            // uiStyle: "uiStyle",
            // ignoredKeys: "ignoredKeys"
        }),
        /**
         * Returns the current view type.
         * It only works if the string has the same name as the component (in ./templates).
         * @returns {String} the current view type (Detached or Mobile)
         */
        currentViewType: function () {
            // this.gfiWindow is deprecated
            if (this.gfiWindow) {
                console.warn("Parameter 'gfiWindow' is deprecated. Please use 'Portalconfig.menu.tool.gfi.desktopType' instead.");
            }

            if (this.isMobile) {
                return "MobileTemplate";
            }
            // this.gfiWindow is deprecated
            else if ((this.desktopType || this.gfiWindow)?.toLowerCase() === "attached") {
                return "AttachedTemplate";
            }
            else if (this.uiStyle === "TABLE") {
                return "TableTemplate";
            }
            return "DetachedTemplate";
        }
    }
};
</script>

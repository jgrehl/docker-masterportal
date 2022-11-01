<script>
import ControlIcon from "../../components/ControlIcon.vue";
import FreezeScreenUnfreeze from "./FreezeScreenUnfreeze.vue";

/**
 * Freeze control that allows the user to freeze the current window
 * of desktop and Mobile browser
 */
export default {
    name: "FreezeScreen",
    components: {
        FreezeScreenUnfreeze,
        ControlIcon
    },
    data: () => {
        return {
            isFreezed: false
        };
    },
    computed: {
        component () {
            return ControlIcon;
        }
    },
    methods: {
        /**
         * Showing the freezed window.
         * @returns {void}
         */
        showFreezeWin () {
            this.isFreezed = true;
        },

        /**
         * Hiding the freezed window.
         * @returns {void}
         */
        hideFreezeWin () {
            this.isFreezed = false;
        }
    }
};
</script>

<template>
    <div id="freeze-screen-button">
        <component
            :is="component"
            :title="$t(`common:modules.controls.freeze.freeze`)"
            class="control"
            :icon-name="'lock-fill'"
            :on-click="showFreezeWin"
        />
        <FreezeScreenUnfreeze
            v-if="isFreezed"
            @hideFreezeWin="hideFreezeWin"
        />
    </div>
</template>

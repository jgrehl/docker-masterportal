<script>
import ControlIcon from "../../ControlIcon.vue";

export default {
    name: "Button3dItem",
    computed: {
        component () {
            return ControlIcon;
        }
    },
    methods: {
        clickAction () {
            console.log(123);
        }
    }
};
</script>

<template>
    <div class="button-3d-button">
        <component
            :is="component"
            :title="$t('common:modules.controls.3d.buttonTitle')"
            :on-click="clickAction"
            :button-title="$t('common:modules.controls.3d.buttonTitle')"
        />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
</style>

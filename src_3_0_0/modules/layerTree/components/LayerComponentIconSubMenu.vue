<script>
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";
/**
 * Represents an sub menu button for a layer in the layertree.
 */
export default {
    name: "LayerComponentIconSubMenu",
    components: {IconButton},
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            classInfo: ["btn-light", "layer-component-icon-sub-menu-button"]
        };
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-icon-sub-menu-' + layerConf.id"
        class="layer-component-icon-sub-menu"
    >
        <IconButton
            :id="'layer-component-icon-sub-menu-button-' + layerConf.id"
            :class-array="['btn-light, layer-component-icon-sub-menu-button']"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse-sub-menu-' + layerConf.id"
            :icon="'bi-sliders'"
            :aria="$t('common:tree.iconSubMenu')"
        />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-component-icon-sub-menu-button {
        width: 2rem;
        height: 2rem;
        font-size: 1.2rem;

        &:hover {
                @include primary_action_hover;
        }
        &:focus {
            @include primary_action_focus;
        }
    }
</style>

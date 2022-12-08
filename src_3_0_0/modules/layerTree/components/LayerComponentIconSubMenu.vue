<script>
/**
 * Represents an sub menu button for a layer in the layertree.
 */
export default {
    name: "LayerComponentIconSubMenu",
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-icon-sub-menu' + layerConf.id"
        class="layer-component-icon-sub-menu"
    >
        <button
            :id="'layer-component-icon-sub-menu-button-' + layerConf.id"
            class="layer-component-icon-sub-menu-button btn"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapseSubMenu-' + layerConf.id"
            tabindex="0"
            :title="$t('common:layerTree.iconSubMenu')"
            :aria-label="$t('common:layerTree.iconSubMenu')"
        >
            <i class="bi-sliders" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-component-icon-sub-menu {
        font-size: $font-size-base;

        .layer-component-icon-sub-menu-button {
            &:hover {
                @include primary_action_hover;
            }
            &:focus {
                @include primary_action_focus;
            }
        }
    }
</style>

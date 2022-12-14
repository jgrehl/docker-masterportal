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
            :data-bs-target="'#collapseSubMenu-' + layerConf.id"
            :icon="'bi-sliders'"
            :aria="$t('common:tree.iconSubMenu')"
        />
    </div>
</template>

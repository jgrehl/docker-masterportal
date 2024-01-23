<script>
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Represents an sub menu button to show the tree path for a layer in the layertree.
 * @module modules/layerTree/components/LayerComponentIconTreePath
 * @vue-prop {Object} layerConf - The current layer configuration.
 */
export default {
    name: "LayerComponentIconTreePath",
    components: {IconButton},
    props: {
        /** current layer configuration */
        layerConf: {
            type: Object,
            required: true
        }
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-icon-tree-path-' + layerConf.id"
        class="layer-component-icon-sub-menu"
    >
        <IconButton
            :id="'layer-component-icon-tree-path-button-' + layerConf.id"
            :class-array="['btn-light']"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse-tree-path-' + layerConf.id.split('.').join('_')"
            :icon="'bi-folder'"
            :aria="$t('common:modules.layerTree.iconTreePath')"
        />
    </div>
</template>


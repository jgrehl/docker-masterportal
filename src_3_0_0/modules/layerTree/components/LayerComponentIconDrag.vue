<script>
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Represents an info button for a layer in the layertree.
 */
export default {
    name: "LayerComponentIconDrag",
    components: {
        IconButton
    },
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            classInfo: ["layer-component-icon-drag-button", "btn-light", "handle-layer-component-drag"]
        };
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-icon-drag-' + layerConf.id"
        class="layer-component-icon-drag"
    >
        <IconButton
            :id="'layer-component-icon-drag-button-' + layerConf.id"
            :class-array="classInfo"
            :aria="$t('common:tree.drag')"
            :icon="'bi-grip-vertical'"
        />
    </div>
</template>

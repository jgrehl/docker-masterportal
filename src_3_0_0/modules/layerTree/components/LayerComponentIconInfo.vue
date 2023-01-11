<script>
import {mapActions, mapGetters} from "vuex";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

/**
 * Represents an info button for a layer in the layertree.
 */
export default {
    name: "LayerComponentIconInfo",
    components: {IconButton},
    /** current layer configuration */
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Modules/LayerInformation", ["icon"])
    },
    methods: {
        ...mapActions("Modules/LayerInformation", ["startLayerInformation"])
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-icon-info-' + layerConf.id"
    >
        <IconButton
            :id="'layer-component-icon-info-button-' + layerConf.id"
            :class-array="['btn-light']"
            :aria="$t('common:tree.infosAndLegend')"
            :icon="icon"
            :interaction="() => startLayerInformation(layerConf)"
            :disabled="!layerConf?.datasets?.length > 0"
        />
    </div>
</template>


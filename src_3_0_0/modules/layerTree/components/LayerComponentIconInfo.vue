<script>
import {mapActions, mapGetters} from "vuex";

/**
 * Represents an info button for a layer in the layertree.
 */
export default {
    name: "LayerComponentIconInfo",
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
        class="layer-component-icon-info"
    >
        <button
            :id="'layer-component-icon-info-button-' + layerConf.id"
            class="layer-component-icon-info-button btn"
            tabindex="0"
            :disabled="!layerConf?.datasets?.length > 0"
            :title="$t('common:tree.infosAndLegend')"
            :aria-label="$t('common:tree.infosAndLegend')"
            @click="startLayerInformation(layerConf)"
            @keydown="event => event.key === 'Enter' ? startLayerInformation(layerConf) : null"
        >
            <i :class="icon" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";

    .layer-component-icon-info {
        font-size: $font-size-base;

        .layer-component-icon-info-button {
            &:hover {
                @include primary_action_hover;
            }
            &:focus {
                @include primary_action_focus;
            }
        }
    }
</style>

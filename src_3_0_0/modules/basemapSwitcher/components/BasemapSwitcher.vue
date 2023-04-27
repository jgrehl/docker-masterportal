<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "BasemapSwitcher",
    computed: {
        ...mapGetters(["isMobile", "visibleSubjectDataLayerConfigs", "portalConfig"]),
        ...mapGetters("Modules/BasemapSwitcher", ["activatedExpandable"])
    },
    watch: {
        activatedExpandable () {
            console.log("it switched", this.activatedExpandable);
        }
    },
    created () {
        // soll unten links parallel zu controls dargestellt werden
        // Ich brauche Kreis (Vorschau einer Karte), wenn ich drauf klicke öffnen sich die anderen
        // Ich brauche: Hintergrundkarten aus der config.json
    },
    methods: {
        ...mapMutations("Modules/BasemapSwitcher", ["setActivatedExpandable"])
    }
};

</script>

<template>
    <div
        id="basemap-switcher"
        class="btn-group-vertical my-5 btn-group-basemap-switcher shadow"
        role="group"
    >
        <button
            type="button"
            class="btn control-icon-controls bootstrap-icon my-1 control-button-controls btn-light"
            @click="setActivatedExpandable(!activatedExpandable)"
        >
            <i class="bi-three-dots" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .btn-group-basemap-switcher {
        //display: none;
        background-color: $white;
        border: solid $white 1px;
        border-radius: 25px;
        position: absolute;
        bottom: 0;
        align-self: start;
    }
</style>

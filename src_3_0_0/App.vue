<script>
import {mapMutations, mapActions} from "vuex";
import LoaderOverlay from "./utils/loaderOverlay";

export default {
    name: "App",
    created () {
        // todo hier auch loadConfig.js, in dem dann nur die mutation ausgeführt wird. --> einheitlichkeit
        this.setConfigJs(Config);
        this.loadConfigJson();
        this.loadServicesJson();
        this.loadRestServicesJson();
    },
    mounted () {
        LoaderOverlay.hide();
    },
    methods: {
        ...mapMutations([
            "setConfigJs"
        ]),

        ...mapActions([
            "loadConfigJson",
            "loadRestServicesJson",
            "loadServicesJson"
        ])
    }
};
</script>

<template>
    <div
        id="masterportal-container"
        class="masterportal-container"
    >
        <!-- do something -->
    </div>
</template>

<style lang="scss" scoped>

</style>

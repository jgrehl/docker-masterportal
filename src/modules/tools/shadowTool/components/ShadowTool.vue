<script>
import {mapGetters} from "vuex";
import ToggleCheckbox from "../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";

export default {
    name: "ShadowTool",
    components: {
        ToggleCheckbox,
    },
    computed: {
        ...mapGetters("Language", ["layerIds", "currentLocale"])
    },
    watch: {
        currentLocale () {
            this.checkDateFormat();
        }
    }
};
</script>

<template lang="html">
    <div class="d-flex justify-content-between mb-3">
        <label
            class="form-label"
            for="tool-shadow-checkbox"
            @click="toggleShadow(!shadowActivated)"
            @keydown.enter="toggleShadow(!shadowActivated)"
        >
            {{ $t('common:modules.tools.shadow.shadowDisplay') }}
        </label>
        <ToggleCheckbox
            id="tool-shadow-checkbox"
            ref="shadowCheckBox"
            :default-state="isShadowEnabled"
            :text-on="$t('common:snippets.checkbox.on')"
            :text-off="$t('common:snippets.checkbox.off')"
            @change="toggleShadow"
        />
    </div>
</template>

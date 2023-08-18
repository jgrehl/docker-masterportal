<script>
import {mapGetters, mapMutations} from "vuex";

/**
 * A Checkbox to select all layers at one time.
 * @module modules/SelectAllCheckBox
 * @vue-prop {Array} confs - The current layer configurations controlled by this checkbox.
 * @vue-data {Boolean} checked - Shows if checkbox is checked.
 */
export default {
    name: "SelectAllCheckBox",
    /** current layer configurations controlled by this checkbox */
    props: {
        confs: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            checked: false
        };
    },
    computed: {
        ...mapGetters("Modules/LayerSelection", ["layersToAdd"])
    },
    methods: {
        ...mapMutations("Modules/LayerSelection", ["addSelectedLayer", "removeSelectedLayer"]),

        /**
         * Listener for click on select all checkbox.
         * @returns {void}
         */
        clicked () {
            this.checked = !this.checked;
            this.confs.forEach(conf => {
                if (this.checked) {
                    this.addSelectedLayer({layerId: conf.id});
                }
                else {
                    this.removeSelectedLayer({layerId: conf.id});
                }
            });

        },
        /**
         * Returns true, if select all shall be checked.
         * @returns {Boolean} true, if select all shall be checked
         */
        isChecked () {
            this.checked = this.confs.every((conf) => this.layersToAdd.indexOf(conf.id) > -1);
            return this.checked;
        },
        /**
         * Returns the ids of the ids all layer configs as String.
         * @returns {String} of the ids all layer configs
         */
        ids () {
            return this.confs.map(conf => conf.id).join("-");
        }
    }
};
</script>

<template lang="html">
    <button
        :id="'select-all-layers-' + ids()"
        class="d-flex w-100 layer-tree-select-all pe-2 p-1 btn-transparent"
        @click="clicked()"
        @keydown.enter="clicked()"
    >
        <span
            :id="'select-all-checkbox-' + ids()"
            :class="[
                'layer-tree-select-all pe-2',
                {
                    'bi-check2-square': isChecked(),
                    'bi-square': !isChecked()
                }
            ]"
        />
        <label
            class="layer-tree-layer-label mt-0 d-flex flex-column align-self-start"
            :for="'select-all-checkbox-' + ids()"
            tabindex="0"
            :aria-label="$t('common:modules.layerSelection.selectAll')"
        >
            <span
                class="small-text"
            >
                {{ $t("common:modules.layerSelection.selectAll") }}
            </span>
        </label>
    </button>
</template>

<style lang="scss" scoped>
    @import "~variables";
    @import "~mixins";
    .btn-transparent {
        background-color: transparent;
        border:none;
    }
    .layer-tree-select-all {
        border-radius: 15px;
        &:hover {
            @include primary_action_hover;
        }
        &:focus {
            @include primary_action_focus;
        }
    }
    .layer-tree-layer-label {
        cursor: pointer;
    }
    .small-text {
    font-size: $font-size-sm;
    }

</style>

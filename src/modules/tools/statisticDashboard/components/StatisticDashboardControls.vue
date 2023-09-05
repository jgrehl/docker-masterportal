<script>

export default {
    name: "StatisticDashboardControls",
    props: {
        descriptions: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data () {
        return {
            currentDescriptionIndex: 0
        };
    },
    computed: {
        /**
         * Checks if there is at least one description
         * @returns {Boolean} True if there is one otherwise false.
         */
        hasDescription () {
            if (this.descriptions.length === 0) {
                return false;
            }
            return true;
        },
        /**
         * Gets the title of the current description.
         * @returns {void}
         */
        titleDescription () {
            return this.descriptions[this.currentDescriptionIndex].title;
        },
        /**
         * Gets the content of the current description.
         * @returns {void}
         */
        contentDescription () {
            return this.descriptions[this.currentDescriptionIndex].content;
        }
    },
    methods: {
        /**
         * Sets the description index one higher.
         * If the index reaches the end of the descriptions,it is set back to the beginning.
         * @returns {void}
         */
        nextDescription () {
            if (this.currentDescriptionIndex < this.descriptions.length - 1) {
                this.currentDescriptionIndex++;
            }
            else {
                this.currentDescriptionIndex = 0;
            }
        },
        /**
         * Sets the description index one lower.
         * If the index reaches the beginning of the descriptions, it is set to the end again.
         * @returns {void}
         */
        prevDescription () {
            if (this.currentDescriptionIndex > 0) {
                this.currentDescriptionIndex--;
            }
            else {
                this.currentDescriptionIndex = this.descriptions.length - 1;
            }
        }
    }
};
</script>

<template>
    <div class="d-flex flex-row flex-wrap align-items-baseline justify-content-between mb-3 dashboard-controls">
        <!-- Descriptions -->
        <div
            v-if="hasDescription"
            class="flex-grow-1 p-2 w-50 description"
        >
            <div class="hstack gap-1">
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="prevDescription"
                    @keydown="prevDescription"
                >
                    <i class="bi bi-chevron-left" />
                </button>
                <p class="pe-2 fs-6 description-content">
                    {{ titleDescription }}<br>{{ contentDescription }}
                </p>
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="nextDescription"
                    @keydown="nextDescription"
                >
                    <i class="bi bi-chevron-right" />
                </button>
            </div>
        </div>
        <!-- Controls -->
        <div class="btn-toolbar p-2">
            <div class="btn-group btn-group-sm me-2">
                <input
                    id="btnradio1"
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    autocomplete="off"
                    checked
                >
                <label
                    class="btn btn-outline-primary"
                    for="btnradio1"
                    role="button"
                    tabindex="0"
                    @click="$emit('showTable')"
                    @keydown.enter="$emit('showTable')"
                >
                    <i class="bi bi-table pe-2" />{{ $t("common:modules.tools.statisticDashboard.button.table") }}
                </label>
                <input
                    id="btnradio2"
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    autocomplete="off"
                >
                <label
                    class="btn btn-outline-primary"
                    for="btnradio2"
                    role="button"
                    tabindex="0"
                    @click="$emit('showChart')"
                    @keydown.enter="$emit('showCart')"
                >
                    <i class="bi bi-bar-chart pe-2" />{{ $t("common:modules.tools.statisticDashboard.button.chart") }}
                </label>
            </div>
            <div class="btn-group me-2">
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm lh-1"
                    @click="$emit('showDifference')"
                >
                    <i class="bi bi-intersect pe-2" />{{ $t("common:modules.tools.statisticDashboard.button.difference") }}
                </button>
            </div>
            <div
                class="btn-group"
            >
                <button
                    type="button"
                    class="btn btn-primary btn-sm lh-1"
                    @click="$emit('downloadData')"
                >
                    <i class="bi bi-download pe-2" />{{ $t("common:button.download") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.dashboard-controls {
    .description {
        .description-content {
            width: 350px;
        }
        .description-icons {
            opacity: 0.5;
        }
        .description-icons:hover {
            opacity: 1;
        }
    }
}

</style>

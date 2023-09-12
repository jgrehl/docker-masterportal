<script>
import {mapGetters, mapMutations} from "vuex";
import TableComponent from "../../../../share-components/table/components/TableComponent.vue";
import {getComponent} from "../../../../utils/getComponent";
import isObject from "../../../../utils/isObject";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersStatisticDashboard";
import GridComponent from "./StatisticGridComponent.vue";
import mutations from "../store/mutationsStatisticDashboard";
import Controls from "./StatisticDashboardControls.vue";
import StatisticFilter from "./StatisticDashboardFilter.vue";
import FetchDataHandler from "../utils/fetchData.js";
import StatisticsHandler from "../utils/handleStatistics.js";

export default {
    name: "StatisticDashboard",
    components: {
        ToolTemplate,
        TableComponent,
        GridComponent,
        Controls,
        StatisticFilter
    },
    data () {
        return {
            testData: {
                headers: ["Raumeinheit", "2023", "2022"],
                items: [
                    ["Harburg", 1234, 1234],
                    ["Ludwigslust Parchim", 23456, 1234],
                    ["Lübeck", 23475, 1234],
                    ["Niedersachsen", 34844, 1234]
                ]
            },
            testFixedData: {
                items: [
                    ["Bergedorf", 1234, 1234],
                    ["Wandsbek", 23456, 1234],
                    ["Altona", 23475, 1234]
                ]
            },
            selectMode: "column",
            showHeader: true,
            sortable: true,
            categories: null,
            statistics: false,
            loadedFilterData: false,
            timeStepsFilter: undefined,
            regions: [],
            areCategoriesGrouped: false,
            sortedRows: [],
            controlDescription: [{
                title: "Trappatoni 1",
                content: "Es gibt im Moment in diese Mannschaft, oh, einige Spieler vergessen ihnen Profi was sie sind."
            },
            {
                title: "Trappatoni 2 ",
                content: "Ich lese nicht sehr viele Zeitungen, aber ich habe gehört viele Situationen."
            },
            {
                title: "Trappatoni 3 ",
                content: "Letzte Spiel hatten wir in Platz drei Spitzen: Elber, Jancka und dann Zickler."
            }]
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },
    async mounted () {
        const uniqueValues = await this.getUniqueValuesForLevel(this.data[0]);

        if (uniqueValues[this.data[0]?.mappingFilter?.regionNameAttribute?.attrName] && uniqueValues[this.data[0]?.mappingFilter?.timeAttribute?.attrName]) {
            this.regions = Object.keys(uniqueValues[this.data[0]?.mappingFilter?.regionNameAttribute?.attrName]);
            this.timeStepsFilter = this.getTimestepsMerged(this.data[0]?.timeStepsFilter, uniqueValues[this.data[0]?.mappingFilter?.timeAttribute?.attrName]);
        }
        this.areCategoriesGrouped = StatisticsHandler.hasOneGroup(this.data[0]?.mappingFilter.statisticsAttributes);
        this.categories = StatisticsHandler.getCategoriesFromStatisticAttributes(this.data[0]?.mappingFilter.statisticsAttributes, this.areCategoriesGrouped);
        this.loadedFilterData = true;
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),

        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Gets the unique values for the inputs of the filter for the given level.
         * @param {Object} level The level to get the unique values for.
         * @param {Object} level.mappingFilter The mapping object which holds the configuration of the time attribute and region name attribute.
         * @param {Object} level.timeAttribute The config object for the time attribute.
         * @param {String} level.timeAttribute.attrName The attrName of the time attribute.
         * @param {String} level.timeAttribute.inputFormat The format of the incoming date.
         * @param {String} level.timeAttribute.outputFormat The format in which the date should be displayed to the user.
         * @param {Object} level.regionNameAttribute The config object of the region name attribute.
         * @param {String} level.regionNameAttribute.attrName The attrName of the region name attribute.
         * @returns {Object} An object with the time and region attrName as key and an unique value list as value.
         */
        async getUniqueValuesForLevel (level) {
            if (!isObject(level) || !isObject(level.mappingFilter) || !isObject(level.mappingFilter.timeAttribute) || !isObject(level.mappingFilter.regionNameAttribute)) {
                return {};
            }
            const layerId = level.layerId,
                timeAttribute = level.mappingFilter.timeAttribute.attrName,
                timeInputFormat = level.mappingFilter.timeAttribute.inputFormat,
                timeOutputFormat = level.mappingFilter.timeAttribute.outputFormat,
                regionNameAttribute = level.mappingFilter.regionNameAttribute.attrName;
            let uniqueValues = null;

            uniqueValues = await FetchDataHandler.getUniqueValues(layerId, [timeAttribute, regionNameAttribute], timeInputFormat, timeOutputFormat);
            return uniqueValues;
        },

        /**
         * Gets the time steps for the filter. It will merge the unique list with the given
         * configured time steps if they are configured.
         * @param {Object} timeSteps The time steps object with {Number: Label}.
         * @param {Object} uniqueList The list as object with {value: true}.
         * @returns {Object[]} The merged time steps.
         */
        getTimestepsMerged (timeSteps, uniqueList) {
            const result = [];
            let uniqueListAsArray = [];

            if (isObject(uniqueList)) {
                uniqueListAsArray = Object.keys(uniqueList);
                uniqueListAsArray.forEach(uniqueTime => {
                    result.push({value: uniqueTime, label: uniqueTime});
                });
            }
            if (isObject(timeSteps)) {
                Object.entries(timeSteps).forEach(([key, value]) => {
                    const uniqueTime = key === "all" ? uniqueListAsArray : uniqueListAsArray.slice(Number(`-${key}`));

                    if (Array.isArray(uniqueTime) && uniqueTime.length) {
                        result.push({value: uniqueTime, label: value});
                    }
                });
            }
            return result;
        },

        /**
         * Sets the statistics selected in the filter.
         * @param {String} categoryName - The category name.
         * @returns {void}
         */
        setStatistics (categoryName) {
            this.statistics = StatisticsHandler.getStatisticsByCategory(categoryName, this.data[0]?.mappingFilter.statisticsAttributes);
        },

        /**
         * Sets the sorted rows.
         * @param {Array[]} value - An array of arrays of sorted rows.
         * @returns {void}
         */
        setSortedRows (value) {
            this.sortedRows = value;
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div class="row justify-content-between">
                <div class="col-md-4">
                    <h4>{{ $t("common:modules.tools.statisticDashboard.headings.mrhstatistics") }}</h4>
                </div>
                <div class="col-md-auto">
                    <div class="btn-group btn-group-sm me-2">
                        <input
                            id="btnradio3"
                            type="radio"
                            class="btn-check"
                            name="btnradioArea"
                            autocomplete="off"
                            checked
                        >
                        <label
                            class="btn btn-outline-primary"
                            for="btnradio3"
                            role="button"
                            tabindex="0"
                        >{{ $t("common:modules.tools.statisticDashboard.label.communities") }}
                        </label>
                        <input
                            id="btnradio4"
                            type="radio"
                            class="btn-check"
                            name="btnradioArea"
                            autocomplete="off"
                        >
                        <label
                            class="btn btn-outline-primary"
                            for="btnradio4"
                            role="button"
                            tabindex="0"
                        >
                            {{ $t("common:modules.tools.statisticDashboard.label.districts") }}
                        </label>
                    </div>
                </div>
            </div>
            <StatisticFilter
                v-if="loadedFilterData"
                :categories="categories"
                :are-categories-grouped="areCategoriesGrouped"
                :statistics="statistics"
                :time-steps-filter="timeStepsFilter"
                :regions="regions"
                @changeCategory="setStatistics"
            />
            <div
                v-else
                class="d-flex justify-content-center"
            >
                <div
                    class="spinner-border spinner-color"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <hr>
            <Controls
                :descriptions="controlDescription"
            />
            <GridComponent>
                <template>
                    <TableComponent
                        :data="testData"
                        :fixed-data="testFixedData"
                        :select-mode="selectMode"
                        :show-header="showHeader"
                        :sortable="sortable"
                        @setSortedRows="setSortedRows"
                    />
                </template>
            </GridComponent>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>

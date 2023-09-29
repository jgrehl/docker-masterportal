<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
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
import FeaturesHandler from "../utils/handleFeatures.js";
import StatisticSwitcher from "./StatisticDashboardSwitcher.vue";
import {rawLayerList} from "@masterportal/masterportalapi";
import {getFeaturePOST} from "../../../../api/wfs/getFeature";
import ChartProcessor from "../utils/chartProcessor.js";
import {
    and as andFilter,
    equalTo as equalToFilter,
    or as orFilter
} from "ol/format/filter";
import dayjs from "dayjs";
import WFS from "ol/format/WFS";
import {sort} from "../../../../utils/sort";

export default {
    name: "StatisticDashboard",
    components: {
        ToolTemplate,
        TableComponent,
        GridComponent,
        Controls,
        StatisticFilter,
        StatisticSwitcher
    },
    data () {
        return {
            tableData: [],
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
            statisticsByCategory: false,
            loadedFilterData: false,
            loadedReferenceData: false,
            timeStepsFilter: [],
            regions: [],
            allRegions: [],
            areCategoriesGrouped: false,
            dates: [],
            selectedLevel: undefined,
            sortedRows: [],
            currentChart: {},
            chartCounts: 0,
            showTable: true,
            showChart: false,
            showGrid: false,
            referenceData: undefined
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters)),
        ...mapGetters("Maps", ["projection"]),

        /**
         * Gets the names of the selected statistics.
         * @returns {String[]} The names.
         */
        selectedStatisticsNames () {
            return Object.values(this.selectedStatistics).map(statistic => statistic?.name);
        },
        /**
         * Gets the Descriptions of the selected statistics.
         * @returns {Object[]} The Descriptions.
         */
        controlDescription () {
            if (!this.hasDescription(this.selectedStatistics)) {
                return [];
            }
            return this.setDescriptionsOfSelectedStatistics(this.selectedStatistics);
        },
        /**
         * Gets the buttons with group regions
         * @returns {Object[]} The button group regions
         */
        buttonGroupRegions () {
            if (!Array.isArray(this.data) || !this.data.length) {
                return [];
            }

            return this.data.map(value => {
                return {name: value?.levelName};
            });
        }
    },
    watch: {
        selectedReferenceData () {
            this.checkFilterSettings(this.selectedRegionsValues, this.selectedDatesValues, this.selectedReferenceData);
        }
    },
    async created () {
        this.$on("close", this.close);
        this.layer = await this.addNewLayerIfNotExists({layerName: "statistic-dashboard"});
    },
    async mounted () {
        this.selectedLevel = this.data[0];
        const uniqueValues = await this.getUniqueValuesForLevel(this.selectedLevel),
            selectedLevelRegionNameAttribute = this.getSelectedLevelRegionNameAttribute(this.selectedLevel),
            selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(this.selectedLevel);

        if (uniqueValues[selectedLevelRegionNameAttribute.attrName] && uniqueValues[selectedLevelDateAttribute.attrName]) {
            this.regions = sort("", Object.keys(uniqueValues[selectedLevelRegionNameAttribute.attrName]), "value");
            this.allRegions = this.getAllRegions(this.regions);
            this.dates = Object.keys(uniqueValues[selectedLevelDateAttribute.attrName]);
            this.timeStepsFilter = this.getTimestepsMerged(this.selectedLevel?.timeStepsFilter, uniqueValues[selectedLevelDateAttribute.attrName], selectedLevelDateAttribute.inputFormat, selectedLevelDateAttribute.outputFormat);
        }
        this.areCategoriesGrouped = StatisticsHandler.hasOneGroup(this.getSelectedLevelStatisticsAttributes(this.selectedLevel));
        this.categories = sort("", StatisticsHandler.getCategoriesFromStatisticAttributes(this.getSelectedLevelStatisticsAttributes(this.selectedLevel), this.areCategoriesGrouped), "name");
        this.loadedFilterData = true;
        this.loadedReferenceData = true;
        this.referenceData = {
            "date": this.getTimestepsMerged(undefined, uniqueValues[selectedLevelDateAttribute.attrName], selectedLevelDateAttribute.inputFormat, selectedLevelDateAttribute.outputFormat),
            "region": this.regions
        };
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),
        ...mapActions("Maps", ["addNewLayerIfNotExists"]),

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
         * @param {String} inputFormat The input format for the date.
         * @param {String} outputFormat The format to transform the date to.
         * @returns {Object[]} The merged time steps.
         */
        getTimestepsMerged (timeSteps, uniqueList, inputFormat, outputFormat) {
            let result = [],
                uniqueListAsArray = [];

            if (isObject(uniqueList)) {
                uniqueListAsArray = Object.keys(uniqueList);
                uniqueListAsArray.forEach(uniqueTime => {
                    result.push({value: uniqueTime, label: dayjs(uniqueTime, inputFormat).format(outputFormat)});
                });

                result = sort("", result, "label").reverse();
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
         * Gets all regions list with all option
         * @param {String[]} regions The regions.
         * @returns {Object[]} All regions
         */
        getAllRegions (regions) {
            const result = [];

            if (!Array.isArray(regions) || !regions.length) {
                return [];
            }

            regions.forEach(region => {
                result.push({value: region, label: region});
            });

            result.push({value: regions, label: "Alle Gebiete"});

            return result;
        },

        /**
         * Sets the statistics selected in the filter.
         * @param {String} categoryName - The category name.
         * @returns {void}
         */
        setStatisticsByCategory (categoryName) {
            this.statisticsByCategory = StatisticsHandler.getStatisticsByCategory(categoryName, this.getSelectedLevelStatisticsAttributes(this.selectedLevel));
        },

        /**
         * Sets the sorted rows.
         * @param {Array[]} value - An array of arrays of sorted rows.
         * @returns {void}
         */
        setSortedRows (value) {
            this.sortedRows = value;
        },

        /**
         * Checks if there is a reference value for the regions or dates and merges them.
         * @param {String[]} regions - The selected regions for the statistic(s).
         * @param {String[]} dates - The selected dates for the statistic(s).
         * @param {Object} referenceData - The selected reference data.
         * @returns {void}
         */
        checkFilterSettings (regions, dates, referenceData) {
            if (typeof referenceData.value === "string") {
                this.handleFilterSettings([...regions, referenceData.value], dates, "region");
            }
            else if (isObject(referenceData?.value) && typeof referenceData.value.label === "string") {
                this.handleFilterSettings(regions, [...dates, referenceData.value.value], "date");
            }
            else {
                this.handleFilterSettings(regions, dates, false);
            }
        },

        /**
         * Handles the filter settings and starts a POST request based on given settings.
         * @param {String[]} regions - The selected regions for the statistic(s).
         * @param {String[]} dates - The selected dates for the statistic(s).
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {void}
         */
        async handleFilterSettings (regions, dates, differenceMode) {
            this.layer.getSource().clear();
            const statsKeys = StatisticsHandler.getStatsKeysByName(this.statisticsByCategory, this.selectedStatisticsNames),
                selectedLayer = this.getRawLayerByLayerId(this.selectedLevel.layerId),
                selectedLevelRegionNameAttribute = this.getSelectedLevelRegionNameAttribute(this.selectedLevel),
                selectedLevelDateAttribute = this.getSelectedLevelDateAttribute(this.selectedLevel),
                payload = {
                    featureTypes: [selectedLayer.featureType],
                    featureNS: selectedLayer.featureNS,
                    srsName: this.projection.getCode(),
                    propertyNames: [...statsKeys, selectedLevelRegionNameAttribute.attrName, selectedLevelDateAttribute.attrName, this.selectedLevel.geometryAttribute],
                    filter: this.getFilter(regions, dates)
                },
                response = await getFeaturePOST(selectedLayer.url, payload, error => {
                    console.error(error);
                }),
                features = new WFS().readFeatures(response),
                filteredFeatures = FeaturesHandler.filterFeaturesByKeyValue(features, selectedLevelDateAttribute.attrName, dates[0]);

            this.statisticsData = this.prepareStatisticsData(features, this.selectedStatisticsNames, regions, dates, selectedLevelDateAttribute, selectedLevelRegionNameAttribute, differenceMode);
            this.tableData = this.getTableData(this.statisticsData);
            this.chartCounts = this.selectedStatisticsNames.length;
            this.handleChartData(this.selectedStatisticsNames, regions, dates, this.statisticsData);

            this.layer.getSource().addFeatures(filteredFeatures);
            FeaturesHandler.styleFeaturesByStatistic(filteredFeatures, statsKeys[0], this.colorScheme);
        },

        /**
         * Handles chart data and resets the showGrid property.
         * @param {String[]} filteredStatistics The statistics.
         * @param {String[]} regions The regions.
         * @param {String[]} dates The dates.
         * @param {Object} preparedData The prepared data.
         * @returns {void}
         */
        handleChartData (filteredStatistics, regions, dates, preparedData) {
            const directionBarChart = regions.length < 5 ? "vertical" : "horizontal";

            this.showGrid = false;
            if (filteredStatistics.length > 1) {
                this.prepareGridCharts(filteredStatistics, preparedData, directionBarChart, dates.length > 1);
            }
            else if (regions.length >= 1) {
                this.$nextTick(() => {
                    if (dates.length > 1) {
                        this.prepareChartData(filteredStatistics[0], preparedData[filteredStatistics[0]], undefined, "line");
                        return;
                    }
                    this.prepareChartData(filteredStatistics[0], preparedData[filteredStatistics[0]], undefined, "bar", directionBarChart);
                });
            }
        },
        /**
         * Prepares the charts for the grid and also creates canvas elements for each chart to render on.
         * @param {String[]} filteredStatistics The statistics.
         * @param {Object} preparedData The prepared data.
         * @param {String[]} direction - Direction of bar chart.
         * @param {Boolean} renderAsLine Flag to render line charts. Default is false.
         * @returns {void}
         */
        prepareGridCharts (filteredStatistics, preparedData, direction, renderAsLine = false) {
            this.showGrid = true;
            this.$nextTick(() => {
                filteredStatistics.forEach((statistic, idx) => {
                    const ctx = this.$refs[`chart${idx + 1}`],
                        ctxInModal = this.$refs[`chart-modal-${idx + 1}`];

                    if (renderAsLine) {
                        this.prepareChartData(statistic, preparedData[statistic], ctx, "line", undefined, true);
                        this.prepareChartData(statistic, preparedData[statistic], ctxInModal, "line", undefined, false, true);
                        return;
                    }
                    this.prepareChartData(statistic, preparedData[statistic], ctx, "bar", direction, true);
                    this.prepareChartData(statistic, preparedData[statistic], ctxInModal, "bar", direction, false, true);
                });
            });
        },
        /**
         * Prepares the chart and also handles the destruction of previuos charts.
         * @param {String} topic The topic of the chart.
         * @param {Object} preparedData The data.
         * @param {HTMLElement} canvas The canvas to render the chart on.
         * @param {String} type The type. Can be bar or line.
         * @param {String} direction The direction of the bar chart.
         * @param {Boolean} renderSimple true if should be rendered as simple chart because its in the grid. Default is false.
         * @param {Boolean} renderToModal true if chart is rendered in modal. Default is false
         * @returns {void}
         */
        prepareChartData (topic, preparedData, canvas, type, direction, renderSimple = false, renderToModal = false) {
            const chart = canvas || this.$refs.chart,
                uniqueTopic = renderToModal ? `modal-${topic}` : topic;

            if (typeof this.currentChart[uniqueTopic] !== "undefined") {
                this.currentChart[uniqueTopic].chart.destroy();
            }
            this.currentChart[uniqueTopic] = {};
            if (type === "line") {
                this.currentChart[uniqueTopic].chart = ChartProcessor.createLineChart(topic, preparedData, chart, renderSimple);
            }
            else if (type === "bar") {
                this.currentChart[uniqueTopic].chart = ChartProcessor.createBarChart(topic, preparedData, direction, chart, renderSimple);
            }
        },

        /**
         * Gets the filter based on given regions and dates array.
         * Gets an Or Filter if one of them has more than one entry.
         * Gets an And Filter if both of them has entries.
         * Gets an EqualTo Filter if one of them has only one entry.
         * @param {String[]} regions The regions.
         * @param {String[]} dates The dates.
         * @returns {ol/format/filter} The filter.
         */
        getFilter (regions, dates) {
            if (!Array.isArray(regions) || !Array.isArray(dates)) {
                return undefined;
            }
            const regionAttrName = this.getSelectedLevelRegionNameAttribute(this.selectedLevel)?.attrName,
                dateAttrName = this.getSelectedLevelDateAttribute(this.selectedLevel)?.attrName;

            if (regions.length === this.regions.length) {
                if (dates.length === this.dates.length) {
                    return undefined;
                }
                return this.getFilterForList(dates, dateAttrName);
            }
            else if (dates.length === this.dates.length) {
                return this.getFilterForList(regions, regionAttrName);
            }
            return andFilter(this.getFilterForList(dates, dateAttrName), this.getFilterForList(regions, regionAttrName));
        },
        /**
         * Gets the filter for given list and property.
         * If given list has more than one entry the function returns an
         * Or Filter otherwise an EqualTo Filter.
         * @param {String[]} list The list to create a filter for.
         * @param {String} propertyName The propertyName to create a filter for.
         * @returns {ol/format/filter} The filter.
         */
        getFilterForList (list, propertyName) {
            if (!Array.isArray(list) || typeof propertyName !== "string") {
                return undefined;
            }

            const filterArray = list.map(entry => equalToFilter(propertyName, entry));

            return filterArray.length > 1 ? orFilter(...filterArray) : filterArray[0];
        },

        /**
         * Gets the data for the table from the prepared statistics.
         * @param {Object} statisticsData - Prepared statistical data.
         * @returns {Object[]} Data for table with header and items.
         */
        getTableData (statisticsData) {
            const headers = [],
                data = [];

            Object.keys(statisticsData).forEach(statData => {
                const items = [];

                Object.entries(statisticsData[statData]).forEach(([region, years]) => {
                    items.push([region, ...Object.values(years).reverse()]);
                    if (headers.length === 0) {
                        headers.push("Gebiet", ...Object.keys(years).reverse());
                    }
                });
                data.push({
                    headers,
                    items
                });
            });
            return data;
        },

        /**
         * Prepares the statistical data from the features.
         * @param {ol/Feature[]} features - The features.
         * @param {String[]} statistics - The key to the statistic whose value is being looked for.
         * @param {String[]} regions - The regions of the statistic wanted.
         * @param {String[]} dates - The dates of the statsitic wanted.
         * @param {String} dateAttribute - The configured date attribute.
         * @param {String} regionAttribute - The configured region attribute.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {Object} The prepared statistical data.
         */
        prepareStatisticsData (features, statistics, regions, dates, dateAttribute, regionAttribute, differenceMode) {
            const data = {};

            statistics.forEach(stat => {
                const statsKey = StatisticsHandler.getStatsKeysByName(this.statisticsByCategory, [stat])[0];

                data[stat] = {};
                regions.forEach(region => {
                    if (region === this.selectedReferenceData?.value) {
                        return;
                    }
                    data[stat][region] = {};
                    dates.forEach(date => {
                        if (date === this.selectedReferenceData?.value?.value) {
                            return;
                        }
                        const formatedDate = dayjs(date).format(dateAttribute.outputFormat),
                            regionKey = regionAttribute.attrName,
                            dateKey = dateAttribute.attrName;

                        data[stat][region][formatedDate] = this.getStatisticValue(features, statsKey, region, regionKey, date, dateKey, differenceMode);
                    });
                });
            });
            return data;
        },

        /**
         * Finds the feature based on the region and the date.
         * Returns the corresponding value of the passed statistic from the feature.
         * @param {ol/Feature[]} features - The features.
         * @param {String[]} statisticKey - The key to the statistic whose value is being looked for.
         * @param {String} region - The region of the statistic wanted.
         * @param {String} regionKey - The key to the region.
         * @param {String} date - The date of the statsitic wanted.
         * @param {String} dateKey - The key to the date.
         * @param {String|Boolean} differenceMode - Indicates the difference mode('date' or 'region') ohterwise false.
         * @returns {String} The value of the given statistic.
         */
        getStatisticValue (features, statisticKey, region, regionKey, date, dateKey, differenceMode) {
            const foundFeature = this.findFeatureByDateAndRegion(features, region, regionKey, date, dateKey);

            if (differenceMode === "date") {
                const refFeature = this.findFeatureByDateAndRegion(features, region, regionKey, this.selectedReferenceData.value.value, dateKey);

                return (parseInt(foundFeature?.get(statisticKey), 10) - parseInt(refFeature?.get(statisticKey), 10)) || "-";
            }
            if (differenceMode === "region") {
                const refFeature = this.findFeatureByDateAndRegion(features, this.selectedReferenceData.value, regionKey, date, dateKey);

                return (parseInt(foundFeature?.get(statisticKey), 10) - parseInt(refFeature?.get(statisticKey), 10)) || "-";
            }

            return parseInt(foundFeature?.get(statisticKey), 10) || "-";
        },

        /**
         * Finds a feature by the given region and date.
         * @param {ol/Feature[]} features - The features.
         * @param {String} region - The region value.
         * @param {String} regionKey - The key to the region.
         * @param {String} date - The date value.
         * @param {String} dateKey - The key to the date.
         * @returns {ol/Feature} The found feature.
         */
        findFeatureByDateAndRegion (features, region, regionKey, date, dateKey) {
            return features.find(feature => {
                return feature.get(regionKey) === region && feature.get(dateKey) === date;
            });
        },

        /**
         * Gets the currently selected layer by the given level.
         * @param {String} layerId The layer id.
         * @returns {Object} The layer.
         */
        getRawLayerByLayerId (layerId) {
            return rawLayerList.getLayerWhere({id: layerId}) || {};
        },

        /**
         * Gets the region attribute object by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The region attribute object.
         */
        getSelectedLevelRegionNameAttribute (level) {
            return level?.mappingFilter?.regionNameAttribute || {};
        },

        /**
         * Gets the date attribute by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The time attribute object.
         */
        getSelectedLevelDateAttribute (level) {
            return level?.mappingFilter?.timeAttribute || {};
        },

        /**
         * Gets the statistic attributes by the given level.
         * @param {Object} level The level object.
         * @returns {Object} The statistics attribute object.
         */
        getSelectedLevelStatisticsAttributes (level) {
            return level?.mappingFilter.statisticsAttributes || {};
        },

        /**
         * Toggles between chart and table.
         * @returns {void}
         */
        toggleChartTable () {
            this.showChart = !this.showChart;
            this.showTable = !this.showTable;
        },
        /**
         * Reset tables and charts.
         * @returns {void}
         */
        handleReset () {
            this.layer.getSource().clear();
            this.tableData = [];
            Object.values(this.currentChart).forEach(val => {

                val.chart.destroy();
            });
            this.currentChart = {};
            this.showGrid = false;
        },
        /**
         * Checks if at least one description is present in the statistics.
         * @param {Object} statistics - The selected statistics.
         * @returns {Boolean} true if a description is present.
         */
        hasDescription (statistics) {
            let isDescriptionAvailable = false;

            Object.values(statistics).forEach(stat => {
                if (Object.prototype.hasOwnProperty.call(stat, "description")) {
                    isDescriptionAvailable = true;
                }
            });
            return isDescriptionAvailable;
        },
        /**
         * Sets the title and the content of the descriptions of the selected statistics.
         * @param {Object} statistics - The selected statistics.
         * @returns {Object[]} The descriptions.
         */
        setDescriptionsOfSelectedStatistics (statistics) {
            const descriptions = [];

            Object.values(statistics).map(statistic => {
                return descriptions.push({"title": statistic?.name, "content": statistic?.description !== undefined ? statistic?.description : "Diese Satistik enthält keine Beschreibung."});
            });
            return descriptions;
        },
        /**
         * Gets the metadata link.
         * @returns {String} Empty if no metadata was found - otherwise it returns the url.
         */
        getMetadataLink () {
            if (!isObject(this.selectedLevel)) {
                return "";
            }
            const currentLayer = this.getRawLayerByLayerId(this.selectedLevel.layerId);

            if (!isObject(currentLayer) || !Array.isArray(currentLayer.datasets) || !isObject(currentLayer.datasets[0])
                || !currentLayer.datasets[0].show_doc_url || typeof currentLayer.datasets[0].md_id === "undefined") {
                return "";
            }

            return `${currentLayer.datasets[0].show_doc_url}${currentLayer.datasets[0].md_id}`;
        },
        /**
         * Opens the metadata in a new tab.
         * @returns {void}
         */
        openMetadata () {
            const metadataUrl = this.getMetadataLink();

            if (!metadataUrl) {
                return;
            }
            window.open(metadataUrl, "_blank");
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
        class="static-dashboard"
    >
        <template #toolBody>
            <div class="row justify-content-between">
                <div class="col-md-4 d-flex align-items-center">
                    <h4 class="mb-0">
                        {{ $t("common:modules.tools.statisticDashboard.headings.mrhstatistics") }}
                    </h4>
                    <div
                        v-if="getMetadataLink()"
                        class="mx-2"
                        role="button"
                        tabindex="0"
                        @click="openMetadata"
                        @keypress.enter="openMetadata"
                    >
                        <span class="bootstrap-icon">
                            <i
                                class="bi-info-circle-fill"
                                :title="$t('common:modules.tools.statisticDashboard.headings.mrhstatisticsTooltip')"
                            />
                        </span>
                    </div>
                </div>
                <div
                    v-if="buttonGroupRegions.length > 1"
                    class="col-md-auto"
                >
                    <StatisticSwitcher
                        :buttons="buttonGroupRegions"
                        group="regions"
                        class="level-switch"
                    />
                </div>
            </div>
            <StatisticFilter
                v-if="loadedFilterData"
                :categories="categories"
                :are-categories-grouped="areCategoriesGrouped"
                :statistics="statisticsByCategory"
                :time-steps-filter="timeStepsFilter"
                :regions="allRegions"
                @changeCategory="setStatisticsByCategory"
                @changeFilterSettings="checkFilterSettings"
                @resetStatistics="handleReset"
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
            <hr class="mb-0">
            <Controls
                v-if="loadedReferenceData"
                :descriptions="controlDescription"
                :reference-data="referenceData"
                @showChartTable="toggleChartTable"
            />
            <div v-show="showTable">
                <div v-if="!showGrid">
                    <TableComponent
                        v-for="(data, index) in tableData"
                        :key="index"
                        :title="selectedStatisticsNames[index]"
                        :data="data"
                        :fixed-data="testFixedData"
                        :select-mode="selectMode"
                        :show-header="showHeader"
                        :sortable="sortable"
                        class="mx-5"
                        @setSortedRows="setSortedRows"
                    />
                </div>
                <GridComponent
                    v-else
                    :dates="tableData"
                    :titles="selectedStatisticsNames"
                >
                    <template
                        slot="tableContainers"
                        slot-scope="props"
                    >
                        <TableComponent
                            :data="props.data"
                            :fixed-data="testFixedData"
                            :show-header="showHeader"
                            @setSortedRows="setSortedRows"
                        />
                    </template>
                    <template
                        slot="tableContainersModal"
                        slot-scope="props"
                    >
                        <TableComponent
                            :data="props.data"
                            :fixed-data="testFixedData"
                            :show-header="showHeader"
                            :sortable="sortable"
                            @setSortedRows="setSortedRows"
                        />
                    </template>
                </GridComponent>
            </div>
            <div v-show="showChart">
                <canvas
                    v-if="!showGrid"
                    ref="chart"
                    class="chart-container"
                />
                <GridComponent
                    v-else
                    :charts-count="chartCounts"
                    :titles="selectedStatisticsNames"
                >
                    <template
                        slot="chartContainers"
                        slot-scope="props"
                    >
                        <canvas
                            :id="'chart' + props.chartId"
                            :ref="'chart' + props.chartId"
                        />
                    </template>
                    <template
                        slot="chartContainersModal"
                        slot-scope="propsModal"
                    >
                        <canvas
                            :id="'chart-modal-' + propsModal.chartId"
                            :ref="'chart-modal-' + propsModal.chartId"
                        />
                    </template>
                </GridComponent>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>

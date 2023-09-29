import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticDashboard from "../../../components/StatisticDashboard.vue";
import indexStatisticDashboard from "../../../store/indexStatisticDashboard";
import sinon from "sinon";
import fetchData from "../../../utils/fetchData";
import ChartProcessor from "../../../utils/chartProcessor";
import {
    and as andFilter,
    equalTo as equalToFilter
} from "ol/format/filter";
import Feature from "ol/Feature.js";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("/src/modules/tools/StatisticDashboard.vue", () => {
    const store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: indexStatisticDashboard
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        projection: () => "EPSG:25832"
                    }
                }
            }
        }),
        featureList = [
            new Feature({
                bev_maennlich: "13",
                bev_weiblich: "12",
                jahr: "1890",
                ort: "Hamburg"

            }),
            new Feature({
                bev_maennlich: "113",
                bev_weiblich: "112",
                jahr: "1990",
                ort: "Hamburg"
            }),
            new Feature({
                bev_maennlich: "93",
                bev_weiblich: "92",
                jahr: "1990",
                ort: "Bremen"
            })
        ];

    describe("Component DOM", () => {
        it("Level name as switch button should not exist", () => {
            const wrapper = shallowMount(StatisticDashboard, {
                localVue,
                store
            });

            expect(wrapper.find(".level-switch").exists()).to.be.false;
            wrapper.destroy();
        });

        it("Level name as switch button should exist", () => {
            const wrapper = shallowMount(StatisticDashboard, {
                computed: {
                    buttonGroupRegions: () => [
                        {
                            "levelName": "test1"
                        },
                        {
                            "levelName": "test2"
                        }
                    ]
                },
                localVue,
                store
            });

            expect(wrapper.find(".level-switch").exists()).to.be.true;
            wrapper.destroy();
        });
    });

    describe("watchers", () => {
        it("should call 'checkFilterSettings' if selectedReferenceData is changed", async () => {
            const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                }),
                spyCheckFilterSettings = sinon.stub(wrapper.vm, "checkFilterSettings");

            store.commit("Tools/StatisticDashboard/setSelectedReferenceData", undefined);
            await wrapper.vm.$nextTick();
            expect(spyCheckFilterSettings.calledOnce).to.be.true;
            sinon.restore();
        });
    });

    describe("methods", () => {
        describe("getUniqueValuesForLevel", () => {
            it("should return an empty object if first parm is not an object", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(await wrapper.vm.getUniqueValuesForLevel(undefined)).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel([])).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel(null)).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel(true)).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel(false)).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel(1234)).to.be.an("object").that.is.empty;
                expect(await wrapper.vm.getUniqueValuesForLevel("1234")).to.be.an("object").that.is.empty;
            });
            it("should return an empty object if first param has no child object called mappingFilter", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(await wrapper.vm.getUniqueValuesForLevel({})).to.be.an("object").that.is.empty;
            });
            it("should return an empty object if first param has a child object but not expected structure", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(await wrapper.vm.getUniqueValuesForLevel({
                    mappingFilter: {}
                })).to.be.an("object").that.is.empty;
            });
            it("should call expected function with expected params", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    layerId = "1234",
                    attrNames = [
                        "fooBAR",
                        "fowWaw"
                    ];

                sinon.stub(fetchData, "getUniqueValues");
                await wrapper.vm.getUniqueValuesForLevel({
                    layerId,
                    mappingFilter: {
                        timeAttribute: {
                            attrName: "fooBAR"
                        },
                        regionNameAttribute: {
                            attrName: "fowWaw"
                        }
                    }
                });

                expect(fetchData.getUniqueValues.calledWith(layerId, attrNames, undefined, undefined)).to.be.true;
                sinon.restore();
            });
        });
        describe("getTimestepsMerged", () => {
            it("should return an empty array if first param and second param are not objects", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getTimestepsMerged(undefined, undefined)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged(null, null)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged([], [])).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged(true, true)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged(false, false)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged(1234, 1234)).to.be.an("array").that.is.empty;
                expect(wrapper.vm.getTimestepsMerged("1234", "1234")).to.be.an("array").that.is.empty;
            });
            it("should return an empty array if second param is not an object but first is", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getTimestepsMerged({foo: "bar"})).to.be.an("array").that.is.empty;
            });
            it("should return only the values of the second param as array with invalid dates", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    uniqueList = {foo: true, bar: true},
                    expected = [{value: "bar", label: "Invalid Date"}, {value: "foo", label: "Invalid Date"}];

                expect(wrapper.vm.getTimestepsMerged(undefined, uniqueList)).to.deep.equal(expected);
            });
            it("should return a merged array based of the given two objects", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    uniqueList = {bar: true, buz: true, foo: true},
                    configSteps = {2: "Last 2 Years"},
                    expected = [{value: "foo", label: "Invalid Date"}, {value: "buz", label: "Invalid Date"}, {value: "bar", label: "Invalid Date"}, {value: ["buz", "foo"], label: "Last 2 Years"}];

                expect(wrapper.vm.getTimestepsMerged(configSteps, uniqueList)).to.deep.equal(expected);
            });
        });
        describe("getAllRegions", () => {
            it("should return an empty array if there are no regions found", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getAllRegions(undefined)).to.deep.equal([]);
                expect(wrapper.vm.getAllRegions("")).to.deep.equal([]);
                expect(wrapper.vm.getAllRegions(true)).to.deep.equal([]);
                expect(wrapper.vm.getAllRegions({})).to.deep.equal([]);
                expect(wrapper.vm.getAllRegions(true)).to.deep.equal([]);
                expect(wrapper.vm.getAllRegions(0)).to.deep.equal([]);
            });

            it("should return an array with all option", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getAllRegions(["test", "test2"])).to.deep.equal([
                    {value: "test", label: "test"},
                    {value: "test2", label: "test2"},
                    {value: ["test", "test2"], label: "Alle Gebiete"}
                ]);
            });
        });
        describe("getFilter", () => {
            it("should return undefined if given params has the same length as the data variables", () => {
                const regions = ["foo", "bar"],
                    dates = ["01.01.1999", "01.01.2000"],
                    wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    });

                wrapper.vm.regions = regions;
                wrapper.vm.dates = dates;

                expect(wrapper.vm.getFilter(regions, dates)).to.be.undefined;
            });
            it("should call getFilterForList with expected params if regions is the same length as the data variable", () => {
                const regions = ["foo", "bar"],
                    dates = ["01.01.1999", "01.01.2000"],
                    wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    getFilterForListSpy = sinon.spy(wrapper.vm, "getFilterForList");

                wrapper.vm.regions = regions;
                wrapper.vm.dates = ["01.01.1999"];

                wrapper.vm.getFilter(regions, dates);
                expect(getFilterForListSpy.calledWith(dates, undefined)).to.be.true;
                sinon.restore();
            });
            it("should call getFilterForList with expected params if dates is the same length as the data variable", () => {
                const regions = ["foo", "bar"],
                    dates = ["01.01.1999", "01.01.2000"],
                    wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    getFilterForListSpy = sinon.spy(wrapper.vm, "getFilterForList");

                wrapper.vm.regions = ["foo"];
                wrapper.vm.dates = dates;

                wrapper.vm.getFilter(regions, dates);
                expect(getFilterForListSpy.calledWith(regions, undefined)).to.be.true;
                sinon.restore();
            });
            it("should return an and filter if given regions and dates have values but not the same length as the data values", () => {
                const regions = ["foo"],
                    dates = ["01.01.1999"],
                    eq1 = equalToFilter("bar", "foo"),
                    eq2 = equalToFilter("bow", "01.01.1999"),
                    expected = andFilter(eq2, eq1),
                    wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    });

                wrapper.vm.regions = [...regions, "faw"];
                wrapper.vm.dates = [...dates, "01.01.2001"];
                wrapper.vm.selectedLevel = {
                    mappingFilter: {
                        timeAttribute: {
                            attrName: "bow"
                        },
                        regionNameAttribute: {
                            attrName: "bar"
                        }
                    }
                };

                expect(wrapper.vm.getFilter(regions, dates)).to.deep.equal(expected);
            });
        });
        describe("getFilterForList", () => {
            it("should return undefined if given list is not an array", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                    localVue,
                    store
                });

                expect(wrapper.vm.getFilterForList(undefined)).to.be.undefined;
                expect(wrapper.vm.getFilterForList({})).to.be.undefined;
                expect(wrapper.vm.getFilterForList(null)).to.be.undefined;
                expect(wrapper.vm.getFilterForList(true)).to.be.undefined;
                expect(wrapper.vm.getFilterForList(false)).to.be.undefined;
                expect(wrapper.vm.getFilterForList("1234")).to.be.undefined;
                expect(wrapper.vm.getFilterForList(1234)).to.be.undefined;
            });
            it("should return an equalTo filter", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    result = wrapper.vm.getFilterForList(["foo"], "bar");

                expect(result.tagName_).to.be.equal("PropertyIsEqualTo");
            });
            it("should return an equalTo filter", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    result = wrapper.vm.getFilterForList(["foo", "fow"], "bar");


                expect(result.tagName_).to.be.equal("Or");
            });
        });
        describe("getStatisticValue", () => {
            it("should return the right statistic value", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    value = wrapper.vm.getStatisticValue(featureList, "bev_maennlich", "Hamburg", "ort", "1890", "jahr");

                expect(value).to.be.equal(13);
            });
            it("should call prepareChartData with expected params for line chart", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    value = wrapper.vm.getStatisticValue(featureList, "bev_maennlich", "Hamburg", "ort", "1790", "jahr");

                expect(value).to.be.equal("-");
            });

            it("should return the right statistic value if reference date is set", () => {
                store.commit("Tools/StatisticDashboard/setSelectedReferenceData", {value: {value: "1990"}});

                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    value = wrapper.vm.getStatisticValue(featureList, "bev_maennlich", "Hamburg", "ort", "1890", "jahr", "date");

                expect(value).to.be.equal(-100);
            });

            it("should return the right statistic value if reference region is set", () => {
                store.commit("Tools/StatisticDashboard/setSelectedReferenceData", {value: "Bremen"});

                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    value = wrapper.vm.getStatisticValue(featureList, "bev_maennlich", "Hamburg", "ort", "1990", "jahr", "region");

                expect(value).to.be.equal(20);
            });
        });
        describe("prepareStatisticsData", () => {
            it("should return an object representing the statistics from the features", () => {
                store.commit("Tools/StatisticDashboard/setSelectedReferenceData", {});

                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {
                        "Bevölkerung maennlich": {
                            Hamburg: {
                                "1890": 13,
                                "1990": 113
                            }
                        },
                        "Bevölkerung weiblich": {
                            Hamburg: {
                                "1890": 12,
                                "1990": 112
                            }
                        }
                    };

                wrapper.vm.statisticsByCategory = {
                    "bev_maennlich": {
                        "name": "Bevölkerung maennlich"
                    },
                    "bev_weiblich": {
                        "name": "Bevölkerung weiblich"
                    }
                };

                expect(wrapper.vm.prepareStatisticsData(featureList, ["Bevölkerung maennlich", "Bevölkerung weiblich"], ["Hamburg"], ["1890", "1990"], {outputFormat: "YYYY", attrName: "jahr"}, {attrName: "ort"})).to.deep.equal(statistics);
            });

            it("should return an object representing the statistics from the features without the reference date", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {
                        "Bevölkerung maennlich": {
                            Hamburg: {
                                "1990": 113
                            }
                        },
                        "Bevölkerung weiblich": {
                            Hamburg: {
                                "1990": 112
                            }
                        }
                    };

                wrapper.vm.statisticsByCategory = {
                    "bev_maennlich": {
                        "name": "Bevölkerung maennlich"
                    },
                    "bev_weiblich": {
                        "name": "Bevölkerung weiblich"
                    }
                };

                store.commit("Tools/StatisticDashboard/setSelectedReferenceData", {value: {value: "1890"}});
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.prepareStatisticsData(featureList, ["Bevölkerung maennlich", "Bevölkerung weiblich"], ["Hamburg"], ["1890", "1990"], {outputFormat: "YYYY", attrName: "jahr"}, {attrName: "ort"})).to.deep.equal(statistics);
            });
            it("should return an object representing the statistics from the features without the reference region", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {
                        "Bevölkerung maennlich": {
                            Bremen: {
                                "1890": "-",
                                "1990": 93
                            }
                        },
                        "Bevölkerung weiblich": {
                            Bremen: {
                                "1890": "-",
                                "1990": 92
                            }
                        }
                    };

                wrapper.vm.statisticsByCategory = {
                    "bev_maennlich": {
                        "name": "Bevölkerung maennlich"
                    },
                    "bev_weiblich": {
                        "name": "Bevölkerung weiblich"
                    }
                };

                store.commit("Tools/StatisticDashboard/setSelectedReferenceData", {value: "Hamburg"});
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.prepareStatisticsData(featureList, ["Bevölkerung maennlich", "Bevölkerung weiblich"], ["Hamburg", "Bremen"], ["1890", "1990"], {outputFormat: "YYYY", attrName: "jahr"}, {attrName: "ort"})).to.deep.equal(statistics);
            });
        });
        describe("getTableData", () => {
            it("should return the data for the table(s) from the statistics object", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    preparedData = {
                        "Bevölkerung maennlich": {
                            Hamburg: {
                                "1890": "13",
                                "1990": "113"
                            }
                        },
                        "Bevölkerung weiblich": {
                            Hamburg: {
                                "1890": "12",
                                "1990": "112"
                            }
                        }
                    },
                    expectedValue = [{
                        headers: ["Gebiet", "1990", "1890"],
                        items: [[
                            "Hamburg", "113", "13"
                        ]]
                    },
                    {
                        headers: ["Gebiet", "1990", "1890"],
                        items: [[
                            "Hamburg", "112", "12"
                        ]]
                    }];

                expect(wrapper.vm.getTableData(preparedData)).to.deep.equal(expectedValue);
            });

        });
        describe("handleChartData", () => {
            it("should call prepareGridCharts with expected params", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    prepareGridChartsStub = sinon.stub(wrapper.vm, "prepareGridCharts");

                wrapper.vm.handleChartData(["foo", "bar"], [1], [], undefined);
                expect(prepareGridChartsStub.calledWith(["foo", "bar"], undefined, "vertical", false)).to.be.true;
            });
            it("should call prepareChartData with expected params for line chart", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    prepareChartDataStub = sinon.stub(wrapper.vm, "prepareChartData");

                wrapper.vm.handleChartData(["foo"], ["region1"], ["date1", "date2"], {foo: "bar"});
                await wrapper.vm.$nextTick();
                expect(prepareChartDataStub.calledWith("foo", "bar", undefined, "line")).to.be.true;
                sinon.restore();
            });
            it("should call prepareChartData with expected params for bar chart", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    prepareChartDataStub = sinon.stub(wrapper.vm, "prepareChartData");

                wrapper.vm.handleChartData(["foo"], ["region1"], ["date1"], {foo: "bar"});
                await wrapper.vm.$nextTick();
                expect(prepareChartDataStub.calledWith("foo", "bar", undefined, "bar", "vertical")).to.be.true;
                sinon.restore();
            });
            it("should call prepareChartData with expected params for bar chart horizontal", async () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    prepareChartDataStub = sinon.stub(wrapper.vm, "prepareChartData");

                wrapper.vm.handleChartData(["foo"], ["region1", "region2", "region3", "region4", "region5"], ["date1"], {foo: "bar"});
                await wrapper.vm.$nextTick();
                expect(prepareChartDataStub.calledWith("foo", "bar", undefined, "bar", "horizontal")).to.be.true;
                sinon.restore();
            });
        });
        describe("prepareChartData", () => {
            it("should set canvas and chart to property currentChart", () => {
                sinon.stub(ChartProcessor, "createLineChart").returns(null);
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    topic = "fooBar",
                    canvas = document.createElement("canvas"),
                    expected = {};

                expected[topic] = {
                    chart: null
                };
                wrapper.vm.prepareChartData(topic, undefined, canvas, "line");
                expect(wrapper.vm.currentChart).to.deep.equal(expected);
                sinon.restore();
            });
            it("should set canvas and chart to property currentChart for bar", () => {
                sinon.stub(ChartProcessor, "createBarChart").returns(null);
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    topic = "fooBar",
                    canvas = document.createElement("canvas"),
                    expected = {};

                expected[topic] = {
                    chart: null
                };
                wrapper.vm.prepareChartData(topic, undefined, canvas, "bar");
                expect(wrapper.vm.currentChart).to.deep.equal(expected);
                sinon.restore();
            });
            it("should destroy existing chart and set canvas and chart to property currentChart", async () => {
                sinon.stub(ChartProcessor, "createLineChart").returns(null);
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    topic = "fooBar",
                    expected = {};

                expected[topic] = {
                    chart: null
                };
                wrapper.vm.currentChart[topic] = {
                    chart: {destroy: () => sinon.stub()}
                };
                await wrapper.vm.$nextTick();
                wrapper.vm.prepareChartData(topic, undefined, undefined, "line");
                expect(wrapper.vm.currentChart).to.deep.equal(expected);
                sinon.restore();
            });
        });
        describe("hasDescription", () => {
            it("should return true if a description is present", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {statistik: {name: "Statistik1", description: "StatistikTest1"}};

                expect(wrapper.vm.hasDescription(statistics)).to.be.true;
            });
            it("should return false if no description is present", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {statistik: {name: "Statistik1"}};

                expect(wrapper.vm.hasDescription(statistics)).to.be.false;
            });
            it("should return true if at least one description is present", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {statistik: {name: "Statistik1"}, statitsik2: {name: "Statistik2", description: "StatistikTest2"}};

                expect(wrapper.vm.hasDescription(statistics)).to.be.true;
            });
        });
        describe("setDescriptionsOfSelectedStatistics", () => {
            it("should return a description with title and content", () => {
                const wrapper = shallowMount(StatisticDashboard, {
                        localVue,
                        store
                    }),
                    statistics = {statistik: {name: "Statistik1", description: "StatistikTest1"}},
                    expected = [{content: "StatistikTest1", title: "Statistik1"}];

                expect(wrapper.vm.setDescriptionsOfSelectedStatistics(statistics)).to.deep.equal(expected);
            });
        });
    });
});

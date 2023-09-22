import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticDashboardFilter from "../../../components/StatisticDashboardFilter.vue";
import indexStatisticDashboard from "../../../store/indexStatisticDashboard";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/src/tools/statiscticDashboard/components/StatisticDashboardFilter.vue", () => {
    const timeStepsFilter = [
            "Die letzten 5 Jahre",
            "Die letzten 10 Jahre",
            "Alle Jahre"
        ],
        regions = [
            {value: "Harburg", label: "Harburg"},
            {value: "Lübeck", label: "Lübeck"},
            {value: "Schwerin", label: "Schwerin"},
            {value: ["Harburg", "Lübeck", "Schwerin"], label: "Alle Gebiete"}
        ],
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: indexStatisticDashboard
                    }
                }
            }
        });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render filtercontainer", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find(".filtercontainer").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render dropdown for category", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find("#categoryfilter").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render dropdown for area", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find("#areafilter").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render dropdown for time", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find("#timefilter").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render dropdownButton for statistics", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find("button").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should not render button if no statistic is selected", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find(".btn-outline-secondary").exists()).to.be.false;
            wrapper.destroy();
        });

        it("should not render reset button if no statistic is selected", () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            expect(wrapper.find("#reset-button").exists()).to.be.false;
            wrapper.destroy();
        });

        it("should render one button if one statistic is selected", async () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});

            expect(wrapper.find(".btn-outline-secondary").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should render reset button if statistic is selected", async () => {
            const wrapper = shallowMount(StatisticDashboardFilter, {
                propsData: {
                    categories: [],
                    timeStepsFilter,
                    regions,
                    areCategoriesGrouped: false
                },
                localVue,
                store
            });

            await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});

            expect(wrapper.find("#reset-button").exists()).to.be.true;
            wrapper.destroy();
        });
    });
    describe("Computed", () => {
        describe("areStatisticsSelected", () => {
            it("should return false", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {});
                expect(wrapper.vm.areStatisticsSelected).to.be.false;
                wrapper.destroy();
            });
            it("should return false", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", undefined);
                expect(wrapper.vm.areStatisticsSelected).to.be.false;
                wrapper.destroy();
            });
            it("should return true", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});
                expect(wrapper.vm.areStatisticsSelected).to.be.true;
                wrapper.destroy();
            });
        });
        describe("selectedCategoryName", () => {
            it("should return an empty string", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.selectedCategoryName).to.be.empty;
                wrapper.destroy();
            });
            it("should return the name of the selected category", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await wrapper.setData({
                    selectedCategory: {
                        name: "Kategorie 1"
                    }
                });
                expect(wrapper.vm.selectedCategoryName).to.be.equal("Kategorie 1");
                wrapper.destroy();
            });
        });
    });

    describe("Watchers", () => {
        describe("selectedCategory", () => {
            it("should emit 'resetStatistics' and 'changeCategory' with the name of", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await wrapper.setData({
                    selectedCategory: {
                        name: "Kategorie 1"
                    }
                });

                expect(wrapper.emitted()).to.have.all.keys(["resetStatistics", "changeCategory"]);
                expect(wrapper.emitted().changeCategory).to.deep.equal([["Kategorie 1"]]);
            });
        });
    });

    describe("Methods", () => {
        describe("collectDatesValues", () => {
            it("should return all values no matter if they are a string or an array of strings ", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.collectDatesValues([{value: "2020"}, {value: ["2021", "2022"]}])).to.deep.equals(["2020", "2021", "2022"]);
                wrapper.destroy();
            });
        });

        describe("allFilterSettingsSelected", () => {
            it("should return 1 if all given values are not empty", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.allFilterSettingsSelected({name: "name"}, [2], [3])).to.be.equals(1);
                wrapper.destroy();
            });
            it("should return false if the first given value is not an object", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.allFilterSettingsSelected(undefined, [2], [3])).to.be.false;
                wrapper.destroy();
            });
        });

        describe("emitFilterSettings", () => {
            it("should emit 'changeFilterSettings' with the right values", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                wrapper.vm.emitFilterSettings({name: "name"}, [6], [6]);
                expect(wrapper.emitted()).to.have.all.keys("changeFilterSettings");
                expect(wrapper.emitted().changeFilterSettings).to.deep.equal([[[6], [6]]]);
                wrapper.destroy();
            });
            it("should not emit 'changeFilterSettings' but 'resetStatistics'", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                wrapper.vm.emitFilterSettings([6], [6], []);
                expect(wrapper.emitted()).to.have.all.keys("resetStatistics");
                wrapper.destroy();
            });
        });

        describe("toggleStatistic", () => {
            it("should add a statistic if it is not already selected", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});

                wrapper.vm.toggleStatistic({name: "5678"}, wrapper.vm.selectedStatistics, "stat2");
                expect(wrapper.vm.selectedStatistics).to.deep.equals({"stat1": {name: "1234"}, "stat2": {name: "5678"}});
                wrapper.destroy();
            });
            it("should remove a statistic if it is already selected", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});

                wrapper.vm.toggleStatistic({name: "1234"}, wrapper.vm.selectedStatistics, "stat1");
                expect(wrapper.vm.selectedStatistics).to.deep.equals({});
                wrapper.destroy();
            });
        });
        describe("removeStatistic", () => {
            it("should remove statistic if the name existed", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}, "stat2": {name: "5678"}});

                wrapper.vm.removeStatistic(wrapper.vm.selectedStatistics, "stat1");
                expect(wrapper.vm.selectedStatistics).to.deep.equals({"stat2": {name: "5678"}});
                wrapper.destroy();
            });
            it("should remove the statistic and call resetStatistics if it is the last one", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                        propsData: {
                            categories: [],
                            timeStepsFilter,
                            regions,
                            areCategoriesGrouped: false
                        },
                        localVue,
                        store
                    }),
                    spyResetStatistics = sinon.spy(wrapper.vm, "resetStatistics");

                store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}});

                wrapper.vm.removeStatistic(wrapper.vm.selectedStatistics, "stat1");
                expect(wrapper.vm.selectedStatistics).to.deep.equals({});
                expect(spyResetStatistics.calledOnce).to.be.true;
                wrapper.destroy();
            });
        });
        describe("resetStatistics", () => {
            it("should remove all statistics and emit reset", async () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                await store.commit("Tools/StatisticDashboard/setSelectedStatistics", {"stat1": {name: "1234"}, "stat2": {name: "5678"}});

                wrapper.vm.resetStatistics();
                expect(wrapper.vm.selectedStatistics).to.deep.equals({});
                expect(wrapper.emitted()).to.have.all.keys(["resetStatistics"]);
                wrapper.destroy();
            });
        });
        describe("getSelectedRegions", () => {
            it("should remove empty array", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.getSelectedRegions(0)).to.deep.equals([]);
                expect(wrapper.vm.getSelectedRegions(null)).to.deep.equals([]);
                expect(wrapper.vm.getSelectedRegions(false)).to.deep.equals([]);
                expect(wrapper.vm.getSelectedRegions("")).to.deep.equals([]);
                expect(wrapper.vm.getSelectedRegions([])).to.deep.equals([]);
                expect(wrapper.vm.getSelectedRegions({})).to.deep.equals([]);
                wrapper.destroy();
            });

            it("should get selected region", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.getSelectedRegions([
                    {value: "Schwerin", label: "Schwerin"},
                    {value: "Harburg", label: "Harburg"}
                ])).to.deep.equals(["Schwerin", "Harburg"]);
                wrapper.destroy();
            });

            it("should get selected all regions", () => {
                const wrapper = shallowMount(StatisticDashboardFilter, {
                    propsData: {
                        categories: [],
                        timeStepsFilter,
                        regions,
                        areCategoriesGrouped: false
                    },
                    localVue,
                    store
                });

                expect(wrapper.vm.getSelectedRegions([
                    {value: "Harburg", label: "Harburg"},
                    {value: "Schwerin", label: "Schwerin"},
                    {value: ["Harburg", "Lübeck", "Schwerin"], label: "Alle Gebiete"}
                ])).to.deep.equals(["Harburg", "Lübeck", "Schwerin"]);
                wrapper.destroy();
            });
        });
    });
});

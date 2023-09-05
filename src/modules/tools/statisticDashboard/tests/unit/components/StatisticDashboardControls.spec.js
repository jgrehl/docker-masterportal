import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";
import StatisticDashboardControls from "../../../components/StatisticDashboardControls.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/src/tools/statiscticDashboard/components/StatisticDashboardControls.vue", () => {
    const descriptions = [{
        title: "TitleOne",
        content: "ContentOne"
    },
    {
        title: "TitleTwo",
        content: "ContentTwo"
    },
    {
        title: "TitleThree",
        content: "ContentThree"
    }];

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue
            });

            expect(wrapper.exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find no description", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue
            });

            expect(wrapper.find(".description").exists()).to.be.false;
            wrapper.destroy();
        });

        it("should find a description", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue
            });

            expect(wrapper.find(".description p").text()).to.be.equal("TitleOneContentOne");
            wrapper.destroy();

        });

        it("should find a button toolbar", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue
            });

            expect(wrapper.find(".btn-toolbar").exists()).to.be.true;
            wrapper.destroy();
        });

        it("should find three button groups", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue
            });

            expect(wrapper.findAll(".btn-group")).lengthOf(3);
            wrapper.destroy();
        });
    });

    describe("Computed Properties", () => {
        it("should set hasDescription to false", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                localVue
            });

            expect(wrapper.vm.hasDescription).to.be.false;
            wrapper.destroy();
        });

        it("should set hasDescription to true", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue
            });

            expect(wrapper.vm.hasDescription).to.be.true;
            wrapper.destroy();
        });

        it("should set init description content and title", () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue
            });

            expect(wrapper.vm.contentDescription).to.be.equal("ContentOne");
            expect(wrapper.vm.titleDescription).to.be.equal("TitleOne");
            wrapper.destroy();
        });

        it("should set description content and title by the current index", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                propsData: {
                    descriptions
                },
                localVue
            });

            await wrapper.setData({
                currentDescriptionIndex: 1
            });

            expect(wrapper.vm.contentDescription).to.be.equal("ContentTwo");
            expect(wrapper.vm.titleDescription).to.be.equal("TitleTwo");
            wrapper.destroy();
        });
    });

    describe("Methods", () => {
        describe("nextDescription", () => {
            it("should set currentDescriptionIndex always to 0 if only one description is available", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions: [descriptions[0]]
                    },
                    localVue
                });

                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });

            it("should set currentDescriptionIndex in the correct order", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue
                });

                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
                wrapper.vm.nextDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });
        });
        describe("prevDescription", () => {
            it("should set currentDescriptionIndex always to 0 if only one description is available", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions: [descriptions[0]]
                    },
                    localVue
                });

                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });

            it("should set currentDescriptionIndex in the correct order", () => {
                const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue
                });

                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
                wrapper.vm.prevDescription();
                expect(wrapper.vm.currentDescriptionIndex).to.be.equal(0);
                wrapper.destroy();
            });
        });
    });

    describe("User Interaction", () => {
        it("should emit 'showTable' if the user click the table button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    localVue
                }),
                tableButton = wrapper.findAll(".btn-group label").at(0);

            await tableButton.trigger("click");
            expect(wrapper.emitted()).to.have.all.keys("showTable");
            wrapper.destroy();
        });

        it("should emit 'showChart' if the user click the chart button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    localVue
                }),
                chartButton = wrapper.findAll(".btn-group label").at(1);

            await chartButton.trigger("click");
            expect(wrapper.emitted()).to.have.all.keys("showChart");
            wrapper.destroy();
        });

        it("should emit 'showDifference' if the user click the difference button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    localVue
                }),
                differenceButton = wrapper.findAll("button").at(0);

            await differenceButton.trigger("click");
            expect(wrapper.emitted()).to.have.all.keys("showDifference");
            wrapper.destroy();
        });

        it("should emit 'downloadData' if the user click the download button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    localVue
                }),
                downloadButton = wrapper.findAll("button").at(1);

            await downloadButton.trigger("click");
            expect(wrapper.emitted()).to.have.all.keys("downloadData");
            wrapper.destroy();
        });

        it("should set the description index if the user click the left chevron button", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue
                }),
                chevronLeftButton = wrapper.findAll("button.description-icons").at(0);

            await chevronLeftButton.trigger("click");
            expect(wrapper.vm.currentDescriptionIndex).to.be.equal(2);
            wrapper.destroy();
        });

        it("should set the description index if the user click the right chevron button ", async () => {
            const wrapper = shallowMount(StatisticDashboardControls, {
                    propsData: {
                        descriptions
                    },
                    localVue
                }),
                chevronRightButton = wrapper.findAll("button.description-icons").at(1);

            await chevronRightButton.trigger("click");
            expect(wrapper.vm.currentDescriptionIndex).to.be.equal(1);
            wrapper.destroy();
        });
    });
});

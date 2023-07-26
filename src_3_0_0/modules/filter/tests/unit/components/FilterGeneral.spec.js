import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import FilterGeneral from "../../../components/FilterGeneral.vue";
import FilterStore from "../../../store/indexFilter";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe("src/modules/filter/components/FilterGeneral.vue", () => {
    let wrapper, store;

    const layers = [
            {
                title: "layerOne",
                layerId: "1234"
            },
            {
                title: "layerTwo",
                layerId: "4321"
            },
            {
                title: "layerThree",
                layerId: "5678"
            }
        ],
        groups = [{layers, title: "groupOne"}, {layers, title: "groupTwo"}];

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        Filter: FilterStore
                    }
                }
            }
        });
        wrapper = shallowMount(FilterGeneral, {global: {
            plugins: [store]
        }});
    });

    afterEach(() => {
        sinon.restore();
    });

    // selectedLayerGroups
    it("should exist", async () => {
        await wrapper.vm.$nextTick();

        expect(wrapper.find("#filter").exists()).to.be.true;
    });

    it("should render two accordions if two layer groups are present and layerSelectorVisible is true", async () => {
        wrapper.vm.setLayerGroups(groups);
        await wrapper.vm.$nextTick();

        expect(wrapper.findAll(".accordion-collapse")).to.have.lengthOf(2);
    });

    it("should render no accordions if layer groups are present and layerSelectorVisible is false", async () => {
        wrapper.vm.setLayerSelectorVisible(false);
        await wrapper.setData({
            layerConfigs: {
                groups,
                layers
            },
            preparedLayerGroups: groups
        });

        expect(wrapper.find(".accordion-collapse").exists()).to.be.false;
    });

    it("should render and open one accordion if its selected", async () => {
        wrapper.vm.setLayerGroups(groups);
        wrapper.vm.setLayerSelectorVisible(true);
        wrapper.vm.setSelectedGroups([0]);
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".show").exists()).to.be.true;
        expect(wrapper.findAll(".show")).to.have.lengthOf(1);
    });
    describe("updateSelectedGroups", () => {
        it("should remove given index from selectedGroups if found in array", async () => {
            wrapper.vm.setSelectedGroups([0, 1]);
            await wrapper.vm.$nextTick();
            wrapper.vm.updateSelectedLayerGroups(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.selectedGroups).to.deep.equal([1]);
        });
        it("should add given index to selectedGroups if not found in array", async () => {
            wrapper.vm.setSelectedGroups([0]);
            await wrapper.vm.$nextTick();
            wrapper.vm.updateSelectedLayerGroups(1);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.selectedGroups).to.deep.equal([0, 1]);
        });
    });
    describe("updateSelectedAccordions", () => {
        it("should add filterIds to selectedAccordion if multiLayerSelector is false", async () => {
            await wrapper.setData({
                layerConfigs: {
                    multiLayerSelector: false
                }
            });
            const expected = [
                {
                    filterId: 0,
                    layerId: "1234"
                }
            ];

            wrapper.vm.updateSelectedAccordions(0);
            expect(wrapper.vm.selectedAccordions).to.deep.equal(expected);
        });
        it("should remove filterIds from selectedAccordion if multiLayerSelector is false", async () => {
            await wrapper.setData({
                layerConfigs: {
                    multiLayerSelector: false
                }
            });
            wrapper.vm.updateSelectedAccordions(0);
            expect(wrapper.vm.selectedAccordions).to.deep.equal([]);
        });
        it("should not change the rule when adding and removing the filterId of selectedAccordion", async () => {
            await wrapper.setData({
                layerConfigs: {
                    multiLayerSelector: true
                }
            });
            const rule = [
                {
                    snippetId: 0,
                    startup: false,
                    fixed: false,
                    attrName: "test",
                    operator: "EQ",
                    value: ["Altona"]
                }
            ];

            wrapper.vm.setRulesOfFilters({
                rulesOfFilters: rule
            });
            wrapper.vm.updateSelectedAccordions(0);
            expect(wrapper.vm.rulesOfFilters).to.deep.equal(rule);
            wrapper.vm.updateSelectedAccordions(0);
            expect(wrapper.vm.rulesOfFilters).to.deep.equal(rule);
        });
    });
});
import {config, shallowMount} from "@vue/test-utils";
import LayerFilterSnippet from "../../../components/LayerFilterSnippet.vue";
import SnippetDownload from "../../../components/SnippetDownload.vue";
import SnippetCheckboxFilterInMapExtent from "../../../components/SnippetCheckboxFilterInMapExtent.vue";
import {expect} from "chai";
import MapHandler from "../../../utils/mapHandler.js";
import openlayerFunctions from "../../../utils/openlayerFunctions.js";
import sinon from "sinon";


config.global.mocks.$t = key => key;

describe("src/modules/tools/filter/components/LayerFilterSnippet.vue", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(LayerFilterSnippet, {
            propsData: {
                layerConfig: {
                    service: {
                        type: "something external"
                    }
                },
                mapHandler: new MapHandler({
                    isLayerActivated: () => false
                })
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("hasThisSnippetTheExpectedType", () => {
        it("should return false if the given snippet has not the expected type", () => {
            expect(wrapper.vm.hasThisSnippetTheExpectedType(undefined)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(null)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(1234)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType("string")).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(true)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(false)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType([])).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType({})).to.be.false;

            expect(wrapper.vm.hasThisSnippetTheExpectedType({type: "anything"}, "something")).to.be.false;
        });
        it("should return true if the given snippet has the expected type", () => {
            expect(wrapper.vm.hasThisSnippetTheExpectedType({type: "something"}, "something")).to.be.true;
        });
    });
    describe("setSearchInMapExtent", () => {
        it("should set the internal searchInMapExtent variable to the given value", () => {
            expect(wrapper.vm.searchInMapExtent).to.be.false;
            wrapper.vm.setSearchInMapExtent(true);
            expect(wrapper.vm.searchInMapExtent).to.be.true;
        });
    });
    describe("renderCheckboxSearchInMapExtent", () => {
        it("Should render the checkbox component correctly", () => {
            wrapper = shallowMount(LayerFilterSnippet, {
                propsData: {
                    layerConfig: {
                        service: {
                            type: "something external"
                        },
                        searchInMapExtent: true
                    },
                    mapHandler: new MapHandler({
                        isLayerActivated: () => false
                    })
                }
            });
            expect(wrapper.findComponent(SnippetCheckboxFilterInMapExtent).exists()).to.be.true;
        });
    });
    it("should call handleActiveStrategy if strategy is active", async () => {
        const spyHandleActiveStrategy = sinon.spy(wrapper.vm, "handleActiveStrategy");

        await wrapper.setProps({layerConfig: {strategy: "active"}});
        wrapper.vm.changeRule({
            snippetId: 0,
            startup: false,
            fixed: false,
            attrName: "test",
            operator: "EQ"
        });
        await wrapper.vm.$nextTick();
        expect(spyHandleActiveStrategy.calledOnce).to.be.true;
    });

    describe("changeRule", () => {
        it("should emit the updateRules event", async () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().updateRules).to.be.an("array").with.lengthOf(1);
        });
    });
    describe("deleteRule", () => {
        it("should emit the update function", async () => {
            wrapper.vm.deleteRule(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().updateRules).to.be.an("array").with.lengthOf(1);
        });
    });
    describe("hasUnfixedRules", () => {
        it("should return false if there are no rules with fixed=false", () => {
            const rules = {
                snippetId: 1,
                startup: false,
                fixed: true,
                attrName: "test",
                operator: "EQ"
            };

            expect(wrapper.vm.hasUnfixedRules(rules)).to.be.false;
        });
        it("should return true if there are rules with fixed=false in the rules", () => {
            const rules = [
                {
                    snippetId: 1,
                    startup: false,
                    fixed: true,
                    attrName: "test",
                    operator: "EQ"
                },
                {
                    snippetId: 0,
                    startup: false,
                    fixed: false,
                    attrName: "test",
                    operator: "EQ"
                }
            ];

            expect(wrapper.vm.hasUnfixedRules(rules)).to.be.true;
        });
    });
    describe("getTitle", () => {
        it("should return true if title is true", () => {
            expect(wrapper.vm.getTitle(true), 1).to.be.true;
        });
        it("should return the title if title is set", () => {
            expect(wrapper.vm.getTitle({title: "title"}, 1)).to.be.equal("title");
        });
        it("should return true if title is not set", () => {
            sinon.stub(openlayerFunctions, "getLayerByLayerId").returns({
                "id": "filterId",
                "type": "layer",
                "showInLayerTree": false,
                "visibility": true
            });
            expect(wrapper.vm.getTitle({}, 1)).to.be.true;
        });
    });
    describe("getTagTitle", () => {
        it("should return value if there is no tagTitle defined", () => {
            expect(wrapper.vm.getTagTitle({value: "title"})).to.equal("title");
            expect(wrapper.vm.getTagTitle({value: false})).to.equal("false");
            expect(wrapper.vm.getTagTitle({value: 0})).to.equal("0");
            expect(wrapper.vm.getTagTitle({value: undefined})).to.equal("undefined");
            expect(wrapper.vm.getTagTitle({value: null})).to.equal("null");
        });
        it("should return tagTitle if there is tagTitle defined", () => {
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: "tagTitle"})).to.equal("tagTitle");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: false})).to.equal("false");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: 0})).to.equal("0");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: null})).to.equal("null");
        });
    });

    describe("paging", () => {
        it("should show stop button if paging  was set", async () => {
            await wrapper.setData({
                paging: {
                    page: 1,
                    total: 46
                },
                showStop: true
            });

            expect(wrapper.find(".btn-secondary").exists()).to.be.true;
        });
    });

    describe("SnippetDownload", () => {
        it("should render SnippetDownload component if download is true and filteredItems are given", async () => {
            await wrapper.setProps({
                layerConfig: {
                    download: true
                }
            });
            await wrapper.setData({
                filteredItems: [
                    {
                        a: "a",
                        b: "b"
                    }
                ]
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(SnippetDownload).exists()).to.be.true;
        });
    });

    describe("labelFilterButton", () => {
        it("should render correct name for label filter button", async () => {
            await wrapper.setData({
                layerConfig: {
                    labelFilterButton: "common:modules.filter.filterButton"
                }
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find("button").text()).to.equal("common:modules.filter.filterButton");
        });
    });
    it("should render SnippetTags if rules are given", async () => {
        const rules = [
            {
                snippetId: 1,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            },
            {
                snippetId: 2,
                startup: false,
                fixed: false,
                attrName: "testing",
                operator: "EQ"
            }
        ];

        await wrapper.setProps({
            filterRules: rules
        });
        expect(wrapper.find(".snippetTagsWrapper").exists()).to.be.true;
        expect(wrapper.findAll(".snippetTagsWrapper")).to.have.lengthOf(3);
    });
    it("should render amount of filtered items", async () => {
        await wrapper.setData({
            amountOfFilteredItems: 3
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".filter-result").exists()).to.be.true;
        expect(wrapper.find(".filter-result").text()).contain("common:modules.filter.filterResult.unit");

        it("should not render amount of filtered items if showHits is false", async () => {
            await wrapper.setData({
                amountOfFilteredItems: 3,
                layerConfig: {
                    showHits: false
                }
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".filter-result").exists()).to.be.false;
        });
        it("should render amount of filtered items if showHits is true", async () => {
            await wrapper.setData({
                amountOfFilteredItems: 3,
                layerConfig: {
                    showHits: true
                }
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".filter-result").exists()).to.be.true;
            expect(wrapper.find(".filter-result").text()).contain("modules.tools.filter.filterResult.unit", "3");
        });
        it("should render amount of filtered items if showHits is undefined", async () => {
            await wrapper.setData({
                amountOfFilteredItems: 3,
                layerConfig: {
                    showHits: undefined
                }
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".filter-result").exists()).to.be.true;
            expect(wrapper.find(".filter-result").text()).contain("modules.tools.filter.filterResult.unit", "3");
        });
        describe("setSnippetValueByState", async () => {
            await wrapper.setData({
                snippets
            });
            const filterRules = [
                    {
                        snippetId: 0,
                        startup: false,
                        fixed: false,
                        attrName: "test",
                        operator: "EQ",
                        value: ["Altona"]
                    }
                ],
                snippets = [
                    {
                        operator: "EQ",
                        snippetId: 0,
                        title: "Bezirk",
                        type: "dropdown",
                        value: ["Altona"]
                    }],
                precheckedSnippets = [{
                    operator: "EQ",
                    snippetId: 0,
                    title: "Bezirk",
                    type: "dropdown",
                    value: ["Altona"],
                    prechecked: ["Altona"]
                }];

            it("should not set prechecked value if param is not an array", () => {
                wrapper.vm.setSnippetValueByState(undefined);
                wrapper.vm.setSnippetValueByState(null);
                wrapper.vm.setSnippetValueByState(123456);
                wrapper.vm.setSnippetValueByState("string");
                wrapper.vm.setSnippetValueByState(true);
                wrapper.vm.setSnippetValueByState({});
                expect(wrapper.vm.snippets).to.deep.equal(snippets);
            });
            it("should not set prechecked value if given structure is not a rule", () => {
                const isRuleStub = sinon.stub(LayerFilterSnippet, "isRule").returns(false),
                    noRule = [
                        {
                            something: "something"
                        }
                    ];

                wrapper.vm.setSnippetValueByState(noRule);
                expect(wrapper.vm.snippets).to.deep.equal(snippets);
                expect(isRuleStub.called).to.be.true;
                sinon.restore();
            });
            it("should set prechecked value if correct filter rule is given", () => {
                wrapper.vm.setSnippetValueByState(filterRules);
                expect(wrapper.vm.snippets).to.deep.equal(precheckedSnippets);
            });
        });
    });
    describe("setSnippetValueByState", async () => {
        await wrapper.setData({
            snippets
        });
        const filterRules = [
                {
                    snippetId: 0,
                    startup: false,
                    fixed: false,
                    attrName: "test",
                    operator: "EQ",
                    value: ["Altona"]
                }
            ],
            snippets = [
                {
                    operator: "EQ",
                    snippetId: 0,
                    title: "Bezirk",
                    type: "dropdown",
                    value: ["Altona"]
                }],
            precheckedSnippets = [{
                operator: "EQ",
                snippetId: 0,
                title: "Bezirk",
                type: "dropdown",
                value: ["Altona"],
                prechecked: ["Altona"]
            }];

        it("should not set prechecked value if param is not an array", () => {
            wrapper.vm.setSnippetValueByState(undefined);
            wrapper.vm.setSnippetValueByState(null);
            wrapper.vm.setSnippetValueByState(123456);
            wrapper.vm.setSnippetValueByState("string");
            wrapper.vm.setSnippetValueByState(true);
            wrapper.vm.setSnippetValueByState({});
            expect(wrapper.vm.snippets).to.deep.equal(snippets);
        });
        it("should not set prechecked value if given structure is not a rule", () => {
            const isRuleStub = sinon.stub(LayerFilterSnippet, "isRule").returns(false),
                noRule = [
                    {
                        something: "something"
                    }
                ];

            wrapper.vm.setSnippetValueByState(noRule);
            expect(wrapper.vm.snippets).to.deep.equal(snippets);
            expect(isRuleStub.called).to.be.true;
            sinon.restore();
        });
        it("should set prechecked value if correct filter rule is given", () => {
            wrapper.vm.setSnippetValueByState(filterRules);
            expect(wrapper.vm.snippets).to.deep.equal(precheckedSnippets);
        });
    });
});

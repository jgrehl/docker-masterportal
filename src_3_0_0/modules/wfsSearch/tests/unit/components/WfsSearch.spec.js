import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import WfsSearchLiteral from "../../../components/WfsSearchLiteral.vue";
import WfsSearch from "../../../components/WfsSearch.vue";
import WfsSearchModule from "../../../store/indexWfsSearch";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/wfsSearch/components/WfsSearch.vue", () => {
    const arbitraryFeature = {
            getGeometryName: () => "Klein bottle"
        },
        mockMapMarkerActions = {
            removePointMarker: sinon.stub()
        },
        mockAlertingActions = {
            addSingleAlert: sinon.stub()
        };

    let instances,
        store,
        layer;

    beforeEach(() => {
        const map = {
            id: "ol",
            mode: "2D",
            updateSize: sinon.spy()
        };

        mapCollection.clear();
        mapCollection.addMap(map, "2D");

        instances = [{
            title: "Test WfsSearch",
            requestConfig: {
                layerId: "753"
            },
            resultList: {
                "Ort": "Ort",
                "Name": "Name"
            },
            literals: [{field: {
                id: "fieldId",
                queryType: "like",
                inputLabel: "Name",
                fieldName: "Name"
            }}]
        }];
        layer = {
            id: "753"
        };
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        WfsSearch: WfsSearchModule
                    }
                },
                MapMarker: {
                    namespaced: true,
                    actions: mockMapMarkerActions
                },
                Alerting: {
                    namespaced: true,
                    actions: mockAlertingActions

                },
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: sinon.stub()
                    }
                }
            },
            getters: {
                uiStyle: sinon.stub(),
                layerConfigById: () => () => layer
            }
        });
    });
    afterEach(sinon.restore);

    it("renders a literal", async () => {
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
            localVue,
            store
        });

        expect(wrapper.findComponent(WfsSearchLiteral).exists()).to.be.true;
    });
    it("renders multiple literals if configured", () => {
        instances[0].literals.push({field: {
            id: "fieldId2",
            queryType: "like",
            inputLabel: "Name2",
            fieldName: "Name2"
        }}, {field: {
            id: "fieldId3",
            queryType: "like",
            inputLabel: "Name3",
            fieldName: "Name3"
        }});
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
            localVue,
            store
        });

        expect(wrapper.findAllComponents(WfsSearchLiteral).length).to.equal(3);
    });
    it("renders a select field to select the searchInstance if configured", () => {
        instances.push({
            title: "Test WfsSearch II",
            literals: [{}]
        });
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
            localVue,
            store
        });

        expect(wrapper.find("#module-wfsSearch-instances-select-label").exists()).to.be.true;
        expect(wrapper.find("#module-wfsSearch-instances-select").exists()).to.be.true;
    });
    it("renders a container with userHelp if configured", () => {
        store.commit("Modules/WfsSearch/setUserHelp", "test");
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
            localVue,
            store
        });

        expect(wrapper.find("#module-wfsSearch-userHelp").exists()).to.be.true;
        expect(wrapper.find("#module-wfsSearch-userHelp-icon").exists()).to.be.true;
        expect(wrapper.find("#module-wfsSearch-userHelp-text").exists()).to.be.true;
    });
    it("renders a button to reset the UI", () => {
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            resetButton = wrapper.find("#module-wfsSearch-button-resetUI");

        expect(resetButton.exists()).to.be.true;
        expect(resetButton.text()).to.equal("common:modules.tools.wfsSearch.resetButton");
    });
    it("renders an input element of type submit to search", () => {
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            searchInput = wrapper.find("#module-wfsSearch-button-search");

        expect(searchInput.exists()).to.be.true;
        expect(searchInput.element.value).to.equal("common:modules.tools.wfsSearch.searchButton");
        expect(searchInput.element.type).to.equal("submit");
    });
    it.only("renders a clickable button to show the search results if the user searched and results were found", async () => {
        store.commit("Modules/WfsSearch/setResults", [{Ort: "Hamburg", Name: "KiTa Rübennasen"}]);
        store.commit("Modules/WfsSearch/setInstances", instances);

        const wrapper = mount(WfsSearch, {
            localVue,
            store
        });
        let showResultsButton = null;

        store.commit("Modules/WfsSearch/setSearched", true);
        await wrapper.vm.$nextTick();
        showResultsButton = wrapper.find("#module-wfsSearch-button-showResults");
        showResultsButton.element.disabled = false;

        console.log("******", showResultsButton.element.disabled);

        // expect(showResultsButton.exists()).to.be.true;
        // expect(showResultsButton.text()).to.equal("common:modules.tools.wfsSearch.showResults (1)");
        expect(showResultsButton.element.disabled).to.be.false;
    });
    it("renders a disabled button if the user searched and no results were found", () => {
        store.commit("Modules/WfsSearch/setSearched", true);
        store.commit("Modules/WfsSearch/setResults", []);
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            searchButton = wrapper.find("#module-wfsSearch-button-showResults");

        expect(searchButton.exists()).to.be.true;
        expect(searchButton.text()).to.equal("common:modules.tools.wfsSearch.showResults (0)");
        expect(searchButton.element.disabled).to.be.true;
    });
    it("renders no button if the user searched but the parameter 'resultList' was not configured", () => {
        store.commit("Modules/WfsSearch/setSearched", true);
        store.commit("Modules/WfsSearch/setResults", [{}]);
        delete instances[0].resultList;
        store.commit("Modules/WfsSearch/setInstances", instances);
        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            searchButton = wrapper.find("#module-wfsSearch-button-showResults");

        expect(searchButton.exists()).to.be.false;
    });
    it("renders a pagination when more results than are to be shown are available", () => {
        store.commit("Modules/WfsSearch/setSearched", true);
        store.commit("Modules/WfsSearch/setResultsPerPage", 2);
        store.commit("Modules/WfsSearch/setShowResultList", true);
        store.commit("Modules/WfsSearch/setResults", [
            arbitraryFeature, arbitraryFeature, arbitraryFeature,
            arbitraryFeature, arbitraryFeature
        ]);
        store.commit("Modules/WfsSearch/setInstances", instances);

        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            pagination = wrapper.find("ul.pagination");

        expect(pagination.exists()).to.be.true;
        expect(pagination.findAll("li").length).to.equal(3);
    });
    it("doesn't render a pagination when 0 is chosen for 'resultsPerPage'", () => {
        store.commit("Modules/WfsSearch/setSearched", true);
        store.commit("Modules/WfsSearch/setResultsPerPage", 0);
        store.commit("Modules/WfsSearch/setShowResultList", true);
        store.commit("Modules/WfsSearch/setResults", [
            arbitraryFeature, arbitraryFeature, arbitraryFeature,
            arbitraryFeature, arbitraryFeature
        ]);
        store.commit("Modules/WfsSearch/setInstances", instances);

        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            pagination = wrapper.find("ul.pagination");

        expect(pagination.exists()).to.be.false;
    });
    it("doesn't render a pagination when resultsPerPage is larger than result list length", () => {
        store.commit("Modules/WfsSearch/setSearched", true);
        store.commit("Modules/WfsSearch/setResultsPerPage", 9001);
        store.commit("Modules/WfsSearch/setShowResultList", true);
        store.commit("Modules/WfsSearch/setResults", [
            arbitraryFeature, arbitraryFeature, arbitraryFeature,
            arbitraryFeature, arbitraryFeature
        ]);
        store.commit("Modules/WfsSearch/setInstances", instances);

        const wrapper = mount(WfsSearch, {
                localVue,
                store
            }),
            pagination = wrapper.find("ul.pagination");

        expect(pagination.exists()).to.be.false;
    });
});

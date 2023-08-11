import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarSuggestionListComponent from "../../../components/SearchBarResultList.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarResultList.vue", () => {
    let store,
        wrapper;

    const searchResults = [
            {
                "category": "Straße",
                "id": "BeidemNeuenKrahnStraße",
                "index": 0,
                "name": "Bei dem Neuen Krahn",
                "searchInterfaceId": "gazetteer",
                "displayedInfo": "",
                "icon": "bi-signpost",
                "imagePath": "",
                "toolTip": "",
                "events": {
                }

            },
            {
                "category": "Adresse",
                "id": "BeidemNeuenKrahn2Adresse",
                "index": 1,
                "name": "Bei dem Neuen Krahn 2",
                "searchInterfaceId": "gazetteer",
                "displayedInfo": "",
                "icon": "bi-signpost",
                "imagePath": "",
                "toolTip": "",
                "events": {
                }
            }
        ],
        searchInterfaceInstances = [
            {
                "searchInterfaceId": "gazetteer"
            }
        ],
        minCharacters = 3,
        searchInput = "Neuenfelder",
        showAllResults = false;


    before(() => {
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        SearchBar: {
                            namespaced: true,
                            actions: {
                                instantiateSearchInterfaces: sinon.stub(),
                                overwriteDefaultValues: sinon.stub(),
                                search: sinon.stub()
                            },
                            getters: {
                                minCharacters: () => minCharacters,
                                searchInput: () => searchInput,
                                searchResults: () => searchResults,
                                searchResultsActive: () => {
                                    return true;
                                },
                                showAllResults: () => showAllResults,
                                searchSuggestions: () => [],
                                selectedSearchResults: () => [],
                                searchInterfaceInstances: () => searchInterfaceInstances,
                                suggestionListLength: () => sinon.stub()
                            },
                            mutations: {
                                setSearchSuggestions: sinon.stub(),
                                setShowAllResults: sinon.stub()
                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("test the rendering with different parameters", () => {
        it("renders the SearchBarResultList", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            expect(wrapper.find("#search-bar-result-list").exists()).to.be.true;
        });
        it("shows the showAll button", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".showAllSection").exists()).to.be.true;
            expect(wrapper.find(".btn.btn-light.d-flex.text-left").exists()).to.be.true;
        });
    });
    describe("test the outcome of limitedSortedSearchResults", () => {
        it("tests the computed property SearchBarSuggestionList", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            expect(wrapper.vm.limitedSortedSearchResults.results).to.deep.equal({categoryProvider: {"Straße": "gazetteer", "Adresse": "gazetteer"}, availableCategories: ["Straße", "Adresse"], "StraßeCount": 1, "AdresseCount": 1, "AdresseIcon": "bi-signpost", "StraßeIcon": "bi-signpost"});
        });
    });
    describe("test the method prepareShowAllResults", () => {
        it("test the method prepareShowAllResults", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            wrapper.vm.prepareShowAllResults("Straße");
            expect(wrapper.vm.searchResultsActive).to.be.true;
            expect(wrapper.vm.currentShowAllList[0]).to.deep.equal(searchResults[0]);
        });
    });
});

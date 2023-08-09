import {createStore} from "vuex";
import {config, mount, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarSuggestionListComponent from "../../../components/SearchBarResultList.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarResultList.vue", () => {
    let store,
        wrapper,
        searchResults;

    const searchInterfaceInstances = [
            {
                "searchInterfaceId": "gazetteer"
            },
            {
                "searchInterfaceId": "komootPhoton_0"
            },
            {
                "searchInterfaceId": "komootPhoton_1"
            }
        ],
        minCharacters = 3,
        searchInput = "Neuenfelder",
        showAllResults = false;


    beforeEach(() => {
        searchResults = [
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
        searchInterfaces = [
            {
                "type": "gazetteer",
                "serviceId": "6",
                "searchAddress": true,
                "searchStreets": true,
                "searchHouseNumbers": true,
                "searchDistricts": true,
                "searchParcels": true,
                "searchStreetKey": true
            }
        ],
        minCharacters = 3,
        searchInput = "Neuenfelder",
        showAllResults = false;

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
            },
            state: {
                "Menu": {
                    "currentComponent": "",
                    "secondaryMenu": {
                        "currentComponent": "",
                        "navigation": {
                            "history": []
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

    describe("searchResultsWithUniqueCategories", () => {
        it("should set the categories to unique categories", async () => {
            searchResults = [
                {
                    "category": "komootPhoton",
                    "id": "abc-straße 1",
                    "index": 1,
                    "name": "abc-straße 1",
                    "searchInterfaceId": "komootPhoton_0",
                    "displayedInfo": "",
                    "icon": "bi-signpost",
                    "imagePath": "",
                    "toolTip": "",
                    "events": {
                    }
                },
                {
                    "category": "komootPhoton",
                    "id": "abc-straße 1",
                    "index": 1,
                    "name": "abc-straße 1",
                    "searchInterfaceId": "komootPhoton_1",
                    "displayedInfo": "",
                    "icon": "bi-signpost",
                    "imagePath": "",
                    "toolTip": "",
                    "events": {
                    }
                }
            ];

            wrapper = await shallowMount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.vm.searchResultsWithUniqueCategories).to.deep.equal([
                {
                    "category": "komootPhoton_0",
                    "id": "abc-straße 1",
                    "index": 1,
                    "name": "abc-straße 1",
                    "searchInterfaceId": "komootPhoton_0",
                    "displayedInfo": "",
                    "icon": "bi-signpost",
                    "imagePath": "",
                    "toolTip": "",
                    "events": {
                    }
                },
                {
                    "category": "komootPhoton_1",
                    "id": "abc-straße 1",
                    "index": 1,
                    "name": "abc-straße 1",
                    "searchInterfaceId": "komootPhoton_1",
                    "displayedInfo": "",
                    "icon": "bi-signpost",
                    "imagePath": "",
                    "toolTip": "",
                    "events": {
                    }
                }
            ]);
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

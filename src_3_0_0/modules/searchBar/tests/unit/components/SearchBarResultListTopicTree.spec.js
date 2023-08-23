import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarResultListTopicTreeComponent from "../../../components/SearchBarResultListTopicTree.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarResultListTopicTree.vue", () => {
    let activateActionsSpy,
        store,
        wrapper;

    const searchResults = [
            {
                category: "Straße",
                id: "BeidemNeuenKrahnStraße",
                index: 0,
                name: "Bei dem Neuen Krahn",
                searchInterfaceId: "gazetteer",
                displayedInfo: "",
                icon: "bi-signpost",
                imagePath: "",
                toolTip: "",
                events: {
                    onClick: {
                        addLayerToTopicTree: {
                            layerid: "BeidemNeuenKrahnStraße",
                            source: {
                                abc: "def"
                            }
                        }
                    }
                }
            },
            {
                category: "Adresse",
                id: "BeidemNeuenKrahn2Adresse",
                index: 1,
                name: "Bei dem Neuen Krahn 2",
                searchInterfaceId: "gazetteer",
                displayedInfo: "",
                icon: "bi-signpost",
                imagePath: "",
                toolTip: "",
                events: {
                }
            },
            {
                category: "topicTree",
                id: "ABC",
                index: 1,
                name: "The topic",
                searchInterfaceId: "topicTree",
                displayedInfo: "",
                icon: "bi-signpost",
                imagePath: "",
                toolTip: "",
                events: {
                }
            }
        ],
        searchInput = "Neuenfelder",
        resultItems = searchResults;

    beforeEach(() => {
        activateActionsSpy = sinon.spy();

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        SearchBar: {
                            namespaced: true,
                            getters: {
                                searchInput: () => searchInput,
                                searchResults: () => searchResults,
                                selectedSearchResults: () => [searchResults[0]]
                            },
                            actions: {
                                activateActions: activateActionsSpy
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
        it("renders the SearchBarResultListTopicTree with 3 SearchBarResultListTopicTreeItems", () => {
            wrapper = shallowMount(SearchBarResultListTopicTreeComponent, {
                props: {
                    resultItems
                },
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find(".results-topic-tree-container").exists()).to.be.true;
            expect(wrapper.findAll("search-bar-result-list-topic-tree-item-stub").length).to.equals(3);
            expect(wrapper.find("div > elevated-button-stub#add-layerSelection-btn").exists()).to.be.true;
        });
    });

    describe("activateOnClickAction", () => {
        it("should add selectedSearchResults to topic tree", () => {
            wrapper = shallowMount(SearchBarResultListTopicTreeComponent, {
                props: {
                    resultItems
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.activateOnClickAction();

            expect(activateActionsSpy.calledOnce).to.be.true;
            expect(activateActionsSpy.firstCall.args[1]).to.deep.equals({
                searchResult: {
                    category: "Straße",
                    id: "BeidemNeuenKrahnStraße",
                    index: 0,
                    name: "Bei dem Neuen Krahn",
                    searchInterfaceId: "gazetteer",
                    displayedInfo: "",
                    icon: "bi-signpost",
                    imagePath: "",
                    toolTip: "",
                    events: {
                        onClick: {
                            addLayerToTopicTree: {
                                layerid: "BeidemNeuenKrahnStraße",
                                source: {
                                    abc: "def"
                                }
                            }
                        }
                    }
                },
                actionType: "onClick"
            });
        });
    });
});

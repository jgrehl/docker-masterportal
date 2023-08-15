import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarResultListGeneralItemComponent from "../../../components/SearchBarResultListGeneralItem.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarResultListGeneralItem.vue", () => {
    let store,
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
            toolTip: "toolTipAvailable",
            events: {
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
            toolTip: undefined,
            events: {
            }
        }
    ];

    beforeEach(() => {
        store = createStore({});
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("test the result item", () => {
        it("shows toolTip if available", () => {
            wrapper = shallowMount(SearchBarResultListGeneralItemComponent, {
                global: {
                    plugins: [store]
                },
                propsData: {
                    searchResult: searchResults[0]
                }
            });

            expect(wrapper.find("#search-bar-result-list-general-item").exists()).to.be.true;
            expect(wrapper.find("button").html()).to.contain("toolTipAvailable");
        });

        it("shows name if tooltip is undefined", () => {
            wrapper = shallowMount(SearchBarResultListGeneralItemComponent, {
                global: {
                    plugins: [store]
                },
                propsData: {
                    searchResult: searchResults[1]
                }
            });

            expect(wrapper.find("#search-bar-result-list-general-item").exists()).to.be.true;
            expect(wrapper.find("button").html()).to.contain("Bei dem Neuen Krahn 2");
        });
    });
});

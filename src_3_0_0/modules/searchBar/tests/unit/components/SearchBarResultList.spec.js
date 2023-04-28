import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";

import SearchBarResultListComponent from "../../../components/SearchBarResultList.vue";
import SearchBar from "../../../store/indexSearchBar";

config.global.mocks.$t = key => key;

describe("src/modules/searchBar/components/SearchBarResultList.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            searchBar: {
                id: "searchBar",
                placeholder: "common:modules.searchBar.placeholder.address"
            }
        }
    };
    let store,
        wrapper;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        SearchBar
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    it("renders the SearchBarResultList", () => {
        wrapper = shallowMount(SearchBarResultListComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#search-bar-result-list").exists()).to.be.true;
    });
});

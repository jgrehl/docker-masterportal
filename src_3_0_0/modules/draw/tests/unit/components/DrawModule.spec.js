import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";

import DrawModuleComponent from "../../../components/DrawModule.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/draw/components/DrawModule.vue", () => {
    let store,
        wrapper;

    beforeEach(() => {
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        Draw: {
                            namespaced: true,
                            actions: {},
                            getters: {}
                        }
                    }
                }
            }
        });
    });

    it("renders the draw module component", () => {
        wrapper = shallowMount(DrawModuleComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#modules-draw-module").exists()).to.be.true;
    });
});

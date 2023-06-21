import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import DrawModuleComponent from "../../../components/DrawModule.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/draw/components/DrawModule.vue", () => {
    let store,
        wrapper;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            addLayer: sinon.spy()
        };

        mapCollection.addMap(map, "2D");
    });

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
                            getters: {
                                circleInnerRadius: () => 0,
                                circleOuterRadius: () => 0,
                                interactiveCircle: () => true
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

    it("renders the draw module component", () => {
        wrapper = shallowMount(DrawModuleComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#modules-draw-module").exists()).to.be.true;
    });

    it("renders the shared module drawTypes", () => {
        wrapper = shallowMount(DrawModuleComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("draw-types-stub").exists()).to.be.true;
    });
});

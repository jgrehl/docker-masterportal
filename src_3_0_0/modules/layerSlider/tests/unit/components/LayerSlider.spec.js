import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerSliderComponent from "../../../components/LayerSlider.vue";
import LayerSlider from "../../../store/indexLayerSlider";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerSlider/components/LayerSlider.vue", () => {
    const layerSliderPlayerComponentMock = {
            template: "<span />"
        },
        layerSliderHandleComponentMock = {
            template: "<span />"
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
                        LayerSlider
                    }
                }
            },
            actions: {
                replaceByIdInLayerConfig: sinon.stub()
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the layerSlider", () => {
        wrapper = shallowMount(LayerSliderComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#module-layer-slider").exists()).to.be.true;
    });

    it("renders the layerSlider with LayerSliderPlayer and LayerSliderHandle", () => {
        wrapper = shallowMount(LayerSliderComponent, {
            global: {
                plugins: [store]
            },
            components: {
                LayerSliderPlayer: layerSliderPlayerComponentMock,
                LayerSliderHandle: layerSliderHandleComponentMock
            }
        });

        expect(wrapper.findComponent(layerSliderPlayerComponentMock).exists()).to.be.true;
        expect(wrapper.findComponent(layerSliderHandleComponentMock).exists()).to.be.true;
    });

    it("should have the handle tab active", () => {
        const layerSliderWrapper = shallowMount(LayerSliderComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(layerSliderWrapper.find("#handle-tab").classes()).to.contain("active");
        expect(layerSliderWrapper.find("#player-tab").classes()).to.not.contain("active");
    });

});

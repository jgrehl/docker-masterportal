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
        store.commit("Modules/LayerSlider/setActive", true);
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

    it("renders the layerSlider with sliderType LayerSliderPlayer", () => {
        store.commit("Modules/LayerSlider/setSliderType", "player");
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
        expect(wrapper.findComponent(layerSliderHandleComponentMock).exists()).to.be.false;
    });

    it("renders the layerSlider with sliderType LayerSliderHandle", () => {
        store.commit("Modules/LayerSlider/setSliderType", "handle");
        wrapper = shallowMount(LayerSliderComponent, {
            global: {
                plugins: [store]
            },
            components: {
                LayerSliderPlayer: layerSliderPlayerComponentMock,
                LayerSliderHandle: layerSliderHandleComponentMock
            }
        });

        expect(wrapper.findComponent(layerSliderPlayerComponentMock).exists()).to.be.false;
        expect(wrapper.findComponent(layerSliderHandleComponentMock).exists()).to.be.true;
    });

    it("renders the layerSlider with sliderType LayerSliderHandle", () => {
        store.commit("Modules/LayerSlider/setSliderType", "handle");
        wrapper = shallowMount(LayerSliderComponent, {
            global: {
                plugins: [store]
            },
            components: {
                LayerSliderPlayer: layerSliderPlayerComponentMock,
                LayerSliderHandle: layerSliderHandleComponentMock
            }
        });

        expect(wrapper.findComponent(layerSliderPlayerComponentMock).exists()).to.be.false;
        expect(wrapper.findComponent(layerSliderHandleComponentMock).exists()).to.be.true;
    });

    it("should call toggleSliderType if layerSliderCheckBox is changed", async () => {
        const spyToggleSliderType = sinon.spy(LayerSliderComponent.methods, "toggleSliderType"),
            layerSliderWrapper = shallowMount(LayerSliderComponent, {
                global: {
                    plugins: [store]
                }
            }),
            checkBox = layerSliderWrapper.find("#module-layer-slider-checkbox");

        await checkBox.trigger("change");

        expect(spyToggleSliderType.calledOnce).to.be.true;
    });
});

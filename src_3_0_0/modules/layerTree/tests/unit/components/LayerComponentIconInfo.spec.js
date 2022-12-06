import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerComponentIconInfo from "../../../components/LayerComponentIconInfo.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerComponentIconInfo.vue", () => {
    let icon,
        layer,
        propsData,
        startLayerInformationSpy,
        store,
        wrapper;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            datasets: [
                {
                    md_id: "123456789"
                }
            ]
        };

        propsData = {
            layerConf: layer
        };

        icon = "bi-test";
        startLayerInformationSpy = sinon.spy();

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        LayerInformation: {
                            namespaced: true,
                            actions: {
                                startLayerInformation: startLayerInformationSpy
                            },
                            getters: {
                                icon: () => icon
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

    it("renders the info icon given as property to the component", () => {
        wrapper = shallowMount(LayerComponentIconInfo, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-info-" + propsData.layerConf.id).exists()).to.be.true;
    });

    it("renders layer with visibility false and checkbox", () => {
        wrapper = shallowMount(LayerComponentIconInfo, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-info-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);
        expect(wrapper.find("button > i").classes()).to.includes(icon);
    });

    it("click on button of info icon", async () => {
        let button = null;

        wrapper = shallowMount(LayerComponentIconInfo, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-info-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.find("#layer-component-icon-info-button-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);

        button = wrapper.find("#layer-component-icon-info-button-" + propsData.layerConf.id);
        button.trigger("click");
        await wrapper.vm.$nextTick();

        expect(startLayerInformationSpy.calledOnce).to.be.true;
        expect(startLayerInformationSpy.firstCall.args[1]).to.be.deep.equals(layer);
    });

    it("click on disabled button of info icon, that layer has no datasets", async () => {
        const layerWithoutDatasets = {
            id: "2",
            name: "layer",
            typ: "WMS"
        };

        propsData = {
            layerConf: layerWithoutDatasets
        };

        let button = null;

        wrapper = shallowMount(LayerComponentIconInfo, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-info-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.find("#layer-component-icon-info-button-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);

        button = wrapper.find("#layer-component-icon-info-button-" + propsData.layerConf.id);
        button.trigger("click");
        await wrapper.vm.$nextTick();

        expect(startLayerInformationSpy.notCalled).to.be.true;
    });
});

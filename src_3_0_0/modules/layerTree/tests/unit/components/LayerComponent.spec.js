import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import LayerComponent from "../../../components/LayerComponent.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe.only("src_3_0_0/modules/layerTree/components/Layer.vue", () => {
    let store,
        wrapper,
        layer,
        propsData,
        replaceByIdInLayerConfigSpy;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            visibility: false
        };
        propsData = {
            layerConf: layer
        };
        replaceByIdInLayerConfigSpy = sinon.spy();
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerComponent
                    }
                }
            },
            mutations: {
                replaceByIdInLayerConfig: replaceByIdInLayerConfigSpy
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        sinon.restore();
    });

    it("renders the layer given as property to the component", () => {
        wrapper = shallowMount(LayerComponent, {store, propsData: propsData, localVue});

        expect(wrapper.find("#layertree-layer-" + propsData.layerConf.id).exists()).to.be.true;
    });

    it("renders layer with visibility false and checkbox", () => {
        wrapper = shallowMount(LayerComponent, {store, propsData: propsData, localVue});

        expect(wrapper.find("#layertree-layer-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("h5").text()).to.equal(propsData.layerConf.name);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders layer with visibility true and checkbox, name is bold", () => {
        propsData.layerConf.visibility = true;

        wrapper = shallowMount(LayerComponent, {store, propsData: propsData, localVue});

        expect(wrapper.find("#layertree-layer-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("h5").text()).to.equal(propsData.layerConf.name);
        expect(wrapper.find("label").attributes("class")).to.include("bold");
    });

    it("click on checkbox of layer with visibility false", async () => {
        const spyArg = {
            layerConfigs: [{
                id: layer.id,
                layer: {
                    id: layer.id,
                    visibility: true
                }
            }]
        };
        let checkbox = null;

        wrapper = shallowMount(LayerComponent, {store, propsData: propsData, localVue});

        expect(wrapper.find("#layertree-layer-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);

        checkbox = wrapper.find("input");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
        expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });

    it("click on checkbox of layer with visibility true", async () => {
        const spyArg = {
            layerConfigs: [{
                id: layer.id,
                layer: {
                    id: layer.id,
                    visibility: false
                }
            }]
        };
        let checkbox = null;

        propsData.layerConf.visibility = true;
        wrapper = shallowMount(LayerComponent, {store, propsData: propsData, localVue});

        expect(wrapper.find("#layertree-layer-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);

        checkbox = wrapper.find("input");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
        expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });


});

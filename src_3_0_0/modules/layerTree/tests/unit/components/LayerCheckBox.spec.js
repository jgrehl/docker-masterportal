import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import layerFactory from "../../../../../core/layers/js/layerFactory";
import LayerCheckBox from "../../../components/LayerCheckBox.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerCheckBox.vue", () => {
    let store,
        wrapper,
        layer,
        propsData,
        mapMode,
        replaceByIdInLayerConfigSpy,
        addSelectedLayerSpy,
        removeSelectedLayerSpy,
        isLayerTree;

    beforeEach(() => {
        isLayerTree = true;
        mapMode = "2D";
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        propsData = {
            conf: layer,
            isLayerTree: isLayerTree
        };

        replaceByIdInLayerConfigSpy = sinon.spy();
        addSelectedLayerSpy = sinon.spy();
        removeSelectedLayerSpy = sinon.spy();
        sinon.stub(layerFactory, "getLayerTypes3d").returns(["TERRAIN3D"]);
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerCheckBox,
                        LayerSelection: {
                            namespaced: true,
                            mutations: {
                                addSelectedLayer: addSelectedLayerSpy,
                                removeSelectedLayer: removeSelectedLayerSpy
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => mapMode
                    }
                }
            },
            mutations: {
                replaceByIdInLayerConfig: replaceByIdInLayerConfigSpy
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the layer given as property to the component", () => {
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
    });

    it("renders layer with visibility false and checkbox", () => {
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("input").element.checked).to.be.false;
        expect(wrapper.find("span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders layer with shortname", () => {
        propsData.conf.shortname = "short";
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("input").element.checked).to.be.false;
        expect(wrapper.find("span").text()).to.equal(propsData.conf.shortname);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders layer with visibility true and checkbox, name is bold", () => {
        propsData.conf.visibility = true;

        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).attributes("title")).to.be.undefined;
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("input").element.checked).to.be.true;
        expect(wrapper.find("input").element.disabled).to.be.false;
        expect(wrapper.find("span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).to.include("bold");
    });

    it("renders layer with visibility true and checkbox - disabled", () => {
        propsData.conf.visibility = true;
        propsData.isLayerTree = false;

        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).attributes("title")).to.be.equals("tree.isAlreadyAdded");
        expect(wrapper.findAll("input").length).to.be.equals(1);
        expect(wrapper.find("input").attributes("type")).to.be.equals("checkbox");
        expect(wrapper.find("input").element.checked).to.be.true;
        expect(wrapper.find("input").element.disabled).to.be.true;
        expect(wrapper.find("span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).to.include("bold");
    });


    it("computed property isLayerVisible with visibility=false ", () => {
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.vm.isLayerVisible).to.be.false;
    });
    it("computed property isLayerVisible with visibility=undefined ", () => {
        layer.visibility = undefined;
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.vm.isLayerVisible).to.be.false;
    });
    it("computed property isLayerVisible with visibility=true ", () => {
        layer.visibility = true;
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.vm.isLayerVisible).to.be.true;
    });

    it("layerTree: click on checkbox of layer with visibility false, call replaceByIdInLayerConfig", async () => {
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

        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
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

        propsData.conf.visibility = true;
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);

        checkbox = wrapper.find("input");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
        expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });

    it("layerSelection: click on checked checkbox of layer with visibility true, call removeSelectedLayer", async () => {
        const spyArg = {
            layerId: layer.id
        };
        let checkbox = null;

        propsData.isLayerTree = false;
        propsData.conf.visibility = false;
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(1);

        checkbox = wrapper.find("input");
        checkbox.setChecked();
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(removeSelectedLayerSpy.calledOnce).to.be.true;
        expect(removeSelectedLayerSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });


});

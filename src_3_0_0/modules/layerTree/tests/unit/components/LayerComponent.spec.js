import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import layerFactory from "../../../../../core/layers/js/layerFactory";
import LayerComponent from "../../../components/LayerComponent.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerComponent.vue", () => {
    let store,
        wrapper,
        layer,
        propsData,
        mapMode,
        replaceByIdInLayerConfigSpy,
        layer3D;

    beforeEach(() => {
        mapMode = "2D";
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        layer3D = {
            id: "3",
            name: "layer3D",
            typ: "Terrain3D",
            visibility: false,
            showInLayerTree: true
        };

        propsData = {
            conf: layer
        };

        replaceByIdInLayerConfigSpy = sinon.spy();
        sinon.stub(layerFactory, "getLayerTypes3d").returns(["TERRAIN3D"]);
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerComponent
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
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
    });

    it("renders layer with visibility false and checkbox", () => {
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("span").length).to.be.equals(1);
        expect(wrapper.find("span").attributes("class")).to.include("bi-square");
        expect(wrapper.find("span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders layer with visibility true and checkbox, name is bold", () => {
        propsData.conf.visibility = true;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("span").length).to.be.equals(1);
        expect(wrapper.find("span").attributes("class")).to.include("bi-check2-square");
        expect(wrapper.find("span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).to.include("bold");
    });

    it("method showInLayerTree - do not show layer with showInLayerTree = false", () => {
        propsData.conf.visibility = true;
        propsData.conf.showInLayerTree = false;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        wrapper.vm.showInLayerTree();

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.false;
    });
    it("method showInLayerTree - show layer with showInLayerTree = true", () => {
        propsData.conf.showInLayerTree = false;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        wrapper.vm.showInLayerTree();

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.false;
    });
    it("method showInLayerTree - show 3D-Layer", () => {
        mapMode = "3D";
        propsData.conf = layer3D;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        wrapper.vm.showInLayerTree();

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
    });
    it("computed property isLayerVisible with visibility=false ", () => {
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });


        expect(wrapper.vm.isLayerVisible).to.be.false;
    });
    it("computed property isLayerVisible with visibility=undefined ", () => {
        layer.visibility = undefined;
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });


        expect(wrapper.vm.isLayerVisible).to.be.false;
    });
    it("computed property isLayerVisible with visibility=true ", () => {
        layer.visibility = true;
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });


        expect(wrapper.vm.isLayerVisible).to.be.true;
    });

    it("click on checkbox of layer with visibility false, call replaceByIdInLayerConfig", async () => {
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

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("span").length).to.be.equals(1);

        checkbox = wrapper.find("span");
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
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("span").length).to.be.equals(1);

        checkbox = wrapper.find("span");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
        expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });


});

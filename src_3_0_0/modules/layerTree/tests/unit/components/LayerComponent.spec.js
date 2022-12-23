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
        layer3D,
        isLayerTree;

    beforeEach(() => {
        mapMode = "2D";
        isLayerTree = true;
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
        sinon.stub(LayerComponent.methods, "isLayerTree").callsFake(() => {
            return isLayerTree;
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the layer given as property to the component,  isLayerTree = true", () => {
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
    });

    it("renders the layer given as property to the component,  isLayerTree = false", () => {
        isLayerTree = false;
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);
        expect(wrapper.find(".layer-tree-layer-checkbox").attributes("class")).to.include("bi-square");
        expect(wrapper.find("label > span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders layer with visibility false and checkbox, icon and submenu for layerTree", () => {
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(1);
        expect(wrapper.findAll("layer-component-icon-sub-menu-stub").length).to.be.equals(1);
        expect(wrapper.findAll("layer-component-icon-info-stub").length).to.be.equals(1);
        expect(wrapper.findAll("layer-component-sub-menu-stub").length).to.be.equals(1);
    });
    it("renders layer with checkbox and no icon and no submenu for layerSelection", () => {
        isLayerTree = false;
        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(1);
        expect(wrapper.findAll("layer-component-icon-sub-menu-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-component-icon-info-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-component-sub-menu-stub").length).to.be.equals(0);
    });

    it("renders layer with visibility true and checkbox", () => {
        propsData.conf.visibility = true;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);
        expect(wrapper.find(".layer-tree-layer-checkbox").attributes("class")).to.include("bi-check2-square");
        expect(wrapper.find("label > span").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).to.include("bold");
    });

    it("do not show layer with showInLayerTree = false", () => {
        propsData.conf.visibility = true;
        propsData.conf.showInLayerTree = false;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.false;
    });
    it("show layer with showInLayerTree = true", () => {
        propsData.conf.showInLayerTree = true;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-tree-layer-" + propsData.conf.id).exists()).to.be.true;
    });
    it("show 3D-Layer", () => {
        mapMode = "3D";
        propsData.conf = layer3D;

        wrapper = shallowMount(LayerComponent, {
            global: {
                plugins: [store]
            },
            propsData
        });

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
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);

        checkbox = wrapper.find(".layer-tree-layer-checkbox");
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
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);

        checkbox = wrapper.find(".layer-tree-layer-checkbox");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
        expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });


});

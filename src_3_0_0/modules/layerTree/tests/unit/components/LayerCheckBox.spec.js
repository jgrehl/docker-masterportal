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
        replaceByIdInLayerConfigSpy,
        addSelectedLayerSpy,
        removeSelectedLayerSpy,
        isLayerTree,
        layersToAdd;

    beforeEach(() => {
        isLayerTree = true;
        layersToAdd = [];
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
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: sinon.stub()
                    }
                },
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
                            },
                            getters: {
                                layersToAdd: () => layersToAdd
                            }
                        }
                    }
                }
            },
            actions: {
                replaceByIdInLayerConfig: replaceByIdInLayerConfigSpy
            },
            getters: {
                layerConfigById: () => () => {
                    return {
                        layerAttribution: "This is the layer attribution!",
                        name: "The layer"
                    };
                }
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
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);
        expect(wrapper.find(".layer-tree-layer-checkbox pe-2 bi-check2-square").exists()).to.be.false;
        expect(wrapper.find(".layer-tree-layer-label").text()).to.equal(propsData.conf.name);
        expect(wrapper.find("label").attributes("class")).not.to.include("bold");
    });

    it("renders background-layer as simple preview", () => {
        layer.baselayer = true;
        layer.showInLayerTree = false;

        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.false;
        expect(wrapper.find("#layer-tree-layer-preview-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.find("layer-preview-stub").exists()).to.be.true;
        expect(wrapper.find(".pt-4").text()).to.equal(propsData.conf.name);
    });

    it("renders background-layer with preview in config", () => {
        layer.baselayer = true;
        layer.showInLayerTree = false;
        layer.shortname = "shortname";
        layer.preview = {
            customClass: "customClass",
            center: "1,2",
            zoomLevel: 6
        };

        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.false;
        expect(wrapper.find("#layer-tree-layer-preview-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.find("layer-preview-stub").exists()).to.be.true;
        expect(wrapper.find("layer-preview-stub").attributes("center")).to.be.equals(layer.preview.center);
        expect(wrapper.find("layer-preview-stub").attributes("zoomlevel")).to.be.equals(String(layer.preview.zoomLevel));
        expect(wrapper.find("layer-preview-stub").attributes("customclass")).to.be.equals(layer.preview.customClass);
        expect(wrapper.find("layer-preview-stub").attributes("checkable")).to.be.equals("true");
        expect(wrapper.find(".pt-4").text()).to.equal(propsData.conf.shortname);
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
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);
        expect(wrapper.find(".bi-check2-square").exists()).to.be.false;
        expect(wrapper.find(".layer-tree-layer-label").text()).to.equal(propsData.conf.shortname);
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
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);
        expect(wrapper.find(".bi-check-square").exists()).to.be.true;
        expect(wrapper.find(".layer-tree-layer-label").text()).to.equal(propsData.conf.name);
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
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);

        checkbox = wrapper.find(".layer-tree-layer-checkbox");
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

        layersToAdd = [layer.id];
        propsData.isLayerTree = false;
        propsData.conf.visibility = false;
        wrapper = shallowMount(LayerCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#layer-checkbox-" + propsData.conf.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(1);

        checkbox = wrapper.find(".layer-tree-layer-checkbox");
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();

        expect(removeSelectedLayerSpy.calledOnce).to.be.true;
        expect(removeSelectedLayerSpy.firstCall.args[1]).to.be.deep.equals(spyArg);
    });

    describe("showLayerAttributions", () => {
        it("should throw an alert, if layer has a layerAttribution", () => {
            wrapper = shallowMount(LayerCheckBox, {
                global: {
                    plugins: [store]
                },
                propsData
            });

            const addSingleAlertSpy = sinon.spy(wrapper.vm, "addSingleAlert");

            wrapper.vm.showLayerAttributions(true);

            expect(addSingleAlertSpy.calledOnce).to.be.true;
            expect(addSingleAlertSpy.firstCall.args[0]).to.deep.equals({
                content: "This is the layer attribution!",
                category: "info",
                title: "The layer",
                onceInSession: true
            });
        });
    });
});

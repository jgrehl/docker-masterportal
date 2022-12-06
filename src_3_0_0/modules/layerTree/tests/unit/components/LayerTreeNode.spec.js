import {createStore} from "vuex";
import {config, mount, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerTreeNode from "../../../components/LayerTreeNode.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerTreeNode.vue", () => {
    let store,
        wrapper,
        layer_1,
        layer_2,
        layer_3,
        layersWithFolder,
        propsData;

    beforeEach(() => {
        layer_1 = {
            id: "1",
            name: "layer_1",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        layer_2 = {
            id: "2",
            name: "layer_2",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        layer_3 = {
            id: "3",
            name: "layer_3",
            typ: "WFS",
            visibility: true,
            showInLayerTree: true
        };
        propsData = {
            conf: layer_1
        };
        layersWithFolder = {
            Titel: "Titel Ebene 1",
            Ordner: [
                {
                    Titel: "Titel Ebene 2",
                    Layer: [layer_1, layer_2],
                    Ordner: [
                        {
                            Titel: "Titel Ebene 3",
                            Layer: [layer_3]
                        }
                    ]
                }
            ]
        };
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerTreeNode,
                        LayerInformation: {
                            namespaced: true,
                            getters: {
                                icon: sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders a simple layer", () => {
        wrapper = shallowMount(LayerTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-stub").length).to.be.equals(1);
        expect(wrapper.vm.isFolder).to.be.false;
        expect(wrapper.vm.isLayerArray).to.be.false;
        expect(wrapper.vm.isLayer).to.be.true;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.false;
    });
    it("renders a list of layers, but no folder", () => {
        propsData = {
            conf: {Layer: [layer_1, layer_2]}
        };
        wrapper = shallowMount(LayerTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-stub").length).to.be.equals(2);
        expect(wrapper.vm.layers.length).to.be.equals(2);
        expect(wrapper.vm.isFolder).to.be.false;
        expect(wrapper.vm.isLayerArray).to.be.true;
        expect(wrapper.vm.isLayer).to.be.false;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.false;
    });
    it("renders folder and layers, no child components", () => {
        propsData = {
            conf: layersWithFolder
        };
        wrapper = shallowMount(LayerTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("layer-stub").length).to.be.equals(3);
        expect(wrapper.findAll("folder-stub").length).to.be.equals(3);
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.vm.layers.length).to.be.equals(3);
        expect(wrapper.vm.isFolder).to.be.true;
        expect(wrapper.vm.isLayerArray).to.be.false;
        expect(wrapper.vm.isLayer).to.be.false;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.true;
    });
    it("renders folder and layers with child components", () => {
        let inputs = null;

        propsData = {
            conf: layersWithFolder
        };
        wrapper = mount(LayerTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });
        inputs = wrapper.findAll("input");

        expect(wrapper.find(".no-list").exists()).to.be.true;
        // only 2 folder: one Ordner in config has only one layer and therefore no checkbox
        expect(inputs.filter(input => input.attributes().id.startsWith("layer-tree-folder-checkbox-")).length).to.be.equals(2);
        // 3 layer
        expect(inputs.filter(input => input.attributes().id.startsWith("layer-tree-layer-checkbox-")).length).to.be.equals(3);
        expect(wrapper.find("#layer-tree-layer-" + layer_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer_3.id).exists()).to.be.true;
        expect(wrapper.findAll(".folder").length).to.be.equals(3);
    });

});

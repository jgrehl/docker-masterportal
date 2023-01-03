import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerTreeNode from "../../../components/LayerTreeNode.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerTreeNode.vue", () => {
    let store,
        wrapper,
        mapMode,
        layerBG_1,
        layerBG_2,
        layers2D,
        layers3D,
        layer2D_1,
        layer2D_2,
        layer2D_3,
        layer3D,
        subjectDataLayers,
        layersWithFolder,
        layersBG;

    beforeEach(() => {
        mapMode = "2D";
        layer2D_1 = {
            id: "1",
            name: "layer2D_1",
            typ: "WMS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layer2D_2 = {
            id: "2",
            name: "layer2D_2",
            typ: "WFS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layer2D_3 = {
            id: "2D_3",
            name: "layer2D_3",
            typ: "WFS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layer3D = {
            id: "3",
            name: "layer3D",
            typ: "Terrain3D",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layerBG_1 = {
            id: "11",
            name: "layerBG_1",
            typ: "WMS",
            type: "layer",
            visibility: true,
            showInLayerTree: true
        };
        layerBG_2 = {
            id: "12",
            name: "layerBG_2",
            typ: "WFS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layers2D = [
            layer2D_1,
            layer2D_2
        ];
        layers3D = [
            layer3D
        ];
        layersBG = [
            layerBG_1,
            layerBG_2
        ];
        layersWithFolder = [
            {
                name: "Titel Ebene 1",
                type: "folder",
                elements: [
                    {
                        name: "Titel Ebene 2",
                        type: "folder",
                        elements: [layer2D_1, layer2D_2,
                            {
                                name: "Titel Ebene 3",
                                type: "folder",
                                elements: [layer2D_3]
                            }]
                    }
                ]
            }];
        subjectDataLayers = layers2D;
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
                        mode: () => mapMode
                    }
                }
            },
            getters: {
                layerConfig: () => {
                    return {
                        Fachdaten: {
                            elements: subjectDataLayers
                        },
                        Hintergrundkarten: {
                            elements: layersBG
                        }
                    };
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
        expect(wrapper.vm.getLayerArray).to.be.deep.equals([]);
        expect(wrapper.vm.isLayer).to.be.true;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.false;
    });
    it("renders a list of layers, but no folder", () => {
        propsData = {
            conf: {elements: [layer_1, layer_2]}
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
        expect(wrapper.vm.getLayerArray).to.be.deep.equals(propsData.conf.elements);
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
        expect(wrapper.vm.getLayerArray).to.be.deep.equals([]);
        expect(wrapper.vm.isLayer).to.be.false;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.true;
    });
    it("renders folder and layers with child components", () => {
        propsData = {
            conf: layersWithFolder
        };
        wrapper = mount(LayerTreeNode, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.find(".dragArea").exists()).to.be.true;
        expect(wrapper.find("ul").exists()).to.be.true;
        expect(wrapper.findAll("li").length).to.be.equals(4);
        expect(wrapper.vm.getLayerArray(layer2D_1)).to.be.deep.equals([]);
        expect(wrapper.vm.getLayerArray(layer2D_2)).to.be.deep.equals([]);
        expect(wrapper.vm.getLayerArray(layerBG_1)).to.be.deep.equals([]);
        expect(wrapper.vm.getLayerArray(layerBG_2)).to.be.deep.equals([]);
        // only 2 folder: one Ordner in config has only one layer and therefore no checkbox
        expect(wrapper.findAll(".layer-tree-folder-checkbox").length).to.be.equals(2);
        // 3 layer
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(3);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 2D layers in folder structure", () => {
        subjectDataLayers = layersWithFolder;
        wrapper = mount(LayerTreeNode, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.find(".dragArea").exists()).to.be.true;
        expect(wrapper.find("ul").exists()).to.be.true;
        expect(wrapper.findAll("li").length).to.be.equals(5);
        expect(wrapper.vm.isLayerShowInLayerTree(layer2D_1)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layer2D_2)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layer2D_3)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layerBG_1)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layerBG_2)).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_3.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 3D layers", () => {
        mapMode = "3D";
        subjectDataLayers = layers2D.concat(layers3D);
        wrapper = mount(LayerTreeNode, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.find(".dragArea").exists()).to.be.true;
        expect(wrapper.find("ul").exists()).to.be.true;
        expect(wrapper.findAll("li").length).to.be.equals(5);
        expect(wrapper.vm.isLayerShowInLayerTree(layer2D_1)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layer2D_2)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layer3D)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layerBG_1)).to.be.true;
        expect(wrapper.vm.isLayerShowInLayerTree(layerBG_2)).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer3D.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });
});

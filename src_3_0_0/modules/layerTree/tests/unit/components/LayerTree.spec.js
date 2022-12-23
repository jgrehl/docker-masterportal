import {createStore} from "vuex";
import {config, mount, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import getNestedValues from "../../../../../shared/js/utils/getNestedValues";
import LayerTreeComponent from "../../../components/LayerTree.vue";
import LayerTree from "../../../store/indexLayerTree";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerTree.vue", () => {
    let store,
        wrapper,
        mapMode,
        layerBG_1,
        layerBG_2,
        layers2D,
        layer_1,
        layer_2,
        layer_3,
        subjectDataLayers,
        layersWithFolder,
        layersBG,
        addLayerButton,
        treeType;

    beforeEach(() => {
        mapMode = "2D";
        treeType = "light";
        addLayerButton = false;
        layer_1 = {
            id: "1",
            name: "layer_1",
            typ: "WMS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layer_2 = {
            id: "2",
            name: "layer_2",
            typ: "WFS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        layer_3 = {
            id: "2D_3",
            name: "layer_3",
            typ: "WFS",
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
            layer_1,
            layer_2
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
                        elements: [layer_1, layer_2,
                            {
                                name: "Titel Ebene 3",
                                type: "folder",
                                elements: [layer_3]
                            }]
                    }
                ]
            }];
        subjectDataLayers = layers2D;
        store = createStore({
            namespaces: true,
            modules: {
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => mapMode
                    }
                },
                Menu: {
                    namespaced: true,
                    actions: {
                        setMenuBackAndActivateItem: sinon.stub()
                    },
                    modules: {
                        Navigation: {
                            namespaced: true,
                            getters: {
                                entries: sinon.stub(),
                                isModuleActiveInMenu: sinon.stub()
                            }
                        }
                    }
                },
                Modules: {
                    namespaced: true,
                    modules: {
                        LayerTree,
                        LayerInformation: {
                            namespaced: true,
                            getters: {
                                icon: sinon.stub()
                            }
                        }
                    }
                }
            },
            getters: {
                allLayerConfigsStructured: () => () =>{
                    return layersBG.concat(subjectDataLayers);
                },
                allLayerConfigs: () =>{
                    return layersBG.concat(subjectDataLayers);
                },
                portalConfig: () => {
                    return {
                        tree: {
                            type: treeType,
                            addLayerButton: addLayerButton
                        }
                    };
                },
                layerConfigsByArributes: () => () => {
                    const layerConfigs = {
                            Fachdaten: {
                                elements: subjectDataLayers
                            },
                            Hintergrundkarten: {
                                elements: layersBG
                            }
                        },
                        allConfigs = getNestedValues(layerConfigs, "elements", true).flat(Infinity);

                    return allConfigs.filter(conf => conf.showInLayerTree === true);
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("no layer button - renders the LayerTree without layers", () => {
        subjectDataLayers = [];
        layersBG = [];
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(1);
        // expects an empty stub
        expect(wrapper.findAll("layer-tree-node-stub > Draggable").length).to.be.equals(0);
        expect(wrapper.find("#add-layer-btn").exists()).to.be.false;
    });
    it("with layer button - renders the LayerTree without layers", () => {
        subjectDataLayers = [];
        layersBG = [];
        addLayerButton = true;
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(1);
        // expects an empty stub
        expect(wrapper.findAll("layer-tree-node-stub > Draggable").length).to.be.equals(0);
        expect(wrapper.find("#add-layer-btn").exists()).to.be.true;
    });

    it("no layer button - renders the LayerTree with 2D layers as children - check layers", () => {
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(4);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 2D layers in folder structure - check layers", () => {
        let inputs = null,
            folderinputs = null;

        subjectDataLayers = layersWithFolder;
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});
        folderinputs = wrapper.findAll("input");
        inputs = wrapper.findAll(".layer-tree-layer-checkbox");

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        // only 2 folder: one Ordner in config has only one layer and therefore no folder
        expect(folderinputs.filter(folderinput => folderinput.attributes().id.startsWith("layer-tree-folder-checkbox-")).length).to.be.equals(2);
        // 2 bg-layer and 3 other subjectData-layer
        expect(inputs.length).to.equal(5);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_3.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("click on add layer button shall call showLayerSelection", async () => {
        const spy = sinon.spy(LayerTreeComponent.methods, "showLayerSelection");
        let button = null;

        addLayerButton = true;
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(5);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer3D.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

});

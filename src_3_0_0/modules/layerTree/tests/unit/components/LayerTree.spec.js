import {config, shallowMount} from "@vue/test-utils";
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
        layers3D,
        layer2D_1,
        layer2D_2,
        layer2D_3,
        layer3D,
        subjectDataLayers,
        layersWithFolder,
        layersBG,
        addLayerButton,
        treeType;

    beforeEach(() => {
        mapMode = "2D";
        treeType = "light";
        addLayerButton = false;
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
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
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
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.find("#add-layer-btn").exists()).to.be.true;
    });

    it("no layer button - renders the LayerTree with 2D layers", () => {
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(4);
    });

    it("with layer button - renders the LayerTree with 2D layers with showInLayerTree=true or visibility=true", () => {
        layer2D_1.showInLayerTree = false;
        layer2D_2.showInLayerTree = false;
        layer2D_3.showInLayerTree = undefined;
        layer2D_3.visibility = true;
        addLayerButton = true;
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(2);
        expect(wrapper.find("#add-layer-btn").exists()).to.be.true;
    });

    it("no layer button - renders the LayerTree with 2D layers in folder structure", () => {
        subjectDataLayers = layersWithFolder;
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(3);
    });

    it("with layer button - renders the LayerTree with 2D layers in folder structure", () => {
        subjectDataLayers = layersWithFolder;
        addLayerButton = true;
        layer2D_1.showInLayerTree = false;
        layer2D_2.showInLayerTree = false;
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(3);
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

    it("no layer button - renders the LayerTree with 2D layers in folder structure - check layers", () => {
        subjectDataLayers = layersWithFolder;
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        // only 2 folder: one Ordner in config has only one layer and therefore no folder
        expect(wrapper.findAll(".layer-tree-folder-checkbox").length).to.be.equals(2);
        // 2 bg-layer and 3 other subjectData-layer
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(5);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_3.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("no layer button - renders the LayerTree with 3D layers as children - check layers", () => {
        mapMode = "3D";
        subjectDataLayers = layers2D.concat(layers3D);
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-layer-checkbox").length).to.be.equals(5);
        expect(wrapper.find("#layer-tree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layer-tree-layer-" + layer3D.id).exists()).to.be.true;
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
        expect(wrapper.findAll("#add-layer-btn").length).to.be.equals(1);

        button = wrapper.find("#add-layer-btn");
        button.trigger("click");
        await wrapper.vm.$nextTick();
        expect(spy.calledOnce).to.be.true;
    });

});

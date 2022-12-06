import {createStore} from "vuex";
import {config, shallowMount, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerTreeComponent from "../../../components/LayerTree.vue";

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
        layersBG;

    beforeEach(() => {
        mapMode = "2D";
        layer2D_1 = {
            id: "1",
            name: "layer2D_1",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        layer2D_2 = {
            id: "2",
            name: "layer2D_2",
            typ: "WFS",
            visibility: false,
            showInLayerTree: true
        };
        layer2D_3 = {
            id: "2D_3",
            name: "layer2D_3",
            typ: "WFS",
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
        layerBG_1 = {
            id: "11",
            name: "layerBG_1",
            typ: "WMS",
            visibility: true,
            showInLayerTree: true
        };
        layerBG_2 = {
            id: "12",
            name: "layerBG_2",
            typ: "WFS",
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
        layersWithFolder = [{
            Titel: "Titel Ebene 1",
            Ordner: [
                {
                    Titel: "Titel Ebene 2",
                    Layer: [layer2D_1, layer2D_2],
                    Ordner: [
                        {
                            Titel: "Titel Ebene 3",
                            Layer: [layer2D_3]
                        }
                    ]
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
                }
            },
            getters: {
                layerConfig: () => {
                    return {
                        Fachdaten: {
                            Layer: subjectDataLayers
                        },
                        Hintergrundkarten: {
                            Layer: layersBG
                        }
                    };
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the LayerTree without layers", () => {
        subjectDataLayers = [];
        layersBG = [];
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(0);
    });

    it("renders the LayerTree with 2D layers", () => {
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(4);
    });

    it("renders the LayerTree with 2D layers in folder structure", () => {
        subjectDataLayers = layersWithFolder;
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(3);
    });

    it("renders the LayerTree with 2D layers as children - check layers", () => {
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(4);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 2D layers in folder structure - check layers", () => {
        let inputs = null;

        subjectDataLayers = layersWithFolder;
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});
        inputs = wrapper.findAll("input");

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        // only 2 folder: one Ordner in config has only one layer and therefore no folder
        expect(inputs.filter(input => input.attributes().id.startsWith("layertree-folder-checkbox-")).length).to.be.equals(2);
        // 2 bg-layer and 3 other subjectData-layer
        expect(inputs.filter(input => input.attributes().id.startsWith("layertree-layer-checkbox-")).length).to.be.equals(5);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_3.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 3D layers as children - check layers", () => {
        mapMode = "3D";
        subjectDataLayers = layers2D.concat(layers3D);
        wrapper = mount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(5);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer3D.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_2.id).exists()).to.be.true;
    });


});

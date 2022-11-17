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
        layers2D,
        layers3D,
        layer2D_1,
        layer2D_2,
        layer3D,
        subjectDataLayers;

    beforeEach(() => {
        mapMode = "2D";
        layer2D_1 = {
            id: "1",
            name: "layer2D_1",
            typ: "WMS",
            visibility: false
        };
        layer2D_2 = {
            id: "2",
            name: "layer2D_2",
            typ: "WFS",
            visibility: false
        };
        layer3D = {
            id: "3",
            name: "layer3D",
            typ: "Terrain3D",
            visibility: false
        };
        layerBG_1 = {
            id: "11",
            name: "layerBG_1",
            typ: "WMS",
            visibility: true
        };
        layerBG_2 = {
            id: "12",
            name: "layerBG_2",
            typ: "WFS",
            visibility: false
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
                    const config = {
                        Fachdaten: {
                            Layer: subjectDataLayers
                        },
                        Hintergrundkarten: {
                            Layer: layersBG
                        }
                    };

                    // console.log("test",config.Hintergrundkarten.Layer);
                    return config;
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
        expect(wrapper.findAll("layertreenode-stub").length).to.be.equals(0);
    });

    it("renders the LayerTree with 2D layers", () => {
        wrapper = shallowMount(LayerTreeComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layertreenode-stub").length).to.be.equals(4);
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

    it("renders the LayerTree with 3D layers as children - check layers", () => {
        mapMode = "3D";
        subjectDataLayers = layers2D.concat(layers3D);
        wrapper = mount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(5);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer3D.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layerBG_2.id).exists()).to.be.true;
    });


});

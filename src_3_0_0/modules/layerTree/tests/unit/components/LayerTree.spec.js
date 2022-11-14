import {config, shallowMount, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import LayerTreeComponent from "../../../components/LayerTree.vue";
import LayerTree from "../../../store/indexLayerTree";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerTree.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            navigationSecondary: {
                sections: [
                    {
                        type: "layerTree"
                    }
                ]
            }
        }
    };
    let store,
        wrapper,
        mapMode,
        layers2D,
        layers3D,
        layer2D_1,
        layer2D_2,
        layer3D;

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
        layers2D = [
            layer2D_1,
            layer2D_2
        ];
        layers3D = [
            layer3D
        ];
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerTree
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
                inTreeVisibleLayerConfigsByMode: () => (mode) => {
                    if (mode === "2D") {
                        return layers2D;
                    }

                    return layers2D.concat(layers3D);

                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        sinon.restore();
    });

    it("renders the LayerTree without layers", () => {
        layers2D = [];
        wrapper = shallowMount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-stub").length).to.be.equals(0);
    });

    it("renders the LayerTree with 2D layers", () => {
        wrapper = shallowMount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-stub").length).to.be.equals(2);
    });

    it("renders the LayerTree with 2D and 3D layers", () => {
        mapMode = "3D";
        wrapper = shallowMount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-stub").length).to.be.equals(3);
    });

    it("renders the LayerTree with 2D layers as children - check layers", () => {
        wrapper = mount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(2);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
    });

    it("renders the LayerTree with 3D layers as children - check layers", () => {
        mapMode = "3D";
        wrapper = mount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("input").length).to.be.equals(3);
        expect(wrapper.find("#layertree-layer-" + layer2D_1.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer2D_2.id).exists()).to.be.true;
        expect(wrapper.find("#layertree-layer-" + layer3D.id).exists()).to.be.true;
    });


});

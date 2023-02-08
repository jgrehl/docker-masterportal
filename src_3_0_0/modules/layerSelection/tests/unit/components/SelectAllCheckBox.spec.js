import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import layerFactory from "../../../../../core/layers/js/layerFactory";
import SelectAllCheckBox from "../../../components/SelectAllCheckBox.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/SelectAllCheckBox.vue", () => {
    let store,
        wrapper,
        layer,
        propsData,
        addSelectedLayerSpy,
        removeSelectedLayerSpy,
        layersToAdd;

    beforeEach(() => {
        layersToAdd = [];
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            visibility: false,
            showInLayerTree: true
        };
        propsData = {
            confs: [layer]
        };

        addSelectedLayerSpy = sinon.spy();
        removeSelectedLayerSpy = sinon.spy();
        sinon.stub(layerFactory, "getLayerTypes3d").returns(["TERRAIN3D"]);
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        SelectAllCheckBox,
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
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders a select all checkbox", () => {
        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#select-all-layers-" + layer.id).exists()).to.be.true;
    });

    it("renders select all checkbox - unchecked", () => {
        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#select-all-layers-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-select-all").length).to.be.equals(2);
        expect(wrapper.find("#select-all-checkbox-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll(".bi-square").length).to.be.equals(1);
        expect(wrapper.findAll(".bi-check2-square").length).to.be.equals(0);
        expect(wrapper.find(".layer-tree-layer-label").text()).to.equal("common:tree.selectAll");
    });

    it("renders select all checkbox - checked", () => {
        layersToAdd.push(layer.id);
        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#select-all-layers-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll(".layer-tree-select-all").length).to.be.equals(2);
        expect(wrapper.find("#select-all-checkbox-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll(".bi-square").length).to.be.equals(0);
        expect(wrapper.findAll(".bi-check2-square").length).to.be.equals(1);
        expect(wrapper.find(".layer-tree-layer-label").text()).to.equal("common:tree.selectAll");
    });

    it("click on checkbox shall call addSelectedLayer ", async () => {
        let checkbox = null;

        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#select-all-layers-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll("#select-all-checkbox-" + layer.id).length).to.be.equals(1);
        expect(wrapper.findAll(".bi-square").length).to.be.equals(1);

        checkbox = wrapper.find("#select-all-checkbox-" + layer.id);
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();
        expect(addSelectedLayerSpy.calledOnce).to.be.true;
        expect(addSelectedLayerSpy.firstCall.args[1]).to.be.deep.equals({layerId: layer.id});
    });

    it("click on checkbox shall call removeSelectedLayer ", async () => {
        let checkbox = null;

        layersToAdd.push(layer.id);
        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find("#select-all-layers-" + layer.id).exists()).to.be.true;
        expect(wrapper.findAll("#select-all-checkbox-" + layer.id).length).to.be.equals(1);
        expect(wrapper.findAll(".bi-check2-square").length).to.be.equals(1);

        checkbox = wrapper.find("#select-all-checkbox-" + layer.id);
        checkbox.trigger("click");
        await wrapper.vm.$nextTick();
        expect(removeSelectedLayerSpy.calledOnce).to.be.true;
        expect(removeSelectedLayerSpy.firstCall.args[1]).to.be.deep.equals({layerId: layer.id});
    });

    it("method ids shall return the expected string", () => {
        let ids = null;

        propsData = {
            confs: [layer, {id: "2"}]
        };
        wrapper = shallowMount(SelectAllCheckBox, {
            global: {
                plugins: [store]
            },
            propsData
        });
        ids = wrapper.vm.ids();

        expect(ids).to.be.deep.equals("1-2");
    });
});

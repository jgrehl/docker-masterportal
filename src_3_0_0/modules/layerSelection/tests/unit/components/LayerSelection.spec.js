import {createStore} from "vuex";
import {config, shallowMount, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import {treeBackgroundsKey} from "../../../../../shared/js/utils/constants";
import LayerSelectionComponent from "../../../components/LayerSelection.vue";
import LayerSelection from "../../../store/indexLayerSelection";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerSelection/components/LayerSelection.vue", () => {
    let store,
        wrapper,
        layerBG_1,
        layerBG_2,
        layer2D_1,
        layer2D_2,
        layer2D_3,
        subjectDataLayers,
        layersWithFolder,
        layersBG,
        layersToAdd;

    beforeEach(() => {
        layersToAdd = [];
        layer2D_1 = {
            id: "1",
            name: "layer2D_1",
            typ: "WMS",
            type: "layer",
            visibility: true,
            showInLayerTree: true
        };
        layer2D_2 = {
            id: "2",
            name: "layer2D_2",
            typ: "WFS",
            type: "layer",
            visibility: false
        };
        layer2D_3 = {
            id: "2D_3",
            name: "layer2D_3",
            typ: "WFS",
            type: "layer",
            visibility: false
        };
        layerBG_1 = {
            id: "11",
            name: "layerBG_1",
            typ: "WMS",
            type: "layer",
            visibility: true
        };
        layerBG_2 = {
            id: "12",
            name: "layerBG_2",
            typ: "WFS",
            type: "layer",
            visibility: false
        };
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
        subjectDataLayers = layersWithFolder;
        LayerSelection.actions.navigateForward = sinon.spy();
        LayerSelection.actions.updateLayerTree = sinon.spy();
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerSelection
                    }

                }
            },
            getters: {
                allLayerConfigsStructured: () => (key) =>{
                    if (key === treeBackgroundsKey) {
                        return layersBG;
                    }
                    return subjectDataLayers;
                }
            }
        });
        LayerSelection.getters.layersToAdd = () => layersToAdd;
        LayerSelection.state.active = true;
        store.commit("Modules/LayerSelection/setSubjectDataLayerConfs", subjectDataLayers);
        store.commit("Modules/LayerSelection/setBackgroundLayerConfs", layersBG);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("do not render the LayerSelection if active is false", () => {
        LayerSelection.state.active = false;
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.false;
    });
    it("renders the LayerSelection without layers", () => {
        store.commit("Modules/LayerSelection/setSubjectDataLayerConfs", []);
        store.commit("Modules/LayerSelection/setBackgroundLayerConfs", []);
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.findAll("layer-selection-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(0);
        expect(wrapper.find("flat-button-stub").exists()).to.be.true;
    });

    it("renders the LayerSelection with folder-buttons and checkboxes for background-layers", () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(2);
        expect(wrapper.findAll("layer-selection-tree-node-stub").length).to.be.equals(1);
        expect(wrapper.find("flat-button-stub").exists()).to.be.true;
    });

    it("renders the LayerSelection with all levels of folder-buttons without bg-layers ", async () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;

        wrapper.vm.folderClicked(subjectDataLayers[0].elements);
        await wrapper.vm.$nextTick();

        expect(LayerSelection.actions.navigateForward.calledOnce).to.be.true;
    });

    it("click on button to add layers shall be disabled", () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection-add-layer-btn").exists()).to.be.true;
        expect(wrapper.find("#layer-selection-add-layer-btn").attributes().disabled).to.be.equals("true");
    });

    it("click on button to add layers shall call updateLayerTree", async () => {
        let btn = null;

        layersToAdd = ["1", "2"];
        wrapper = mount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        btn = wrapper.find("#layer-selection-add-layer-btn");
        expect(btn.exists()).to.be.true;
        expect(wrapper.find("#layer-selection-add-layer-btn").element.disabled).to.be.equals(false);

        btn.trigger("click");
        await wrapper.vm.$nextTick();
        expect(LayerSelection.actions.updateLayerTree.calledOnce).to.be.true;
    });

    it("test method sort", () => {
        let sorted = [];
        const toSort = subjectDataLayers[0].elements[0].elements;

        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(toSort[0].type).not.to.be.equals("folder");
        sorted = wrapper.vm.sort(toSort);

        expect(sorted.length).to.be.equals(toSort.length);
        expect(sorted[0].type).to.be.equals("folder");
        expect(sorted[1].type).to.be.equals("layer");
        expect(sorted[2].type).to.be.equals("layer");
    });
});

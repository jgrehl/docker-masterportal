import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import LayerSelectionComponent from "../../../components/LayerSelection.vue";
import LayerSelection from "../../../store/indexLayerSelection";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerSelection/components/LayerSelection.vue", () => {
    let store,
        wrapper,
        categories,
        layerBG_1,
        layerBG_2,
        layerBG_3,
        layer2D_1,
        layer2D_2,
        layer2D_3,
        subjectDataLayers,
        layersWithFolder,
        layersBG,
        layersToAdd,
        changeCategorySpy,
        mapMode,
        searchInput;

    beforeEach(() => {
        searchInput = "Neuenfelder";
        mapMode = "2D";
        categories = [
            {
                "key": "kategorie_opendata",
                "name": "common:modules.layerTree.categoryOpendata",
                "active": true
            },
            {
                "key": "kategorie_inspire",
                "name": "common:modules.layerTree.categoryInspire"
            },
            {
                "key": "kategorie_organisation",
                "name": "common:modules.layerTree.categoryOrganisation"
            }
        ];
        changeCategorySpy = sinon.spy();
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
        layerBG_3 = {
            id: "13",
            name: "layerBG_3",
            typ: "VectorTile",
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
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerSelection,
                        SearchBar: {
                            namespaced: true,
                            getters: {
                                searchInput: () => searchInput,
                                searchInterfaceInstances: () => [],
                                searchResults: () => [],
                                addLayerButtonSearchActive: () => true,
                                showAllResults: () => true,
                                searchResultsActive: () => true,
                                currentSide: () => {
                                    return "mainMenu";
                                },
                                minCharacters: () => 3,
                                placeholder: () => ""

                            },
                            mutations: {
                                setSearchSuggestions: () => "",
                                setCurrentSide: () => ""
                            },
                            actions: {
                                checkLayerSelectionSearchConfig: () => ""
                            }
                        }
                    }
                },
                Menu: {
                    namespaced: true,
                    getters: {
                        currentComponent: () => () => "root"
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
                invisibleBaselayerConfigs: sinon.stub(),
                activeOrFirstCategory: () => categories ? categories[0] : undefined,
                allCategories: () => categories,
                portalConfig: () => {
                    return {
                        addLayerButton: {active: false},
                        tree: {
                            addLayerButton: {active: false},
                            categories: categories
                        }
                    };
                }
            },
            actions: {
                changeCategory: changeCategorySpy
            }
        });
        LayerSelection.getters.layersToAdd = () => layersToAdd;
        LayerSelection.state.visible = true;
        LayerSelection.actions.navigateForward = sinon.spy();
        LayerSelection.actions.updateLayerTree = sinon.spy();
        store.commit("Modules/LayerSelection/setSubjectDataLayerConfs", subjectDataLayers);
        store.commit("Modules/LayerSelection/setBaselayerConfs", layersBG);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("do not render the LayerSelection if visible is false", () => {
        LayerSelection.state.visible = false;
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.false;
    });
    it.skip("renders the LayerSelection without layers", () => {
        store.commit("Modules/LayerSelection/setSubjectDataLayerConfs", []);
        store.commit("Modules/LayerSelection/setBaselayerConfs", []);
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.findAll("layer-selection-tree-node-stub").length).to.be.equals(0);
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(0);
        expect(wrapper.find("flat-button-stub").exists()).to.be.true;
    });

    it.skip("renders the LayerSelection with folder-buttons and checkboxes for background-layers", async () => {
        wrapper = await shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.findAll("layer-check-box-stub").length).to.be.equals(2);
        expect(wrapper.findAll("layer-selection-tree-node-stub").length).to.be.equals(1);
        expect(wrapper.find("flat-button-stub").exists()).to.be.true;
    });

    it.skip("renders the LayerSelection without categories", () => {
        categories = undefined;
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.find("#select_category").exists()).to.be.false;
        expect(wrapper.findAll("option").length).to.be.equals(0);
    });

    it.skip("renders the LayerSelection - check categories select", () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;
        expect(wrapper.find("#select_category").exists()).to.be.true;
        expect(wrapper.findAll("option").length).to.be.equals(3);
        expect(wrapper.findAll("option").at(0).text()).to.be.equals("common:modules.layerTree.categoryOpendata");
        expect(wrapper.findAll("option").at(1).text()).to.be.equals("common:modules.layerTree.categoryInspire");
        expect(wrapper.findAll("option").at(2).text()).to.be.equals("common:modules.layerTree.categoryOrganisation");
    });


    it.skip("renders the LayerSelection with all levels of folder-buttons without bg-layers ", async () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection").exists()).to.be.true;

        wrapper.vm.folderClicked(subjectDataLayers[0].elements);
        await wrapper.vm.$nextTick();

        expect(LayerSelection.actions.navigateForward.calledOnce).to.be.true;
    });

    it.skip("click on button to add layers shall be disabled", () => {
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#layer-selection-add-layer-btn").exists()).to.be.true;
        expect(wrapper.find("#layer-selection-add-layer-btn").attributes().disabled).to.be.equals("true");
    });

    it.skip("click on button to add layers shall call updateLayerTree", () => {
        let btn = null;

        LayerSelection.state.visible = true;

        layersToAdd = ["1", "2"];
        wrapper = shallowMount(LayerSelectionComponent, {
            global: {
                plugins: [store]
            }});

        btn = wrapper.find("#layer-selection-add-layer-btn");
        expect(btn.exists()).to.be.true;
        expect(wrapper.find("#layer-selection-add-layer-btn").element.disabled).to.be.equals(false);

        btn.trigger("click");
        LayerSelection.actions.updateLayerTree = sinon.spy();
        wrapper.vm.$nextTick();


        expect(LayerSelection.actions.updateLayerTree.calledOnce).to.be.true;
    });
    describe("methods", () => {
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

        it("test method categorySelected", () => {
            wrapper = shallowMount(LayerSelectionComponent, {
                global: {
                    plugins: [store]
                }});

            wrapper.vm.categorySelected(categories[1].key);

            expect(changeCategorySpy.calledOnce).to.be.true;
            expect(changeCategorySpy.firstCall.args[1]).to.deep.equals(categories[1]);
        });

        it("test method filterBaseLayer 3D", () => {
            mapMode = "3D";
            layersBG.push(layerBG_3);
            wrapper = shallowMount(LayerSelectionComponent, {
                global: {
                    plugins: [store]
                }});

            const filtered = wrapper.vm.filterBaseLayer();

            expect(filtered.length).to.be.equals(2);
            expect(filtered[0]).to.deep.equals(layerBG_1);
            expect(filtered[1]).to.deep.equals(layerBG_2);
        });

        it("test method filterBaseLayer 2D", () => {
            mapMode = "2D";
            layersBG.push(layerBG_3);
            wrapper = shallowMount(LayerSelectionComponent, {
                global: {
                    plugins: [store]
                }});

            const filtered = wrapper.vm.filterBaseLayer();

            expect(filtered.length).to.be.equals(3);
            expect(filtered[0]).to.deep.equals(layerBG_1);
            expect(filtered[1]).to.deep.equals(layerBG_2);
            expect(filtered[2]).to.deep.equals(layerBG_3);
        });
    });

    describe("watcher", () => {
        it("invisibleBaselayerConfigs changed", () => {
            const newValue = [{
                id: "WMTS",
                name: "EOC Basemap",
                visibility: false,
                baselayer: true,
                showInLayerTree: false
            }];

            wrapper = shallowMount(LayerSelectionComponent, {
                global: {
                    plugins: [store]
                }});

            wrapper.vm.$options.watch.invisibleBaselayerConfigs.handler.call(wrapper.vm, newValue);
            expect(store.state.Modules.LayerSelection.baselayerConfs).to.be.an("Array");
            expect(store.state.Modules.LayerSelection.baselayerConfs.length).to.be.equals(1);
            expect(store.state.Modules.LayerSelection.baselayerConfs).to.be.deep.equals(newValue);
        });
    });
});

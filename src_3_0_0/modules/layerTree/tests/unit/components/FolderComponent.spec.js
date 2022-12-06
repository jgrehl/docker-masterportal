import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import uniqueIdModule from "../../../../../shared/js/utils/uniqueId.js";
import FolderComponent from "../../../components/FolderComponent.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/FolderComponent.vue", () => {
    let store,
        wrapper,
        layer_1,
        layer_2,
        layer_3,
        folder,
        toggleFolderSpy,
        visibilityInLayerTreeChangedSpy,
        propsData;

    beforeEach(() => {
        layer_1 = {
            id: "1",
            name: "layer_1",
            typ: "WMS",
            visibility: false
        };
        layer_2 = {
            id: "2",
            name: "layer_2",
            typ: "WMS",
            visibility: false
        };
        layer_3 = {
            id: "3",
            name: "layer_3",
            typ: "WFS",
            visibility: false
        };
        folder = {
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
        propsData = {
            conf: folder,
            isOpen: false
        };
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        FolderComponent
                    }
                }
            },
            mutations: {
                replaceByIdInLayerConfig: sinon.stub()
            }
        });
        sinon.stub(uniqueIdModule, "uniqueId").callsFake(function (string) {
            return string + "X";
        });
        toggleFolderSpy = sinon.spy(FolderComponent.methods, "toggleFolder");
        visibilityInLayerTreeChangedSpy = sinon.spy(FolderComponent.methods, "visibilityInLayerTreeChanged");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders a folder with 1 layers without checkbox", () => {
        propsData.conf = {
            Titel: "Titel",
            Ordner: [
                {
                    Layer: [layer_1]
                }
            ]
        };
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.find("input").exists()).to.be.false;
        expect(wrapper.find("label").exists()).to.be.true;
        expect(wrapper.find("label").classes()).to.include("d-none");
    });
    it("renders a folder with 2 layers", () => {
        propsData.conf = {
            Titel: "Titel",
            Ordner: [
                {
                    Layer: [layer_1, layer_2]
                }
            ]
        };
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.find("input").exists()).to.be.true;
        expect(wrapper.find("label").exists()).to.be.true;
    });
    it("renders a folder with layers and folders - not bold with checkbox", () => {
        let inputs = null;

        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });
        inputs = wrapper.findAll("input");

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.find(".folder > div").text()).to.be.equals("Titel Ebene 1");
        expect(wrapper.find(".folder > div").classes()).not.to.include("bold");
        expect(inputs.length).to.be.equals(1);
        expect(inputs.at(0).attributes().id).to.be.equals("layertree-folder-checkbox-TitelEbene1X");
        expect(wrapper.find("label").text()).to.be.equals("common:tree.selectAll");

    });
    it("renders a folder with a visible layer and folders - bold", () => {
        let inputs = null;

        layer_3.visibility = true;
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });
        inputs = wrapper.findAll("input");

        expect(wrapper.find(".folder").exists()).to.be.true;
        // console.log(wrapper.html());
        expect(wrapper.find(".folder > div").text()).to.be.equals("Titel Ebene 1");
        expect(wrapper.find(".folder > div").classes()).to.include("bold");
        expect(inputs.length).to.be.equals(1);
        expect(inputs.at(0).attributes().id).to.be.equals("layertree-folder-checkbox-TitelEbene1X");
        expect(wrapper.find("label").text()).to.be.equals("common:tree.selectAll");

    });
    it("click on folder emits 'isOpen'", async () => {
        let aFolder = null;

        layer_3.visibility = true;
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });
        aFolder = wrapper.find(".folder > div");

        expect(wrapper.find("i").classes()).to.include("bi-folder2");
        expect(wrapper.find("i").classes()).not.to.include("bi-folder2-open");

        aFolder.trigger("click");
        await wrapper.vm.$nextTick();

        expect(toggleFolderSpy.calledOnce).to.be.true;
        expect(wrapper.emitted().isOpen.length).to.be.equals(1);

    });
    it("click on checkbox calls visibilityInLayerTreeChanged", async () => {
        let input = null;

        layer_3.visibility = true;
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });
        input = wrapper.find("input");

        expect(wrapper.find("i").classes()).to.include("bi-folder2");
        expect(wrapper.find("i").classes()).not.to.include("bi-folder2-open");

        input.trigger("click");
        await wrapper.vm.$nextTick();

        expect(visibilityInLayerTreeChangedSpy.calledOnce).to.be.true;
    });
    it("computed properties - no layer visible", () => {
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.vm.allLayersVisible).to.be.false;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.false;
        expect(wrapper.vm.folderId).to.be.equals("TitelEbene1X");
    });
    it("computed properties - one layer visible", () => {
        layer_3.visibility = true;
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.vm.allLayersVisible).to.be.false;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.true;
        expect(wrapper.vm.folderId).to.be.equals("TitelEbene1X");
    });
    it("computed properties - all layers visible", () => {
        layer_1.visibility = true;
        layer_2.visibility = true;
        layer_3.visibility = true;
        wrapper = shallowMount(FolderComponent, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".folder").exists()).to.be.true;
        expect(wrapper.vm.allLayersVisible).to.be.true;
        expect(wrapper.vm.isLayerInFolderVisible).to.be.true;
        expect(wrapper.vm.folderId).to.be.equals("TitelEbene1X");
    });
});

import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerSelectionTreeNode from "../../../components/LayerSelectionTreeNode.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/layerSelection/components/LayerSelectionTreeNode.vue", () => {
    let store,
        wrapper,
        layer,
        propsData,
        clickSpy;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            type: "layer",
            visibility: false,
            showInLayerTree: true
        };
        propsData = {
            conf: layer
        };
        store = createStore({
        });
        clickSpy = sinon.spy(LayerSelectionTreeNode.methods, "folderClicked");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders a layer", () => {
        wrapper = shallowMount(LayerSelectionTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("layer-stub").length).to.be.equals(1);
    });
    it("renders a folder", () => {
        propsData = {
            conf: {
                name: "Titel Ebene 1",
                description: "description",
                type: "folder",
                elements: []
            }
        };
        wrapper = shallowMount(LayerSelectionTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);
        expect(wrapper.findAll("span").length).to.be.equals(2);
        expect(wrapper.findAll("span")[0].text()).to.be.equals("Titel Ebene 1");
        expect(wrapper.findAll("span")[1].text()).to.be.equals("description");
        expect(wrapper.findAll("layer-stub").length).to.be.equals(0);
    });
    it("click on a folder shall call method", async () => {
        let btn = null;

        propsData = {
            conf: {
                name: "Titel Ebene 1",
                description: "description",
                type: "folder",
                elements: []
            }
        };
        wrapper = shallowMount(LayerSelectionTreeNode, {
            global: {
                plugins: [store]
            },
            propsData
        });

        expect(wrapper.find(".no-list").exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);
        btn = wrapper.find("button");

        btn.trigger("click");
        await wrapper.vm.$nextTick();
        expect(clickSpy.calledOnce).to.be.true;
    });


});

import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerComponentSubMenu from "../../../components/LayerComponentSubMenu.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerComponentSubMenu.vue", () => {
    let layer,
        propsData,
        wrapper;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            transparency: 50,
            datasets: [
                {
                    md_id: "123456789"
                }
            ]
        };

        propsData = {
            layerConf: layer
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the sub menu given as property to the component", () => {
        wrapper = shallowMount(LayerComponentSubMenu, {
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-sub-menu-" + propsData.layerConf.id).exists()).to.be.true;
    });

    it("renders the remove-layer", () => {
        wrapper = shallowMount(LayerComponentSubMenu, {
            propsData: propsData
        });

        expect(wrapper.find(".remove-layer-container").exists()).to.be.true;
    });

    it("renders the transparency", () => {
        wrapper = shallowMount(LayerComponentSubMenu, {
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-sub-menu-transparency-container-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.find(".transparency-container > i").classes()).to.includes("bi-droplet-half");
        expect(wrapper.find(".transparency-container > label").exists()).to.be.true;
        expect(wrapper.find(".transparency-container > input").exists()).to.be.true;
        expect(wrapper.find(".transparency-container > span").exists()).to.be.true;
        expect(wrapper.find(".transparency-container > span").text()).to.equals("50%");
    });
});

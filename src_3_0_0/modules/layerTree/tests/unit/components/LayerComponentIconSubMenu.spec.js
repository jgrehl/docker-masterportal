import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerComponentIconSubMenu from "../../../components/LayerComponentIconSubMenu.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerComponentIconSubMenu.vue", () => {
    let layer,
        propsData,
        store,
        wrapper;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
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

    it("renders the sub menu icon given as property to the component", () => {
        wrapper = shallowMount(LayerComponentIconSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-sub-menu-" + propsData.layerConf.id).exists()).to.be.true;
    });

    it("render button of sub menu icon", async () => {
        wrapper = shallowMount(LayerComponentIconSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-sub-menu-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.find("#layer-component-icon-sub-menu-button-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.findAll("button").length).to.be.equals(1);
    });
});

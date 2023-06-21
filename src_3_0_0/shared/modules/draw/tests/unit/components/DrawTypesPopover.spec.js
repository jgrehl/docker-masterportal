import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";

import DrawTypesPopoverComponent from "../../../components/DrawTypesPopover.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/modules/draw/components/DrawTypesPopover.vue", () => {
    let wrapper;

    it("renders the drawTypesPopover", () => {
        wrapper = shallowMount(DrawTypesPopoverComponent, {
            propsData: {
                elements: ["pen", "geometries", "symbols"]
            }
        });

        expect(wrapper.find("#draw-types-pen").exists()).to.be.true;
        expect(wrapper.find("#draw-types-pen").attributes().classarray).to.equals("btn-primary,mx-1");
        expect(wrapper.find("#draw-types-pen").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.pen");

        expect(wrapper.find("#draw-types-geometries").exists()).to.be.true;
        expect(wrapper.find("#draw-types-geometries").attributes().classarray).to.equals("btn-primary,mx-1");
        expect(wrapper.find("#draw-types-geometries").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.geometries");

        expect(wrapper.find("#draw-types-symbols").exists()).to.be.true;
        expect(wrapper.find("#draw-types-symbols").attributes().classarray).to.equals("btn-primary,mx-1");
        expect(wrapper.find("#draw-types-symbols").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.symbols");
    });
});

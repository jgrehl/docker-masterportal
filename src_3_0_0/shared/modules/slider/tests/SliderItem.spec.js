import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import SliderItem from "../components/SliderItem.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/components/IconButton.vue", () => {

    it.only("should render a slider and trigger the given interaction on change", () => {
        const wrapper = mount(SliderItem, {
                propsData: {
                    aria: "Aria-Label hier einfügen"
                }
            }),
            input = wrapper.find("input");

        expect(input.exists()).to.be.true;
        expect(input.attributes("aria-label")).to.equal("Aria-Label hier einfügen");
        expect(input.attributes("type")).to.equal("range");
        expect(input.attributes("class")).to.equal("slider my-2");
    });
});

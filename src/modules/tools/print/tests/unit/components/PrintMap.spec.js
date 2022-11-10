import Vuex from "vuex";
import {config, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/Print/components/PrintMap.vue", () => {
    let wrapper;

    describe("template", () => {
        it("should emitted close event if button is clicked", async () => {
            const button = wrapper.find(".bi-x-lg");

            expect(button).to.exist;

            button.trigger("click");
            expect(wrapper.emitted()).to.have.property("close");
            expect(wrapper.emitted().close).to.have.lengthOf(1);
        });
    });
});

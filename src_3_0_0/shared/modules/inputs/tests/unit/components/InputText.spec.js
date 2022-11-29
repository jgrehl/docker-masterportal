import sinon from "sinon";
import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import InputText from "../../../components/InputText.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/shared/components/InputText.vue", () => {

    afterEach(sinon.restore);

    it("should render an input field", () => {
        const id = "input-awesome",
            label = "My super nice Input",
            placeholder = "world's best placeholder",
            wrapper = mount(InputText, {
                localVue,
                propsData: {id, label, placeholder}
            }),
            input = wrapper.find("input");

        expect(input.exists()).to.be.true;
        expect(input.classes()).to.eql(["form-control"]);
        expect(input.attributes("placeholder")).to.equal(placeholder);
    });

    it("should render an input field with a type", () => {
        const id = "input-awesome",
            label = "My super nice Input",
            placeholder = "world's best placeholder",
            type = "mail",
            wrapper = mount(InputText, {
                localVue,
                propsData: {id, label, placeholder, type}
            }),
            input = wrapper.find("input");

        expect(input.exists()).to.be.true;
        expect(input.classes()).to.eql(["form-control"]);
        expect(input.attributes("placeholder")).to.equal(placeholder);
        expect(input.attributes("type")).to.equal(type);
    });
});

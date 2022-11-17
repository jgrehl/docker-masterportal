import sinon from "sinon";
import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
<<<<<<<< HEAD:src_3_0_0/shared/modules/buttons/tests/unit/components/SimpleButton.spec.js
import SimpleButton from "../../../components/SimpleButton.vue";
========
import LightButton from "../LightButton.vue";
>>>>>>>> 208a3029e8 (BG-3491 added all the buttons and tests):src_3_0_0/shared/modules/buttons/tests/unit/components/LightButton.spec.js

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/shared/components/LightButton.vue", () => {
    let interactionSpy;

    beforeEach(() => {
        interactionSpy = sinon.spy();
    });

    afterEach(sinon.restore);

    it("should render a button with an icon and trigger the given interaction on click", () => {
        const iconString = "bi-list",
            text = "My List",
            wrapper = mount(LightButton, {
                localVue,
                propsData: {text, interaction: interactionSpy, icon: iconString}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-light", "d-flex", "align-items-center"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.text()).to.equal(text);
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql([iconString]);
        expect(icon.attributes("role")).to.equal("img");

        button.trigger("click");

        expect(interactionSpy.calledOnce).to.be.true;
    });
    it("should render a button without an icon if not configured and trigger the given interaction on click", () => {
        const text = "My List",
            wrapper = mount(LightButton, {
                localVue,
                propsData: {text, interaction: interactionSpy}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-light", "d-flex", "align-items-center"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.text()).to.equal(text);
        expect(icon.exists()).to.be.false;

        button.trigger("click");

        expect(interactionSpy.calledOnce).to.be.true;
    });

    it("should render a button with description", () => {
        const text = "My List",
            iconString = "bi-list",
            descriptionString = "Hier könnte Ihre Werbung stehen",
            wrapper = mount(LightButton, {
                localVue,
                propsData: {text, interaction: interactionSpy, icon: iconString, description: descriptionString}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-light", "btn-description", "d-flex", "align-items-center", "row", "py-3"]);
        expect(button.attributes("type")).to.equal("button");
        expect(icon.exists()).to.be.true;
    });
});

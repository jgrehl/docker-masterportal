import sinon from "sinon";
import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
<<<<<<<< HEAD:src_3_0_0/shared/modules/buttons/tests/unit/components/SimpleButton.spec.js
import SimpleButton from "../../../components/SimpleButton.vue";
========
import SimpleButton from "../../SimpleButton.vue";
>>>>>>>> 85d2ed643a (update move gfi to src_3_0_0/modules/getFeatureInfo):src_3_0_0/shared/modules/buttons/tests/unit/components/unit/SimpleButton.spec.js

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/shared/components/SimpleButton.vue", () => {
    let interactionSpy;

    beforeEach(() => {
        interactionSpy = sinon.spy();
    });

    afterEach(sinon.restore);

    it("should render a button with an icon and trigger the given interaction on click", () => {
        const iconString = "bi-list",
            text = "My List",
            wrapper = mount(SimpleButton, {
                localVue,
                propsData: {text, interaction: interactionSpy, icon: iconString}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.contain(["btn", "btn-light", "d-flex", "align-items-center"]);
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
            wrapper = mount(SimpleButton, {
                localVue,
                propsData: {text, interaction: interactionSpy}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.contain(["btn", "btn-light", "d-flex", "align-items-center"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.text()).to.equal(text);
        expect(icon.exists()).to.be.false;

        button.trigger("click");

        expect(interactionSpy.calledOnce).to.be.true;
    });
});

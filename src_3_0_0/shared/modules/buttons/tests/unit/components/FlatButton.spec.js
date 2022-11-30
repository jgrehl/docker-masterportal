import sinon from "sinon";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import FlatButton from "../../../components/FlatButton.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/components/FlatButton.vue", () => {
    let interactionSpy;

    beforeEach(() => {
        interactionSpy = sinon.spy();
    });

    afterEach(sinon.restore);

    it("should render a button with an icon and trigger the given interaction on click", () => {
        const iconString = "bi-list",
            text = "My super nice Button",
            wrapper = mount(FlatButton, {
                props: {text, interaction: interactionSpy, icon: iconString}
            }),
            button = wrapper.find("button"),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-secondary", "d-flex", "align-items-center", "mb-3"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.text()).to.equal(text);
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql([iconString]);
        expect(icon.attributes("role")).to.equal("img");

        button.trigger("click");

        expect(interactionSpy.calledOnce).to.be.true;
    });
});

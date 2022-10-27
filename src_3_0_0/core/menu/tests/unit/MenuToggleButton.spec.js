import sinon from "sinon";
import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import MenuToggleButton from "../../MenuToggleButton.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/core/menu/MenuToggleButton.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        mainToggleButtonIcon: () => "bi-list",
                        secondaryToggleButtonIcon: () => "bi-tools"
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("should render the button including 'mainToggleButtonIcon' as the icon class for side 'main'", () => {
        const side = "main",
            wrapper = mount(MenuToggleButton, {
                localVue,
                store,
                propsData: {side}
            }),
            button = wrapper.find(`#${side}-menu-toggle-button`),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-primary", "bootstrap-icon", "menu-toggle-button"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.attributes("data-bs-toggle")).to.equal("offcanvas");
        expect(button.attributes("data-bs-target")).to.equal(`#menu-offcanvas-${side}Menu`);
        expect(button.attributes("aria-label")).to.equal("common:menu.ariaLabelOpen");
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql(["bi-list"]);
    });
    it("should render the button including 'secondaryToggleButtonIcon' as the icon class for side 'secondary'", () => {
        const side = "secondary",
            wrapper = mount(MenuToggleButton, {
                localVue,
                store,
                propsData: {side}
            }),
            button = wrapper.find(`#${side}-menu-toggle-button`),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-primary", "bootstrap-icon", "menu-toggle-button"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.attributes("data-bs-toggle")).to.equal("offcanvas");
        expect(button.attributes("data-bs-target")).to.equal(`#menu-offcanvas-${side}Menu`);
        expect(button.attributes("aria-label")).to.equal("common:menu.ariaLabelOpen");
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql(["bi-tools"]);
    });
});

import {createStore} from "vuex";
import sinon from "sinon";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import MenuToggleButton from "../../../components/MenuToggleButton.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuToggleButton.vue", () => {
    let store;

    beforeEach(() => {
        store = createStore({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        mainExpanded: sinon.stub(),
                        secondaryExpanded: sinon.stub(),
                        mainToggleButtonIcon: () => "bi-list",
                        secondaryToggleButtonIcon: () => "bi-tools"
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("should render the button including 'mainToggleButtonIcon' as the icon class for side 'main'", () => {
        const side = "mainMenu",
            wrapper = mount(MenuToggleButton, {
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            button = wrapper.find(`#${side}-toggle-button`),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-primary", "bootstrap-icon", "menu-toggle-button", "toggle-button-mainMenu"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.attributes("aria-label")).to.equal("common:menu.ariaLabelOpen");
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql(["bi-list"]);
    });
    it("should render the button including 'secondaryToggleButtonIcon' as the icon class for side 'secondaryMenu'", () => {
        const side = "secondaryMenu",
            wrapper = mount(MenuToggleButton, {
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            button = wrapper.find(`#${side}-toggle-button`),
            icon = button.find("i");

        expect(button.exists()).to.be.true;
        expect(button.classes()).to.eql(["btn", "btn-primary", "bootstrap-icon", "menu-toggle-button", "toggle-button-secondaryMenu"]);
        expect(button.attributes("type")).to.equal("button");
        expect(button.attributes("aria-label")).to.equal("common:menu.ariaLabelOpen");
        expect(icon.exists()).to.be.true;
        expect(icon.classes()).to.eql(["bi-tools"]);
    });
});

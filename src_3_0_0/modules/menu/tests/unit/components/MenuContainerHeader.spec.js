import sinon from "sinon";
import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import MenuContainerHeader from "../../../components/MenuContainerHeader.vue";
import MenuContainerHeaderTitle from "../../../components/MenuContainerHeaderTitle.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerHeader.vue", () => {
    const idPrefix = "menu-offcanvas",
        functions = {
            divId: side => `#${idPrefix}-header-${side}`,
            buttonId: side => `#${idPrefix}-header-close-button-${side}`,
            nameMock: side => ({idAppendix: side, text: "TestText"})
        };
    let consoleErrorSpy,
        getElementByIdFake,
        mainTitle,
        removeSpy,
        secondaryTitle,
        store;

    beforeEach(() => {
        consoleErrorSpy = sinon.spy();
        sinon.stub(console, "error").callsFake(consoleErrorSpy);
        removeSpy = sinon.spy();
        getElementByIdFake = sinon.fake.returns({
            classList: {remove: removeSpy}
        });
        sinon.stub(document, "getElementById").callsFake(getElementByIdFake);
        mainTitle = null;
        secondaryTitle = null;
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        mainTitle: () => mainTitle,
                        secondaryTitle: () => secondaryTitle,
                        titleBySide: () => side => {
                            if (side === "mainMenu" && mainTitle) {
                                return functions.nameMock(side);
                            }
                            if (side === "secondaryMenu" && secondaryTitle) {
                                return functions.nameMock(side);
                            }
                            return null;
                        }
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("should render the component including the name component if titleBySide returns an object for 'mainMenu'", () => {
        mainTitle = "defined";

        const side = "mainMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side)),
            dismissButton = container.find(functions.buttonId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["offcanvas-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(dismissButton.exists()).to.be.true;
        expect(dismissButton.attributes("type")).to.equal("button");
        expect(dismissButton.classes()).to.eql(["btn-close", "text-reset"]);
        expect(dismissButton.attributes("data-bs-dismiss")).to.equal("offcanvas");
        expect(dismissButton.attributes("aria-label")).to.equal("common:menu.ariaLabelClose");
        expect(consoleErrorSpy.notCalled).to.be.true;

        dismissButton.trigger("click");

        expect(getElementByIdFake.calledOnce).to.be.true;
        expect(getElementByIdFake.firstCall.args.length).to.equal(1);
        expect(getElementByIdFake.firstCall.args[0]).to.equal(`${idPrefix}-${side}`);
        expect(removeSpy.calledOnce).to.be.true;
        expect(removeSpy.firstCall.args.length).to.equal(1);
        expect(removeSpy.firstCall.args[0]).to.equal("show");
    });
    it("should render the component including the name component if titleBySide returns an object for 'secondaryMenu'", () => {
        secondaryTitle = "defined";

        const side = "secondaryMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side)),
            dismissButton = container.find(functions.buttonId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["offcanvas-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(dismissButton.exists()).to.be.true;
        expect(dismissButton.attributes("type")).to.equal("button");
        expect(dismissButton.classes()).to.eql(["btn-close", "text-reset"]);
        expect(dismissButton.attributes("data-bs-dismiss")).to.equal("offcanvas");
        expect(dismissButton.attributes("aria-label")).to.equal("common:menu.ariaLabelClose");
        expect(consoleErrorSpy.notCalled).to.be.true;

        dismissButton.trigger("click");

        expect(getElementByIdFake.calledOnce).to.be.true;
        expect(getElementByIdFake.firstCall.args.length).to.equal(1);
        expect(getElementByIdFake.firstCall.args[0]).to.equal(`${idPrefix}-${side}`);
        expect(removeSpy.calledOnce).to.be.true;
        expect(removeSpy.firstCall.args.length).to.equal(1);
        expect(removeSpy.firstCall.args[0]).to.equal("show");
    });
    it("should render the component without the name component if titleBySide returns null", () => {
        const side = "mainMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side)),
            dismissButton = container.find(functions.buttonId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["offcanvas-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(dismissButton.exists()).to.be.true;
        expect(dismissButton.attributes("type")).to.equal("button");
        expect(dismissButton.classes()).to.eql(["btn-close", "text-reset"]);
        expect(dismissButton.attributes("data-bs-dismiss")).to.equal("offcanvas");
        expect(dismissButton.attributes("aria-label")).to.equal("common:menu.ariaLabelClose");
        expect(consoleErrorSpy.notCalled).to.be.true;

        dismissButton.trigger("click");

        expect(getElementByIdFake.calledOnce).to.be.true;
        expect(getElementByIdFake.firstCall.args.length).to.equal(1);
        expect(getElementByIdFake.firstCall.args[0]).to.equal(`${idPrefix}-${side}`);
        expect(removeSpy.calledOnce).to.be.true;
        expect(removeSpy.firstCall.args.length).to.equal(1);
        expect(removeSpy.firstCall.args[0]).to.equal("show");
    });
    it("should render the component without the name and log an error if a wrong value for the prop side is given", () => {
        mainTitle = "defined";

        const side = "newMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side)),
            dismissButton = container.find(functions.buttonId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["offcanvas-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(dismissButton.exists()).to.be.true;
        expect(dismissButton.attributes("type")).to.equal("button");
        expect(dismissButton.classes()).to.eql(["btn-close", "text-reset"]);
        expect(dismissButton.attributes("data-bs-dismiss")).to.equal("offcanvas");
        expect(dismissButton.attributes("aria-label")).to.equal("common:menu.ariaLabelClose");
        expect(consoleErrorSpy.calledOnce).to.be.true;
        expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
        expect(consoleErrorSpy.firstCall.args[0].replace(/[\n\r]+/g, " ")).to.equal("[Vue warn]: Invalid prop: custom validator check failed for prop \"side\". found in ---> <MenuContainerHeader> at src_3_0_0/modules/menu/components/MenuContainerHeader.vue        <Root>");

        dismissButton.trigger("click");

        expect(getElementByIdFake.calledOnce).to.be.true;
        expect(getElementByIdFake.firstCall.args.length).to.equal(1);
        expect(getElementByIdFake.firstCall.args[0]).to.equal(`${idPrefix}-${side}`);
        expect(removeSpy.calledOnce).to.be.true;
        expect(removeSpy.firstCall.args.length).to.equal(1);
        expect(removeSpy.firstCall.args[0]).to.equal("show");
    });
});

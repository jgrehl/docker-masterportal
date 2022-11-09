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
    const idPrefix = "mp",
        functions = {
            divId: side => `#${idPrefix}-header-${side}`,
            nameMock: side => ({idAppendix: side, text: "TestText"})
        };
    let consoleErrorSpy,
        mainTitle,
        removeSpy,
        secondaryTitle,
        store;

    beforeEach(() => {
        consoleErrorSpy = sinon.spy();
        sinon.stub(console, "error").callsFake(consoleErrorSpy);
        removeSpy = sinon.spy();

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
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(consoleErrorSpy.notCalled).to.be.true;

    });
    it("should render the component including the name component if titleBySide returns an object for 'secondaryMenu'", () => {
        secondaryTitle = "defined";

        const side = "secondaryMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));


        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(consoleErrorSpy.notCalled).to.be.true;

    });
    it("should render the component without the name component if titleBySide returns null", () => {
        const side = "mainMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(consoleErrorSpy.notCalled).to.be.true;

    });
    it("should render the component without the name and log an error if a wrong value for the prop side is given", () => {
        mainTitle = "defined";

        const side = "newMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                localVue,
                store,
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(consoleErrorSpy.calledOnce).to.be.true;
        expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
        expect(consoleErrorSpy.firstCall.args[0].replace(/[\n\r]+/g, " ")).to.equal("[Vue warn]: Invalid prop: custom validator check failed for prop \"side\". found in ---> <MenuContainerHeader> at src_3_0_0/modules/menu/components/MenuContainerHeader.vue        <Root>");
    });
});

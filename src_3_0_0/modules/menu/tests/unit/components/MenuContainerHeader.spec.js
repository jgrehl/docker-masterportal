import {createStore} from "vuex";
import sinon from "sinon";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import MenuContainerHeader from "../../../components/MenuContainerHeader.vue";
import MenuContainerHeaderTitle from "../../../components/MenuContainerHeaderTitle.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerHeader.vue", () => {
    const idPrefix = "mp",
        functions = {
            divId: side => `#${idPrefix}-header-${side}`,
            nameMock: side => ({idAppendix: side, text: "TestText"})
        };
    let consoleWarnSpy,
        mainTitle,
        secondaryTitle,
        store;

    beforeEach(() => {
        consoleWarnSpy = sinon.spy();
        sinon.stub(console, "warn").callsFake(consoleWarnSpy);

        mainTitle = null;
        secondaryTitle = null;
        store = createStore({
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
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(consoleWarnSpy.notCalled).to.be.true;

    });
    it("should render the component including the name component if titleBySide returns an object for 'secondaryMenu'", () => {
        secondaryTitle = "defined";

        const side = "secondaryMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));


        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.true;
        expect(consoleWarnSpy.notCalled).to.be.true;

    });
    it("should render the component without the name component if titleBySide returns null", () => {
        const side = "mainMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(consoleWarnSpy.notCalled).to.be.true;

    });
    it("should render the component without the name and log an error if a wrong value for the prop side is given", () => {
        mainTitle = "defined";

        const side = "newMenu",
            wrapper = shallowMount(MenuContainerHeader, {
                global: {
                    plugins: [store]
                },
                propsData: {side}
            }),
            container = wrapper.find(functions.divId(side));

        expect(container.exists()).to.be.true;
        expect(container.classes()).to.eql(["mp-menu-header"]);
        expect(container.findComponent(MenuContainerHeaderTitle).exists()).to.be.false;
        expect(consoleWarnSpy.calledOnce).to.be.true;
        expect(consoleWarnSpy.firstCall.args.length).to.equal(8);
        expect(consoleWarnSpy.firstCall.args[0].replace(/[\n\r]+/g, " ")).to.equal("[Vue warn]: Invalid prop: custom validator check failed for prop \"side\".");
    });
});

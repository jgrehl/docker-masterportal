import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import visibilityChecker from "../../../../../shared/js/utils/visibilityChecker";
import MenuContainerBodyRootItemElement from "../../../components/MenuContainerBodyRootItemElement.vue";
import LightButton from "../../../../../shared/modules/buttons/components/LightButton.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerBodyRootItemElement.vue", () => {
    const
        mockConfigJson = {
            Portalconfig: {
                tree: {
                    type: "light"
                }
            }
        };
    let store,
    clickedMenuElementSpy,
    menu;

    beforeEach(() => {
        properties = {
            supportedMapModes: ["2D"],
            supportedDevices: ["Desktop", "Mobile"],
            supportedTreeTypes: ["light"]
        }
        menu = {
                currentComponent: "componentType"
        };
        clickedMenuElementSpy = sinon.spy();
        sinon.stub(visibilityChecker, "isModuleVisible").returns(true);
        store = createStore({
            namespaced: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        mainMenu: () => menu,
                        secondaryMenu: () => menu
                    },
                    actions:{
                        clickedMenuElement: clickedMenuElementSpy
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            },
            getters: {
                deviceMode: () => "Desktop",
                portalConfig: () => mockConfigJson.Portalconfig
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the component and it contains the LightButton", () => {
        const wrapper = shallowMount(MenuContainerBodyRootItemElement, {
            global: {
                plugins: [store]
            },
            propsData: {icon: "bi-file-plus", name: "awesomeName", properties: {}}
        });

        expect(wrapper.findComponent(LightButton).exists()).to.be.true;
    });

    it("calls clickedMenuElement in created if type is equals currentComponent", () => {
        const name = "awesomeName",
        type = "componentType",
        path = ["mainMenu", type],
        wrapper = shallowMount(MenuContainerBodyRootItemElement, {
            global: {
                plugins: [store]
            },
            propsData: {
                icon: "bi-file-plus", 
                name: name, 
                path: path,
                properties: {
                    type:type
                }}
        });

        expect(wrapper.findComponent(LightButton).exists()).to.be.true;
        expect(clickedMenuElementSpy.calledOnce).to.be.true;
        expect(clickedMenuElementSpy.firstCall.args[1]).to.be.deep.equals({
            name: name,
            path: path,
            side: path[0],
            type: type
        });  
    }); 
    
    it("calls not clickedMenuElement in created if type is not equals currentComponent", () => {
        const name = "awesomeName",
        type = "otherType",
        path = ["mainMenu", type],
        wrapper = shallowMount(MenuContainerBodyRootItemElement, {
            global: {
                plugins: [store]
            },
            propsData: {
                icon: "bi-file-plus", 
                name: name, 
                path: path,
                properties: {
                    type:type
                }}
        });

        expect(wrapper.findComponent(LightButton).exists()).to.be.true;
        expect(clickedMenuElementSpy.notCalled).to.be.true;
    });
});

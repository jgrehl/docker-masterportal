import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import LayerTreeComponent from "../../../components/LayerTree.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe.only("src_3_0_0/modules/layerTree/components/LayerTree.vue", () => {
    const //scales = ["1000", "5000", "10000"],
        // mockMapGetters = {
        //     scale: sinon.stub()
        // },
        // mockMapMutations = {
        //     setScale: sinon.stub()
        // },
        mockConfigJson = {
            Portalconfig: {
                navigationSecondary: {
                    sections: [
                        {
                            type: "layerTree"
                        }
                    ]
                }
            }
        };
    let store,
        wrapper,
        layers,
        layer2D_1,
        layer2D_2;

    beforeEach(() => {
        layer2D_1 = {
            id:"1",
            visibility: false
        };
        layer2D_2 = {
            id:"2",
            visibility: false
        };
        layers = [
            layer2D_1,
            layer2D_2
        ]
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerTree: {
                            namespaced: true
                        }
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
                layerConfigsByMode: () => (mode) => {
                    if(mode === "2D"){
                        return layers;
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        sinon.restore();
    });

    it("renders the LayerTree", () => {
        wrapper = shallowMount(LayerTreeComponent, {store, localVue});

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
    });

    // it("do not render the scaleSwitchers select if not active", () => {
    //     active = false;
    //     wrapper = shallowMount(ScaleSwitcherComponent, {store, localVue});

    //     expect(wrapper.find("#scale-switcher").exists()).to.be.false;
    // });

    // it("has initially set all scales to select", () => {
    //     active = true;
    //     wrapper = shallowMount(ScaleSwitcherComponent, {store, localVue});
    //     const options = wrapper.findAll("option");

    //     expect(options.length).to.equal(scales.length);
    //     scales.forEach((scale, index) => {
    //         expect(scale).to.equal(options.at(index).attributes().value);
    //     });
    // });

    // it("has initially selected scale", async () => {
    //     active = true;
    //     wrapper = shallowMount(ScaleSwitcherComponent, {store, localVue});
    //     const select = wrapper.find("select");

    //     expect(select.element.value).to.equals("1000");
    // });

    // it("renders the correct value when select is changed", async () => {
    //     active = true;
    //     wrapper = shallowMount(ScaleSwitcherComponent, {store, localVue});
    //     const select = wrapper.find("select"),
    //         options = wrapper.findAll("option");

    //     select.setValue(options.at(1).element.value);
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.find("select").element.value).to.equals("5000");
    //     select.setValue(options.at(2).element.value);
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.find("select").element.value).to.equals("10000");
    // });

    // it("sets focus to first input control", async () => {
    //     const elem = document.createElement("div");

    //     active = true;

    //     if (document.body) {
    //         document.body.appendChild(elem);
    //     }
    //     wrapper = shallowMount(ScaleSwitcherComponent, {store, localVue, attachTo: elem});
    //     wrapper.vm.setFocusToFirstControl();
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.find("#scale-switcher-select").element).to.equal(document.activeElement);
    // });
});

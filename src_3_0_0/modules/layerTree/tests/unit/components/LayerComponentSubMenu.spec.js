import {createStore} from "vuex";
import {config, mount, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerComponentSubMenu from "../../../components/LayerComponentSubMenu.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerComponentSubMenu.vue", () => {
    let layer,
        propsData,
        removeLayerSpy,
        store,
        updateTransparencySpy,
        wrapper;

    beforeEach(() => {
        layer = {
            id: "1",
            name: "layer",
            typ: "WMS",
            transparency: 50,
            datasets: [
                {
                    md_id: "123456789"
                }
            ]
        };

        propsData = {
            layerConf: layer
        };

        removeLayerSpy = sinon.spy();
        updateTransparencySpy = sinon.spy();

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        LayerTree: {
                            namespaced: true,
                            actions: {
                                removeLayer: removeLayerSpy,
                                updateTransparency: updateTransparencySpy
                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the sub menu given as property to the component", () => {
        wrapper = shallowMount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-sub-menu-" + propsData.layerConf.id).exists()).to.be.true;
    });

    it("renders the remove-layer", () => {
        wrapper = shallowMount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find(".remove-layer-container").exists()).to.be.true;
    });

    it("should remove layer if remove layer button is clicked", async () => {
        wrapper = mount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        await wrapper.find(".remove-layer-container > button").trigger("click");

        expect(removeLayerSpy.calledOnce).to.be.true;
        expect(removeLayerSpy.firstCall.args[1]).to.deep.equals(layer);
    });

    it("renders the transparency", () => {
        wrapper = mount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        expect(wrapper.find("#layer-component-icon-sub-menu-transparency-container-" + propsData.layerConf.id).exists()).to.be.true;
        expect(wrapper.find(".transparency-container > i").classes()).to.includes("bi-droplet-half");
        expect(wrapper.find(".transparency-container > label").exists()).to.be.true;
        expect(wrapper.find(".transparency-container > input").exists()).to.be.true;
    });

    it("set value to input field", () => {
        let input = null;

        wrapper = mount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: propsData
        });

        input = wrapper.find(".transparency-container > input");
        input.setValue(50);

        expect(input.element.value).to.equals("50");
        expect(updateTransparencySpy.calledOnce).to.be.true;
        expect(updateTransparencySpy.firstCall.args[1]).to.deep.equals({
            layerConf: {
                id: "1",
                name: "layer",
                typ: "WMS",
                transparency: 50,
                datasets: [
                    {
                        md_id: "123456789"
                    }
                ]
            },
            transparency: 50
        });
    });

    it("render not the transparency-container, if layer type Terrain3D is not supported ", () => {
        const layer1 = {
            id: "2",
            name: "layer",
            typ: "Terrain3D",
            datasets: [
                {
                    md_id: "123456789"
                }
            ]
        };

        wrapper = shallowMount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: {
                layerConf: layer1
            }
        });


        expect(wrapper.find("#layer-component-icon-sub-menu-transparency-container-" + layer1.id).exists()).to.be.false;
    });

    it("render the transparency-container, if layer type Tileset3D is supported ", () => {
        const layer1 = {
            id: "2",
            name: "layer",
            typ: "Tileset3D",
            datasets: [
                {
                    md_id: "123456789"
                }
            ]
        };

        wrapper = shallowMount(LayerComponentSubMenu, {
            global: {
                plugins: [store]
            },
            propsData: {
                layerConf: layer1
            }
        });


        expect(wrapper.find("#layer-component-icon-sub-menu-transparency-container-" + layer1.id).exists()).to.be.true;
    });
});

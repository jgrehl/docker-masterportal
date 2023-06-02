import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import crs from "@masterportal/masterportalapi/src/crs";
import LayerPreviewComponent from "../../../components/LayerPreview.vue";
import LayerPreview from "../../../store/indexLayerPreview";
import wmts from "@masterportal/masterportalapi/src/layer/wmts";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerPreview/components/LayerPreview.vue", () => {
    let store,
        wrapper,
        warnSpy,
        layerWMTS,
        layerWMS,
        layerVectorTile,
        getWMTSCapabilitiesStub;

    const namedProjections = [
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
    ];

    before(() => {
        crs.registerProjections(namedProjections);
    });

    beforeEach(() => {
        warnSpy = sinon.spy();
        sinon.stub(console, "warn").callsFake(warnSpy);
        layerWMTS = {
            id: "WMTS",
            name: "layerWMTS",
            typ: "WMTS",
            type: "layer",
            capabilitiesUrl: "https://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities",
            layers: "eoc:basemap",
            optionsFromCapabilities: true
        };
        layerWMS = {
            id: "WMS",
            name: "layerWMS",
            typ: "WMS",
            layers: "layers",
            version: "1.0.0",
            transparent: false,
            singleTile: false,
            tilesize: 20,
            url: "url"
        };
        layerVectorTile = {
            id: "VectorTile",
            name: "layerVectorTile",
            typ: "VectorTile",
            type: "layer",
            preview: {
                src: "src"
            }
        };

        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            getView: () => {
                return {
                    getResolutions: () => [2000, 1000, 500, 100, 50, 10],
                    getProjection: () => {
                        return {
                            getCode: () => "EPSG:25832"
                        };
                    }
                };
            }
        };

        mapCollection.addMap(map, "2D");

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerPreview
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        initialCenter: () => [0, 0],
                        initialZoom: () => 3
                    }
                }
            },
            getters: {
                layerConfigById: () => (id) => {
                    if (id === "WMTS") {
                        return layerWMTS;
                    }
                    if (id === "WMS") {
                        return layerWMS;
                    }
                    if (id === "VectorTile") {
                        return layerVectorTile;
                    }
                    return null;
                },
                isMobile: () => false
            }
        });
        sinon.stub(LayerPreviewComponent.methods, "calculateExtent").returns([1, 2, 3, 4]);
        getWMTSCapabilitiesStub = sinon.stub(wmts, "getWMTSCapabilities").callsFake(() => new Promise(resolve => resolve({
            Contents: {
                Layer: []
            }
        })));
    });

    afterEach(() => {
        sinon.restore();
    });

    it("do not render the LayerPreview for not supported layer-typ", async () => {
        const props = {
            layerId: "WFS"
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".layerPreview").exists()).to.be.false;
        expect(warnSpy.calledOnce).to.be.true;
    });

    it("do render the LayerPreview for supported layer-typ WMS", async () => {
        const props = {
            layerId: "WMS"
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".layerPreview").exists()).to.be.true;
        expect(wrapper.find("img").attributes().src.indexOf(layerWMS.url)).to.be.equals(0);
        expect(warnSpy.notCalled).to.be.true;
    });

    it("do render the LayerPreview for supported layer-typ VectorTile", async () => {
        const props = {
            layerId: "VectorTile"
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".layerPreview").exists()).to.be.true;
        expect(wrapper.find("img").attributes().src).to.be.equals(layerVectorTile.preview.src);
        expect(warnSpy.notCalled).to.be.true;
    });

    it("do render the LayerPreview for supported layer-typ WMTS", async () => {
        const props = {
            layerId: "WMTS"
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".layerPreview").exists()).to.be.true;
        expect(getWMTSCapabilitiesStub.calledOnce).to.be.true;
        expect(getWMTSCapabilitiesStub.firstCall.args[0]).to.be.equals(layerWMTS.capabilitiesUrl);
        expect(wrapper.find("img").attributes().src.indexOf(layerWMTS.capabilitiesUrl.split("?")[0])).to.be.equals(0);
        expect(warnSpy.notCalled).to.be.true;
    });

    it("should emit previewClicked after click on preview if prop checkable is true", async () => {
        const props = {
            layerId: "WMS",
            checkable: true
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();
        await wrapper.find(".checkable").trigger("click");

        expect(wrapper.emitted("previewClicked").length).to.equals(1);
    });

    it("should contain custom css-class, if prop customClass is given", async () => {
        const props = {
            layerId: "WMS",
            customClass: "customCSSClass"
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".customCSSClass").exists()).to.be.true;
    });

    it("should contain custom css-class 3 times, if prop customClass and checkable is given", async () => {
        const props = {
            layerId: "WMS",
            customClass: "customCSSClass",
            checkable: true
        };

        wrapper = shallowMount(LayerPreviewComponent, {
            global: {
                plugins: [store]
            },
            props: props
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll(".customCSSClass").length).to.be.equals(3);
    });

});

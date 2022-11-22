import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import PoiOrientationComponent from "../../../../components/poi/PoiOrientation.vue";
import Feature from "ol/Feature.js";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/orientation/components/PoiOrientation.vue", () => {
    let store,
        propsData,
        wrapper;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        Orientation: {
                            namespaced: true,
                            getters: {
                                activeCategory: sinon.stub(),
                                position: sinon.stub()
                            },
                            mutations: {
                                setActiveCategory: sinon.stub()
                            }
                        }
                    }
                }
            },
            getters: {
                visibleLayerConfigs: sinon.stub()
            }
        });

        propsData = {
            poiDistances: [
                1000,
                5000,
                10000
            ],
            getFeaturesInCircle: () => {
                const feature = new Feature(),
                    featuresAll = [];

                featuresAll.push(feature);

                return featuresAll;
            }
        };

        wrapper = shallowMount(PoiOrientationComponent,
            {
                global: {
                    plugins: [store]
                },
                propsData: propsData
            });
    });

    after(() => {
        sinon.restore();
    });

    describe("Render Component", function () {
        it("renders the Poi Orientation component", () => {
            expect(wrapper.find("#surrounding_vectorfeatures").exists()).to.be.true;
            expect(wrapper.find(".modal-backdrop").exists()).to.be.true;
        });
    });

    describe("getFeatureTitle", function () {
        let feature = new Feature();

        it("should return layerName when name is unset", function () {
            feature = Object.assign(feature, {
                layerName: "LayerName"
            });
            expect(wrapper.vm.getFeatureTitle(feature)).to.be.an("array").to.deep.equal(["LayerName"]);
        });
        it("should return name when set", function () {
            feature.set("name", "Name");
            expect(wrapper.vm.getFeatureTitle(feature)).to.be.an("array").to.deep.equal(["Name"]);
        });
        it("should return nearby title text when set", function () {
            feature = Object.assign(feature, {
                nearbyTitleText: ["nearbyTitleText"]
            });
            expect(wrapper.vm.getFeatureTitle(feature)).to.be.an("array").to.deep.equal(["nearbyTitleText"]);
        });
    });
});

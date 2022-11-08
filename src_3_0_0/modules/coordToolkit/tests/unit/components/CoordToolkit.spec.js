import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import crs from "@masterportal/masterportalapi/src/crs";
import CoordToolkitComponent from "../../../components/CoordToolkit.vue";
import CoordToolkit from "../../../store/indexCoordToolkit";

const localVue = createLocalVue(),
    namedProjections = [
        ["EPSG:31467", "+title=Bessel/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs"],
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        ["EPSG:8395", "+title=ETRS89/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ];

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/coordToolkit/components/CoordToolkit.vue", () => {
    const mockState = {

            mode: "2D"
        },
        mockMapGetters = {
            projection: () => {
                return {id: "http://www.opengis.net/gml/srs/epsg.xml#25832", name: "EPSG:25832", projName: "utm"};
            },
            mouseCoordinate: () => sinon.stub(),
            mode: (state) => state.mode
        },
        mockMapMarkerActions = {
            removePointMarker: sinon.stub()
        },
        mockAlertingActions = {
            addSingleAlert: sinon.stub()
        },
        mockMapActions = {
            addPointerMoveHandler: sinon.stub(),
            removePointerMoveHandler: sinon.stub(),
            removeInteraction: sinon.stub(),
            addInteraction: sinon.stub()
        },
        mockMapMutations = {
            setMode: (state, mapMode) => {
                state.mode = mapMode;
            }
        },
        mockConfigJson = {
            Portalconfig: {
                navigationSecondary: {
                    sections: [
                        {
                            coordToolkit: {
                                "name": "translate#common:menu.tools.coordToolkit",
                                "icon": "bi-globe",
                                "showCopyButtons": true
                            }
                        }
                    ]
                }
            }
        },

        eventProj4326 = {
            target: {
                value: "http://www.opengis.net/gml/srs/epsg.xml#4326"
            }
        },
        eventProj25832 = {
            target: {
                value: "http://www.opengis.net/gml/srs/epsg.xml#25832"
            }
        },
        copyCoordinatesSpy = sinon.spy();
    let store,
        wrapper,
        text = "",
        origvalidateInput,
        originitHeightLayer,
        origcopyCoordinates,
        origtransformCoordinatesFromTo;

    beforeEach(() => {
        origvalidateInput = CoordToolkit.actions.validateInput;
        originitHeightLayer = CoordToolkit.actions.initHeightLayer;
        origcopyCoordinates = CoordToolkit.actions.copyCoordinates;
        origtransformCoordinatesFromTo = CoordToolkit.actions.transformCoordinatesFromTo;
        CoordToolkit.actions.validateInput = sinon.spy();
        CoordToolkit.actions.initHeightLayer = sinon.spy();
        CoordToolkit.actions.copyCoordinates = sinon.spy();
        CoordToolkit.actions.transformCoordinatesFromTo = sinon.spy();

        store = new Vuex.Store({
            namespaced: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        CoordToolkit
                    }
                },
                Maps: {
                    namespaced: true,
                    state: mockState,
                    getters: mockMapGetters,
                    mutations: mockMapMutations,
                    actions: mockMapActions
                },
                MapMarker: {
                    namespaced: true,
                    actions: mockMapMarkerActions
                },
                Alerting: {
                    namespaced: true,
                    actions: mockAlertingActions

                }
            },
            actions: {
                copyCoordinates: copyCoordinatesSpy
            },
            getters: {
                uiStyle: () => "",
                isMobile: () => false
            },
            state: {
                configJson: mockConfigJson
            }
        });
        crs.registerProjections(namedProjections);


        navigator.clipboard = {
            writeText: (aText) => {
                text = aText;
            }
        };
        sinon.stub(navigator.clipboard, "writeText").resolves(text);
        store.commit("Modules/CoordToolkit/setActive", true);
    });

    afterEach(() => {
        sinon.restore();
        if (wrapper) {
            wrapper.destroy();
        }
        CoordToolkit.actions.validateInput = origvalidateInput;
        CoordToolkit.actions.initHeightLayer = originitHeightLayer;
        CoordToolkit.actions.copyCoordinates = origcopyCoordinates;
        CoordToolkit.actions.transformCoordinatesFromTo = origtransformCoordinatesFromTo;
    });

    it("renders CoordToolkit without height field", () => {
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#coordinatesHeightField").exists()).to.be.false;
        expect(CoordToolkit.actions.initHeightLayer.calledOnce).to.be.false;
    });

    it("not renders CoordToolkit", () => {
        store.commit("Modules/CoordToolkit/setActive", false);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.false;
    });
    it("renders CoordToolkit with height field", () => {
        const layer = {id: "123", get: () => sinon.spy};

        store.state.Modules.CoordToolkit.heightLayer = layer;
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#coordinatesHeightField").exists()).to.be.true;
    });
    it("renders CoordToolkit without copy-coords buttons", () => {
        store.commit("Modules/CoordToolkit/setShowCopyButtons", false);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#copyCoordsPairBtn").exists()).to.be.false;
    });
    it("renders CoordToolkit with copy-coords buttons", () => {
        store.commit("Modules/CoordToolkit/setShowCopyButtons", true);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#copyCoordsPairBtn").exists()).to.be.true;
    });
    it("CoordToolkit mounting with heightLayerId shall call initHeightLayer", async () => {
        store.state.Modules.CoordToolkit.heightLayerId = "123";
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
        await wrapper.vm.$nextTick();

        expect(CoordToolkit.actions.initHeightLayer.calledOnce).to.be.true;
    });

    it("has initially selected projection \"EPSG:25832\"", async () => {
        let options = null,
            selected = null;

        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        await wrapper.vm.$nextTick();

        options = wrapper.findAll("option");
        expect(options.length).to.equal(namedProjections.length + 1);

        selected = options.filter(o => o.attributes().selected === "true");
        expect(selected.length).to.equal(1);
        expect(selected.at(0).attributes().value).to.equal("http://www.opengis.net/gml/srs/epsg.xml#25832");
    });
    describe("CoordToolkit.vue methods", () => {
        it("close sets active to false", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Modules.CoordToolkit.active).to.be.true;
            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(store.state.Modules.CoordToolkit.active).to.be.false;
            expect(wrapper.find("#supply-coord").exists()).to.be.false;
        });
        it("method selectionChanged sets currentProjection", () => {
            const value = "http://www.opengis.net/gml/srs/epsg.xml#31467",
                event = {
                    target: {
                        value: value
                    }
                };

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(event);
            expect(store.state.Modules.CoordToolkit.currentProjection.name).to.be.equals(value);
            expect(store.state.Modules.CoordToolkit.currentProjection.projName).to.be.equals("tmerc");
            expect(store.state.Modules.CoordToolkit.coordinatesEasting.value).to.be.equals("0.00");
            expect(store.state.Modules.CoordToolkit.coordinatesNorthing.value).to.be.equals("0.00");
        });

        it("createInteraction sets projections and adds interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            // expect(store.state.Modules.CoordToolkit.selectPointerMove).to.be.null;
            wrapper.vm.createInteraction();
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove).to.be.equals("object");
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove.handleMoveEvent).to.be.equals("function");
        });

        describe("createInteraction for 3D", () => {
            before(() => {
                global.Cesium = {};
                global.Cesium.ScreenSpaceEventHandler = function () {
                    return {
                        setInputAction: () => sinon.stub(),
                        destroy: () => sinon.stub()
                    };
                };
                global.Cesium.ScreenSpaceEventType = {
                    MOUSE_MOVE: sinon.stub(),
                    LEFT_CLICK: sinon.stub()
                };
            });

            after(() => {
                store.commit("Maps/setMode", "2D");
            });

            it("createInteraction for 3D and the eventHandler is not null", () => {
                wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
                const canvas = {},
                    map3D = {
                        mode: "3D",
                        getCesiumScene: () => canvas
                    };

                mapCollection.addMap(map3D, "3D");

                expect(wrapper.vm.eventHandler).to.be.null;

                store.commit("Maps/setMode", "3D");
                wrapper.vm.createInteraction();

                expect(wrapper.vm.eventHandler).to.be.not.null;
            });
        });

        it("setSupplyCoordInactive removes interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove).to.be.equals("object");
            wrapper.vm.setSupplyCoordInactive();
            expect(store.state.Modules.CoordToolkit.selectPointerMove).to.be.null;
        });
        it("setSupplyCoordActive adds interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            // expect(store.state.Modules.CoordToolkit.selectPointerMove).to.be.null;
            wrapper.vm.setSupplyCoordActive();
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove).to.be.equals("object");
        });
        it("initProjections adds WGS84 decimal projection", () => {
            let projections = [];

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.initProjections();

            projections = store.state.Modules.CoordToolkit.projections;
            expect(projections.length).to.be.equals(5);
            expect(projections[0].id).to.be.not.null;
            expect(projections.filter(proj => proj.id === "http://www.opengis.net/gml/srs/epsg.xml#4326-DG").length).to.be.equals(1);
        });
        it("label returns correct path", () => {
            const key = "key";
            let value = "http://www.opengis.net/gml/srs/epsg.xml#4326",
                event = {
                    target: {
                        value: value
                    }
                },
                ret = "";

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.initProjections();
            wrapper.vm.selectionChanged(event);

            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.hdms.key");

            value = "http://www.opengis.net/gml/srs/epsg.xml#31467";
            event = {
                target: {
                    value: value
                }
            };
            wrapper.vm.selectionChanged(event);
            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");

            value = null;
            event = {
                target: {
                    value: value
                }
            };
            wrapper.vm.selectionChanged(event);
            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");
        });
        it("changeMode changes the mode 'supply' or 'search'", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            expect(wrapper.vm.isEnabled("supply")).to.be.true;
            wrapper.vm.changeMode("search");
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("search");
            expect(wrapper.vm.isEnabled("search")).to.be.true;
        });
        it("onInputEvent should call validateInput if mode is 'search'", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.changeMode("supply");
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            wrapper.vm.onInputEvent("input");
            expect(CoordToolkit.actions.validateInput.calledOnce).to.be.false;

            wrapper.vm.changeMode("search");
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("search");
            wrapper.vm.onInputEvent("input");
            expect(CoordToolkit.actions.validateInput.calledOnce).to.be.true;
        });
        it("copyCoords copies easting field", async () => {
            let input = null;

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            wrapper.vm.changeMode("search");
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("search");
            expect(wrapper.find("#coordinatesNorthingField").exists()).to.be.true;

            input = await wrapper.find("#coordinatesNorthingField");
            input.setValue("123456");
            await wrapper.vm.$nextTick();

            wrapper.vm.copyCoords(["coordinatesNorthingField"]);
            await wrapper.vm.$nextTick();
            expect(CoordToolkit.actions.copyCoordinates.calledOnce).to.be.true;
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.an("Array");
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.deep.equals(["123456"]);
        });
        it("copyCoords copies northing field", async () => {
            let input = null;

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            wrapper.vm.changeMode("supply");
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            expect(wrapper.find("#coordinatesNorthingField").exists()).to.be.true;

            input = await wrapper.find("#coordinatesNorthingField");
            input.setValue("123456");
            await wrapper.vm.$nextTick();

            wrapper.vm.copyCoords(["coordinatesNorthingField"]);
            await wrapper.vm.$nextTick();
            expect(CoordToolkit.actions.copyCoordinates.calledOnce).to.be.true;
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.an("Array");
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.deep.equals(["123456"]);
        });
        it("copyCoords copies northing and easting field, projection not longlat", async () => {
            let inputEasting = null,
                inputNorthing = null;
            const valueEasting = "123456",
                valueNorthing = "789123";

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            wrapper.vm.changeMode("supply");
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            expect(wrapper.find("#coordinatesNorthingField").exists()).to.be.true;
            expect(wrapper.find("#coordinatesEastingField").exists()).to.be.true;

            inputNorthing = await wrapper.find("#coordinatesNorthingField");
            inputEasting = await wrapper.find("#coordinatesEastingField");
            inputNorthing.setValue(valueNorthing);
            inputEasting.setValue(valueEasting);
            await wrapper.vm.$nextTick();

            wrapper.vm.copyCoords(["coordinatesEastingField", "coordinatesNorthingField"]);
            await wrapper.vm.$nextTick();
            expect(CoordToolkit.actions.copyCoordinates.calledOnce).to.be.true;
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.an("Array");
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.deep.equals([valueEasting, valueNorthing]);
        });
        it("copyCoords copies northing and easting field, projection is longlat, coordinates shall be reverted", async () => {
            let inputEasting = null,
                inputNorthing = null;
            const valueEasting = "123456",
                valueNorthing = "789123";

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            wrapper.vm.changeMode("supply");
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            expect(wrapper.find("#coordinatesNorthingField").exists()).to.be.true;
            expect(wrapper.find("#coordinatesEastingField").exists()).to.be.true;

            inputNorthing = await wrapper.find("#coordinatesNorthingField");
            inputEasting = await wrapper.find("#coordinatesEastingField");
            inputNorthing.setValue(valueNorthing);
            inputEasting.setValue(valueEasting);
            await wrapper.vm.$nextTick();

            wrapper.vm.copyCoords(["coordinatesEastingField", "coordinatesNorthingField"]);
            await wrapper.vm.$nextTick();
            expect(CoordToolkit.actions.copyCoordinates.calledOnce).to.be.true;
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.an("Array");
            expect(CoordToolkit.actions.copyCoordinates.firstCall.args[1]).to.be.deep.equals([valueNorthing, valueEasting]);
        });
        it("getClassForEasting no longlat-projection", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj25832);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.getClassForEasting()).to.be.equals(" form-group form-group-sm row");
        });
        it("getClassForEasting no error", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.getClassForEasting()).to.be.equals("eastingToBottomNoError form-group form-group-sm row");
        });
        it("getClassForEasting eastingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setEastingNoCoord", true);
            expect(wrapper.vm.getClassForEasting()).to.be.equals("eastingToBottomNoError form-group form-group-sm row");
        });
        it("getClassForEasting northingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setEastingNoCoord", false);
            store.commit("Modules/CoordToolkit/setNorthingNoCoord", true);
            expect(wrapper.vm.getClassForEasting()).to.be.equals("eastingToBottomOneError form-group form-group-sm row");
        });
        it("getClassForEasting northingError and eastingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setNorthingNoCoord", true);
            store.commit("Modules/CoordToolkit/setEastingNoCoord", true);
            expect(wrapper.vm.getClassForEasting()).to.be.equals("eastingToBottomTwoErrors form-group form-group-sm row");
        });
        it("getClassForNorthing no longlat-projection", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj25832);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.getClassForNorthing()).to.be.equals(" form-group form-group-sm row");
        });
        it("getClassForNorthing no error", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setNorthingNoCoord", false);
            store.commit("Modules/CoordToolkit/setEastingNoCoord", false);
            expect(wrapper.vm.getClassForNorthing()).to.be.equals("northingToTopNoError form-group form-group-sm row");
        });
        it("getClassForNorthing eastingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setEastingNoCoord", true);
            expect(wrapper.vm.getClassForNorthing()).to.be.equals("northingToTopEastingError form-group form-group-sm row");
        });
        it("getClassForNorthing northingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setEastingNoCoord", false);
            store.commit("Modules/CoordToolkit/setNorthingNoCoord", true);
            expect(wrapper.vm.getClassForNorthing()).to.be.equals("northingToTopNoError form-group form-group-sm row");
        });
        it("getClassForNorthing northingError and eastingError", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(eventProj4326);
            await wrapper.vm.$nextTick();
            store.commit("Modules/CoordToolkit/setNorthingNoCoord", true);
            store.commit("Modules/CoordToolkit/setEastingNoMatch", true);
            expect(wrapper.vm.getClassForNorthing()).to.be.equals("northingToTopTwoErrors form-group form-group-sm row");
            store.commit("Modules/CoordToolkit/setEastingNoCoord", true);
            expect(wrapper.vm.getClassForNorthing()).to.be.equals("northingToTopTwoErrorsEastNoValue form-group form-group-sm row");
        });
    });
    describe("CoordToolkit.vue watcher", () => {
        it("watch to active shall set mode to 'supply'", async () => {
            store.commit("Modules/CoordToolkit/setActive", false);
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            store.commit("Modules/CoordToolkit/setActive", true);
            await wrapper.vm.$nextTick();
            expect(store.state.Modules.CoordToolkit.mode).to.be.equals("supply");
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove).to.be.equals("object");
            expect(typeof store.state.Modules.CoordToolkit.selectPointerMove.handleMoveEvent).to.be.equals("function");

            wrapper.vm.$options.destroyed.forEach(hook => {
                hook.call(wrapper.vm);
            });
            await wrapper.vm.$nextTick();

            expect(store.state.Modules.CoordToolkit.eastingNoCoord).to.be.false;
            expect(store.state.Modules.CoordToolkit.eastingNoMatch).to.be.false;
            expect(store.state.Modules.CoordToolkit.northingNoCoord).to.be.false;
            expect(store.state.Modules.CoordToolkit.northingNoMatch).to.be.false;
            expect(store.state.Modules.CoordToolkit.coordinatesEasting.value).to.be.equals("");
            expect(store.state.Modules.CoordToolkit.coordinatesNorthing.value).to.be.equals("");
        });
    });
});

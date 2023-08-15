import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import ActionButton from "../../../components/ActionButton.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/ActionButton.vue", () => {
    let store,
        wrapper,
        callActionSpy,
        searchBarActions;

    beforeEach(() => {
        searchBarActions = {
            activateLayerInTopicTree: sinon.spy(),
            addLayerToTopicTree: sinon.spy(),
            highlightFeature: sinon.spy(),
            openGetFeatureInfo: sinon.spy(),
            setMarker: sinon.spy(),
            zoomToResult: sinon.spy()
        };
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        ActionButton,
                        SearchBar: {
                            namespaced: true,
                            actions: searchBarActions,
                            mutations: {
                                setSearchResultsActive: sinon.spy()
                            }
                        }
                    }
                }
            }
        });
        callActionSpy = sinon.spy(ActionButton.methods, "callAction");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("render ActionButton", () => {
        it("should render button with 'setMarker' icon", async () => {
            const props = {
                actionName: "setMarker",
                actionArgs: {
                    coordinates: [1, 2],
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.setMarker.calledOnce).to.be.true;
            expect(searchBarActions.setMarker.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });

        it("should render button with 'zoomToResult' icon", async () => {
            const props = {
                actionName: "zoomToResult",
                actionArgs: {
                    coordinates: [1, 2],
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.zoomToResult.calledOnce).to.be.true;
            expect(searchBarActions.zoomToResult.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });

        it("should render button with 'openGetFeatureInfo' icon", async () => {
            const props = {
                actionName: "openGetFeatureInfo",
                actionArgs: {
                    feature: {
                        id: "feature"
                    },
                    layer: {
                        typ: "WMS"
                    },
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.openGetFeatureInfo.calledOnce).to.be.true;
            expect(searchBarActions.openGetFeatureInfo.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });

        it("should render button with 'highlightFeature' icon", async () => {
            const props = {
                actionName: "highlightFeature",
                actionArgs: {
                    feature: {
                        id: "feature"
                    },
                    layer: {
                        typ: "WMS"
                    },
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.highlightFeature.calledOnce).to.be.true;
            expect(searchBarActions.highlightFeature.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });

        it("should render button with 'activateLayerInTopicTree' icon", async () => {
            const props = {
                actionName: "activateLayerInTopicTree",
                actionArgs: {
                    layerId: "layerId",
                    source: {
                        id: "layerId"
                    },
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.activateLayerInTopicTree.calledOnce).to.be.true;
            expect(searchBarActions.activateLayerInTopicTree.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });

        it("should render button with 'addLayerToTopicTree' icon", async () => {
            const props = {
                actionName: "addLayerToTopicTree",
                actionArgs: {
                    layerId: "layerId",
                    source: {
                        id: "layerId"
                    },
                    closeResults: true
                }
            };

            wrapper = mount(ActionButton, {
                global: {
                    plugins: [store]
                },
                props
            });

            expect(wrapper.find("button").exists()).to.be.true;
            expect(wrapper.find("i").exists()).to.be.true;
            expect(wrapper.find("i").attributes("class")).to.be.equals(wrapper.vm.iconsByActions[props.actionName]);
            await wrapper.find("button").trigger("click");
            expect(callActionSpy.calledOnce).to.be.true;
            expect(searchBarActions.addLayerToTopicTree.calledOnce).to.be.true;
            expect(searchBarActions.addLayerToTopicTree.firstCall.args[1]).to.be.deep.equals(props.actionArgs);
        });
    });


});

import {expect} from "chai";
import sinon from "sinon";
import collectDataByFolderModule from "../../../js/collectDataByFolder";

import actions from "../../../store/actionsLayerSelection";

const {updateLayerTree, navigateForward, navigateBack, setNavigationByFolder, showLayer, reset} = actions;

describe("src_3_0_0/modules/layerSelection/store/actionsLayerSelection", () => {
    let commit,
        dispatch,
        getters,
        rootGetters,
        layerConfig,
        folder;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        layerConfig = {
            id: "id",
            parentId: "folder-1"
        };
        folder = {
            id: "folder-1",
            name: "folderName"
        };
        folder.elements = [layerConfig];
        getters = {
            layersToAdd: ["1", "2"],
            menuSide: "mainMenu",
            layerConfigById: () => layerConfig,
            folderById: () => folder
        };
        rootGetters = {
            determineZIndex: () => 0,
            isBaselayer: (id) => id === "100",
            layerConfigsByAttributes: () => [],
            layerConfigById: () => layerConfig,
            folderById: () => folder,
            allLayerConfigsStructured: () => [folder],
            allBaselayerConfigs: [{name: "baselayer"}]
        };
    });

    afterEach(sinon.restore);

    describe("updateLayerTree", () => {
        it("updateLayerTree for two layers", () => {
            const expectedArg = {
                layerConfigs: [
                    {
                        id: "1",
                        layer: {
                            id: "1",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 0
                        }
                    },
                    {
                        id: "2",
                        layer: {
                            id: "2",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 1
                        }
                    }
                ]
            };

            updateLayerTree({commit, dispatch, getters, rootGetters});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("clearLayerSelection");
            expect(commit.firstCall.args[1]).to.be.undefined;
            expect(commit.secondCall.args[0]).to.be.equals("Menu/switchToRoot");
            expect(commit.secondCall.args[1]).to.be.equals("mainMenu");

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(dispatch.firstCall.args[1]).to.deep.equals(expectedArg);
        });

        it("updateLayerTree for one layer and one baselayer", () => {
            getters = {
                layersToAdd: ["100", "2"],
                menuSide: "mainMenu"
            };

            rootGetters.layerConfigsByAttributes = () => [
                {
                    id: "100",
                    baselayer: true,
                    visibility: true,
                    showInLayerTree: true,
                    zIndex: 1
                },
                {
                    id: "2",
                    visibility: true,
                    showInLayerTree: true,
                    zIndex: 0
                }
            ];

            updateLayerTree({commit, dispatch, getters, rootGetters});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("clearLayerSelection");
            expect(commit.firstCall.args[1]).to.be.undefined;
            expect(commit.secondCall.args[0]).to.be.equals("Menu/switchToRoot");
            expect(commit.secondCall.args[1]).to.be.equals("mainMenu");

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("updateLayerConfigZIndex");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                layerContainer: [
                    {
                        id: "100",
                        baselayer: true,
                        visibility: true,
                        showInLayerTree: true,
                        zIndex: 1
                    },
                    {
                        id: "2",
                        visibility: true,
                        showInLayerTree: true,
                        zIndex: 0
                    }
                ],
                maxZIndex: 1
            });
            expect(dispatch.secondCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(dispatch.secondCall.args[1]).to.deep.equals({
                layerConfigs: [
                    {
                        id: "100",
                        layer: {
                            id: "100",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 2
                        }
                    },
                    {
                        id: "2",
                        layer: {
                            id: "2",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 0
                        }
                    }
                ]
            });
        });
    });

    describe("actionsLayerSelection", () => {
        it("navigateForward from layerTree", () => {
            const subjectDataLayerConfs = [
                    {
                        id: "1",
                        type: "folder",
                        name: "name1"
                    },
                    {
                        id: "2",
                        type: "folder",
                        name: "name2"
                    },
                    {
                        id: "3",
                        type: "layer",
                        name: "name3"
                    }
                ],
                baselayerConfs = [
                    {
                        id: "bg1",
                        type: "layer",
                        name: "name-bg1"
                    },
                    {
                        id: "bg2",
                        type: "layer",
                        name: "name-bg2"
                    }
                ],
                lastFolderName = "lastFolderName";

            navigateForward({commit}, {lastFolderName, subjectDataLayerConfs, baselayerConfs});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("addToLayerSelection");
            expect(commit.firstCall.args[1]).to.be.deep.equals({lastFolderName, subjectDataLayerConfs, baselayerConfs});
            expect(commit.secondCall.args[0]).to.be.equals("setBaselayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals(baselayerConfs);
            expect(commit.thirdCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals(subjectDataLayerConfs);
        });

        it("navigateBack inside layerSelection", () => {
            const lastSubjectDataLayerConfs = [
                    {
                        id: "0",
                        type: "folder",
                        name: "name0"
                    }
                ],
                firstSubjectDataLayerConfs = [
                    {
                        id: "00",
                        type: "folder",
                        name: "name00"
                    }
                ],
                lastBaselayerConfs = [
                    {
                        id: "bg0",
                        type: "layer",
                        name: "name-bg0"
                    }
                ],
                firstBaselayerConfs = [
                    {
                        id: "bg00",
                        type: "layer",
                        name: "name-bg00"
                    }
                ],
                firstFolderName = "firstFolderName",
                secondFolderName = "secondFolderName";

            getters = {
                lastFolderNames: [firstFolderName, secondFolderName],
                lastSubjectDataLayerConfs: [firstBaselayerConfs, lastSubjectDataLayerConfs],
                lastBaselayerConfs: [firstSubjectDataLayerConfs, lastBaselayerConfs]
            };

            navigateBack({commit, getters});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("reduceToPreviousLayerSelection");
            expect(commit.secondCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals(lastSubjectDataLayerConfs);
            expect(commit.thirdCall.args[0]).to.be.equals("setBaselayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals(lastBaselayerConfs);
        });

        it("setNavigationByFolder", () => {
            const data = {
                    lastBaselayerConfs: [{name: "baselayer"}],
                    lastSubjectDataLayerConfs: [{name: "subjectdata"}],
                    lastFolderNames: ["eins"]
                },
                collectDataByFolderStub = sinon.stub(collectDataByFolderModule, "collectDataByFolder").returns(data);

            setNavigationByFolder({commit, rootGetters}, {folder: {}});

            expect(collectDataByFolderStub.calledOnce).to.be.true;
            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("setLastFolderNames");
            expect(commit.firstCall.args[1]).to.be.equals(data.lastFolderNames);
            expect(commit.secondCall.args[0]).to.be.equals("setLastBaselayerConfs");
            expect(commit.secondCall.args[1]).to.be.equals(data.lastBaselayerConfs);
            expect(commit.thirdCall.args[0]).to.be.equals("setLastSubjectDataLayerConfs");
            expect(commit.thirdCall.args[1]).to.be.equals(data.lastSubjectDataLayerConfs);

        });
        describe("showLayer", () => {
            it("showLayer, layerConfig has parentId", () => {
                const layerId = "layerId";

                showLayer({commit, dispatch, rootGetters}, {layerId});

                expect(dispatch.calledThrice).to.be.true;
                expect(dispatch.firstCall.args[0]).to.be.equals("setNavigationByFolder");
                expect(dispatch.firstCall.args[1]).to.be.deep.equals({folder});
                expect(dispatch.secondCall.args[0]).to.be.equals("Menu/changeCurrentComponent");
                expect(dispatch.secondCall.args[1]).to.be.deep.equals({type: "layerSelection", side: "mainMenu", props: {name: "common:modules.layerSelection.addSubject"}});
                expect(dispatch.thirdCall.args[0]).to.be.equals("navigateForward");
                expect(dispatch.thirdCall.args[1]).to.be.deep.equals({lastFolderName: folder.name, subjectDataLayerConfs: folder.elements, baselayerConfs: []});
                expect(commit.calledTwice).to.be.true;
                expect(commit.firstCall.args[0]).to.be.equals("setHighlightLayerId");
                expect(commit.firstCall.args[1]).to.be.equals(layerId);
                expect(commit.secondCall.args[0]).to.be.equals("setVisible");
                expect(commit.secondCall.args[1]).to.be.true;
            });

            it("showLayer, layerConfig has no parentId", () => {
                const layerId = "layerId";

                layerConfig.parentId = null;
                showLayer({commit, dispatch, rootGetters}, {layerId});

                expect(dispatch.calledTwice).to.be.true;
                expect(dispatch.firstCall.args[0]).to.be.equals("Menu/changeCurrentComponent");
                expect(dispatch.firstCall.args[1]).to.be.deep.equals({type: "layerSelection", side: "mainMenu", props: {name: "common:modules.layerSelection.addSubject"}});
                expect(dispatch.secondCall.args[0]).to.be.equals("navigateForward");
                expect(dispatch.secondCall.args[1]).to.be.deep.equals({lastFolderName: "", subjectDataLayerConfs: [folder], baselayerConfs: [{name: "baselayer"}]});
                expect(commit.calledTwice).to.be.true;
                expect(commit.firstCall.args[0]).to.be.equals("setHighlightLayerId");
                expect(commit.firstCall.args[1]).to.be.equals(layerId);
                expect(commit.secondCall.args[0]).to.be.equals("setVisible");
                expect(commit.secondCall.args[1]).to.be.true;
            });
        });

        it("reset", () => {
            reset({commit});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("clearLayerSelection");
            expect(commit.secondCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals([]);
            expect(commit.thirdCall.args[0]).to.be.equals("setBaselayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals([]);
        });
    });
});

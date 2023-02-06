import {expect} from "chai";
import sinon from "sinon";

import actions from "../../../store/actionsLayerSelection";

const {updateLayerTree, navigateForward, navigateBack, reset} = actions;

describe("src_3_0_0/modules/layerSelection/store/actionsLayerSelection", function () {
    let commit,
        dispatch,
        getters,
        rootGetters;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
            layersToAdd: ["1", "2"],
            menuSide: "mainMenu"
        };
        rootGetters = {
            determineZIndex: () => 0,
            isBackgroundLayer: (id) => id === "100",
            layerConfigsByAttributes: () => []
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
                            zIndex: 0
                        }
                    }
                ]
            };

            updateLayerTree({commit, dispatch, getters, rootGetters});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("clearSelectedLayer");
            expect(commit.firstCall.args[1]).to.be.undefined;
            expect(commit.secondCall.args[0]).to.be.equals("Menu/switchToRoot");
            expect(commit.secondCall.args[1]).to.be.equals("mainMenu");

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(dispatch.firstCall.args[1]).to.deep.equals(expectedArg);
        });

        it("updateLayerTree for one layer and one background layer", () => {
            getters = {
                layersToAdd: ["100", "2"],
                menuSide: "mainMenu"
            };

            rootGetters.layerConfigsByAttributes = () => [
                {
                    id: "100",
                    backgroundLayer: true,
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
            expect(commit.firstCall.args[0]).to.be.equals("clearSelectedLayer");
            expect(commit.firstCall.args[1]).to.be.undefined;
            expect(commit.secondCall.args[0]).to.be.equals("Menu/switchToRoot");
            expect(commit.secondCall.args[1]).to.be.equals("mainMenu");

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("updateLayerConfigZIndex");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                layerContainer: [
                    {
                        id: "100",
                        backgroundLayer: true,
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

    describe("actionsLayerSelection", function () {
        it("updateLayerTree", function () {
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
                            zIndex: 0
                        }
                    }
                ]
            };

            updateLayerTree({commit, dispatch, getters, rootGetters});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("clearLayerSelection");
            expect(commit.secondCall.args[0]).to.be.equals("Menu/switchToRoot");
            expect(commit.secondCall.args[1]).to.be.equals(getters.menuSide);
            expect(commit.secondCall.args[2]).to.be.deep.equals({root: true});
            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(dispatch.firstCall.args[1]).to.deep.equals(expectedArg);
            expect(dispatch.secondCall.args[0]).to.be.equals("updateAllZIndexes");
            expect(dispatch.secondCall.args[1]).to.be.null;
            expect(dispatch.secondCall.args[2]).to.be.deep.equals({root: true});
        });

        it("navigateForward from layerTree", function () {
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
                backgroundLayerConfs = [
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

            navigateForward({commit}, {lastFolderName, subjectDataLayerConfs, backgroundLayerConfs});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("addToLayerSelection");
            expect(commit.firstCall.args[1]).to.be.deep.equals({lastFolderName, subjectDataLayerConfs, backgroundLayerConfs});
            expect(commit.secondCall.args[0]).to.be.equals("setBackgroundLayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals(backgroundLayerConfs);
            expect(commit.thirdCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals(subjectDataLayerConfs);
        });

        it("navigateBack inside layerSelection", function () {
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
                lastBackgroundLayerConfs = [
                    {
                        id: "bg0",
                        type: "layer",
                        name: "name-bg0"
                    }
                ],
                firstBackgroundLayerConfs = [
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
                lastSubjectDataLayerConfs: [firstBackgroundLayerConfs, lastSubjectDataLayerConfs],
                lastBackgroundLayerConfs: [firstSubjectDataLayerConfs, lastBackgroundLayerConfs]
            };

            navigateBack({commit, getters});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("reduceToPreviousLayerSelection");
            expect(commit.secondCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals(lastSubjectDataLayerConfs);
            expect(commit.thirdCall.args[0]).to.be.equals("setBackgroundLayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals(lastBackgroundLayerConfs);
        });

        it("reset", function () {
            reset({commit});

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.be.equals("clearLayerSelection");
            expect(commit.secondCall.args[0]).to.be.equals("setSubjectDataLayerConfs");
            expect(commit.secondCall.args[1]).to.be.deep.equals([]);
            expect(commit.thirdCall.args[0]).to.be.equals("setBackgroundLayerConfs");
            expect(commit.thirdCall.args[1]).to.be.deep.equals([]);
        });
    });
});

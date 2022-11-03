import {expect} from "chai";
import sinon from "sinon";

import actionsModules from "../../../modules-store/actionsModules";

const {
    mergeModuleState,
    addAttributesToModuleState
} = actionsModules;

describe("src_3_0_0/modules/modules-store/actions.js", () => {
    let commit,
        dispatch,
        portalConfig;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();

        portalConfig = {
            "mainMenu": {
                "sections": [
                    [
                        {
                            "title": "common:menu.tools.scaleSwitcher",
                            "icon": "bi-1-square-fill",
                            "itemType": "scaleSwitcher"
                        },
                        {
                            "title": "folder1",
                            "icon": "bi-file-plus",
                            "itemType": "folder",
                            "children": [
                                {
                                    "itemType": "folder",
                                    "title": "folder1_1",
                                    "icon": "bi-1-square-fill",
                                    "children": [
                                        {
                                            "itemType": "folder",
                                            "title": "folder1_1_1",
                                            "icon": "bi-file-plus",
                                            "children": []
                                        },
                                        {
                                            "itemType": "folder",
                                            "title": "folder1_1_2",
                                            "icon": "bi-file-plus",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                ]
            }
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("mergeModuleState", () => {
        it("should start addAttributesToModuleState for every sections", () => {
            mergeModuleState({dispatch}, portalConfig);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addAttributesToModuleState");
            expect(dispatch.firstCall.args[1]).to.deep.equals([
                {
                    "title": "common:menu.tools.scaleSwitcher",
                    "icon": "bi-1-square-fill",
                    "itemType": "scaleSwitcher"
                },
                {
                    "title": "folder1",
                    "icon": "bi-file-plus",
                    "itemType": "folder",
                    "children": [
                        {
                            "itemType": "folder",
                            "title": "folder1_1",
                            "icon": "bi-1-square-fill",
                            "children": [
                                {
                                    "itemType": "folder",
                                    "title": "folder1_1_1",
                                    "icon": "bi-file-plus",
                                    "children": []
                                },
                                {
                                    "itemType": "folder",
                                    "title": "folder1_1_2",
                                    "icon": "bi-file-plus",
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
    });

    describe("addAttributesToModuleState", () => {
        it("should commit attributes to state", () => {
            addAttributesToModuleState({commit, dispatch}, portalConfig.mainMenu.sections[0]);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addAttributesToModuleState");
            expect(dispatch.firstCall.args[1]).to.deep.equals([
                {
                    "itemType": "folder",
                    "title": "folder1_1",
                    "icon": "bi-1-square-fill",
                    "children": [
                        {
                            "itemType": "folder",
                            "title": "folder1_1_1",
                            "icon": "bi-file-plus",
                            "children": []
                        },
                        {
                            "itemType": "folder",
                            "title": "folder1_1_2",
                            "icon": "bi-file-plus",
                            "children": []
                        }
                    ]
                }
            ]);

            expect(commit.calledThrice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("ScaleSwitcher/setTitle");
            expect(commit.firstCall.args[1]).to.equals("common:menu.tools.scaleSwitcher");
            expect(commit.secondCall.args[0]).to.equals("ScaleSwitcher/setIcon");
            expect(commit.secondCall.args[1]).to.equals("bi-1-square-fill");
            expect(commit.thirdCall.args[0]).to.equals("ScaleSwitcher/setItemType");
            expect(commit.thirdCall.args[1]).to.equals("scaleSwitcher");
        });
    });
});

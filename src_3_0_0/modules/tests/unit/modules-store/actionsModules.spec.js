import {expect} from "chai";
import sinon from "sinon";

import actionsModules from "../../../modules-store/actionsModules";

const {
    mergeModulesState,
    addAttributesToModuleState,
    setDeepMerge
} = actionsModules;

describe("src_3_0_0/modules/modules-store/actions.js", () => {
    let commit,
        dispatch,
        portalConfig;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();

        portalConfig = {
            mainMenu: {
                sections: [
                    [
                        {
                            title: "common:menu.tools.scaleSwitcher",
                            icon: "bi-1-square-fill",
                            type: "scaleSwitcher"
                        },
                        {
                            title: "folder1",
                            icon: "bi-file-plus",
                            type: "folder",
                            elements: [
                                {
                                    type: "folder",
                                    title: "folder1_1",
                                    icon: "bi-1-square-fill",
                                    elements: [
                                        {
                                            type: "folder",
                                            title: "folder1_1_1",
                                            icon: "bi-file-plus",
                                            elements: []
                                        },
                                        {
                                            type: "folder",
                                            title: "folder1_1_2",
                                            icon: "bi-file-plus",
                                            elements: []
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
            mergeModulesState({dispatch}, portalConfig);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addAttributesToModuleState");
            expect(dispatch.firstCall.args[1]).to.deep.equals({items: [
                {
                    "title": "common:menu.tools.scaleSwitcher",
                    "icon": "bi-1-square-fill",
                    "type": "scaleSwitcher"
                },
                {
                    "title": "folder1",
                    "icon": "bi-file-plus",
                    "type": "folder",
                    "elements": [
                        {
                            "type": "folder",
                            "title": "folder1_1",
                            "icon": "bi-1-square-fill",
                            "elements": [
                                {
                                    "type": "folder",
                                    "title": "folder1_1_1",
                                    "icon": "bi-file-plus",
                                    "elements": []
                                },
                                {
                                    "type": "folder",
                                    "title": "folder1_1_2",
                                    "icon": "bi-file-plus",
                                    "elements": []
                                }
                            ]
                        }
                    ]
                }
            ]});
        });
    });

    describe("addAttributesToModuleState", () => {
        it("should commit attributes to state", () => {
            addAttributesToModuleState({commit, dispatch}, {items: portalConfig.mainMenu.sections[0]});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addAttributesToModuleState");
            expect(dispatch.firstCall.args[1]).to.deep.equals({items: [
                {
                    "type": "folder",
                    "title": "folder1_1",
                    "icon": "bi-1-square-fill",
                    "elements": [
                        {
                            "type": "folder",
                            "title": "folder1_1_1",
                            "icon": "bi-file-plus",
                            "elements": []
                        },
                        {
                            "type": "folder",
                            "title": "folder1_1_2",
                            "icon": "bi-file-plus",
                            "elements": []
                        }
                    ]
                }
            ]});

            expect(commit.calledThrice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("ScaleSwitcher/setTitle");
            expect(commit.firstCall.args[1]).to.equals("common:menu.tools.scaleSwitcher");
            expect(commit.secondCall.args[0]).to.equals("ScaleSwitcher/setIcon");
            expect(commit.secondCall.args[1]).to.equals("bi-1-square-fill");
            expect(commit.thirdCall.args[0]).to.equals("ScaleSwitcher/setType");
            expect(commit.thirdCall.args[1]).to.equals("scaleSwitcher");
        });
    });

    describe("addAttributesToModuleState", () => {
        it("should commit simple attributes to state directly and update nested array attributes by setDeepMerge", () => {
            const dataObject = [{
                    "title": "dataObject",
                    "type": "TestModule",
                    "nestedArray": [{
                        "nestedValue": true
                    }]
                }],
                rootState = {
                    "Modules": "modul"
                };

            addAttributesToModuleState({commit, dispatch, rootState}, {items: dataObject});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("setDeepMerge");
            expect(dispatch.firstCall.args[1]).to.deep.equals({obj: "modul", path: "TestModule.nestedArray", value: [{nestedValue: true}]});
            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("TestModule/setTitle");
            expect(commit.firstCall.args[1]).to.equals("dataObject");
        });

        it("should commit nothing to state if type is 'customMenuElement'", () => {
            const dataObject = [{
                    type: "customMenuElement",
                    name: "customMenuElementName"

                }],
                rootState = {
                    "Modules": "modul"
                };

            addAttributesToModuleState({commit, dispatch, rootState}, {items: dataObject});

            expect(dispatch.notCalled).to.be.true;
            expect(commit.notCalled).to.be.true;
        });

        it("nested object", () => {
            const dataObject = [{
                    "type": "featureLister",
                    "maxFeatures": 10,
                    "highlightVectorRulesPolygon": {
                        "fill": {
                            "color": [
                                255,
                                0,
                                127,
                                0.9
                            ]
                        },
                        "stroke": {
                            "width": 3,
                            "color": [
                                0,
                                204,
                                204,
                                0.9
                            ]
                        }
                    }
                }],
                myRootState = {
                    Modules: {
                        FeatureLister: {
                            "type": "featureLister"
                        }
                    }
                },
                myCommit = sinon.spy(),
                myDispatch = sinon.stub().callsFake((dispatchFunction, {items, itemType, modulePath}) => {
                    if (dispatchFunction === "addAttributesToModuleState") {
                    // call addAttributesToModuleState recursiv as in original action
                        addAttributesToModuleState({commit: myCommit, dispatch: myDispatch, rootState: myRootState}, {items, itemType, modulePath});
                    }
                });

            addAttributesToModuleState({commit: myCommit, dispatch: myDispatch, rootState: myRootState}, {items: dataObject});

            expect(myDispatch.callCount).to.be.equals(6);
            expect(myDispatch.firstCall.args[0]).to.equals("addAttributesToModuleState");
            expect(myDispatch.firstCall.args[1]).to.deep.equals({items: [dataObject[0].highlightVectorRulesPolygon], itemType: "featureLister", modulePath: "FeatureLister.highlightVectorRulesPolygon"});
            expect(myDispatch.secondCall.args[0]).to.equals("addAttributesToModuleState");
            expect(myDispatch.secondCall.args[1]).to.deep.equals({items: [dataObject[0].highlightVectorRulesPolygon.fill], itemType: undefined, modulePath: "FeatureLister.highlightVectorRulesPolygon.fill"});
            expect(myDispatch.thirdCall.args[0]).to.equals("setDeepMerge");
            expect(myDispatch.thirdCall.args[1]).to.deep.equals({obj: myRootState.Modules, path: "FeatureLister.highlightVectorRulesPolygon.fill.color", value: dataObject[0].highlightVectorRulesPolygon.fill.color});
            expect(myDispatch.getCall(4).args[0]).to.equals("setDeepMerge");
            expect(myDispatch.getCall(4).args[1]).to.deep.equals({obj: myRootState.Modules, path: "FeatureLister.highlightVectorRulesPolygon.stroke.width", value: dataObject[0].highlightVectorRulesPolygon.stroke.width});
            expect(myDispatch.getCall(5).args[0]).to.equals("setDeepMerge");
            expect(myDispatch.getCall(5).args[1]).to.deep.equals({obj: myRootState.Modules, path: "FeatureLister.highlightVectorRulesPolygon.stroke.color", value: dataObject[0].highlightVectorRulesPolygon.stroke.color});
            expect(myCommit.calledTwice).to.be.true;
            expect(myCommit.firstCall.args[0]).to.equals("FeatureLister/setType");
            expect(myCommit.firstCall.args[1]).to.equals(dataObject[0].type);
            expect(myCommit.secondCall.args[0]).to.equals("FeatureLister/setMaxFeatures");
            expect(myCommit.secondCall.args[1]).to.equals(dataObject[0].maxFeatures);
        });
    });

    describe("setDeepMerge", () => {
        it("should return object according path value parameter", () => {
            const dataObject = {
                    "title": "dataObject",
                    "nested1": {
                        "nested2": {
                            "nested2Value": true
                        }
                    }
                },

                testValue = setDeepMerge({dispatch}, {obj: dataObject, path: "dataObject.nested1.nested2.nested2Value", value: false});

            expect(testValue).to.deep.equals({"nested2Value": false});
        });
    });
});

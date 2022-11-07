import sinon from "sinon";
import {expect} from "chai";
import actions from "../../../store/actionsMenuNavigation";

describe("src_3_0_0/core/menu/navigation/store/actionsMenuNavigation.js", () => {
    let commit, dispatch, rootGetters, objectFromPathSpy;
    const genericItemType = "genericItemType",
        folderItemType = "folder";

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        objectFromPathSpy = sinon.stub();
        rootGetters = {"Menu/objectFromPath": objectFromPathSpy};
    });

    afterEach(sinon.restore);

    describe("navigateBack", () => {
        it("should dispatch the deactivation of the element if it is not a folder and commit the removal of the last navigation element", () => {
            objectFromPathSpy.returns({type: genericItemType});
            const side = "mainMenu";

            actions.navigateBack({commit, dispatch, rootGetters}, side);

            expect(objectFromPathSpy.calledOnce).to.be.true;
            expect(objectFromPathSpy.firstCall.args.length).to.equal(2);
            expect(objectFromPathSpy.firstCall.args[0]).to.equal(side);
            expect(objectFromPathSpy.firstCall.args[1]).to.equal("last");

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args.length).to.equal(3);
            expect(dispatch.firstCall.args[0]).to.equal("Menu/setElementActive");
            expect(dispatch.firstCall.args[1]).to.eql({
                moduleNamespace: genericItemType.charAt(0).toUpperCase() + genericItemType.slice(1),
                isActive: false
            });
            expect(dispatch.firstCall.args[2]).to.eql({root: true});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(2);
            expect(commit.firstCall.args[0]).to.equal("removeLastEntry");
            expect(commit.firstCall.args[1]).to.equal(side);
        });
        it("should only commit the removal of the last navigation element if it is a folder", () => {
            objectFromPathSpy.returns({type: folderItemType});
            const side = "secondaryMenu";

            actions.navigateBack({commit, dispatch, rootGetters}, side);

            expect(objectFromPathSpy.calledOnce).to.be.true;
            expect(objectFromPathSpy.firstCall.args.length).to.equal(2);
            expect(objectFromPathSpy.firstCall.args[0]).to.equal(side);
            expect(objectFromPathSpy.firstCall.args[1]).to.equal("last");

            expect(dispatch.notCalled).to.be.true;

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(2);
            expect(commit.firstCall.args[0]).to.equal("removeLastEntry");
            expect(commit.firstCall.args[1]).to.equal(side);
        });
    });
});

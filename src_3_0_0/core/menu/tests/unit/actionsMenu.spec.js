import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actionsMenu";

describe("src_3_0_0/core/menu/actionsMenu.js", () => {
    let commit, dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    afterEach(sinon.restore);

    describe("setElementActive", () => {
        const isActive = true,
            moduleNamespace = "ModuleName",
            functionName = `Menu/${moduleNamespace}/setActive`;
        let context;

        beforeEach(() => {
            context = {
                _actions: {}
            };
        });
        it("should dispatch the setActive action if it is present for the given moduleNamespace", () => {
            context._actions[functionName] = Symbol("I'm a setActive action!");
            const setElementActive = actions.setElementActive.bind(context);

            setElementActive({commit, dispatch}, {moduleNamespace, isActive});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args.length).to.equal(3);
            expect(dispatch.firstCall.args[0]).to.equal(functionName);
            expect(dispatch.firstCall.args[1]).to.equal(isActive);
            expect(dispatch.firstCall.args[2]).to.eql({root: true});
            expect(commit.notCalled).to.be.true;
        });
        it("should commit the setActive mutation if no setActive action is present for the given moduleNamespace", () => {
            const setElementActive = actions.setElementActive.bind(context);

            setElementActive({commit, dispatch}, {moduleNamespace, isActive});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal(functionName);
            expect(commit.firstCall.args[1]).to.equal(isActive);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            expect(dispatch.notCalled).to.be.true;
        });
    });
});

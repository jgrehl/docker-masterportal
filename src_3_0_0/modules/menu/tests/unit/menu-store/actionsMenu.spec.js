import sinon from "sinon";
import Vue from "vue";
import {expect} from "chai";
import actions from "../../../menu-store/actionsMenu";

describe("src_3_0_0/modules/menu/menu-store/actionsMenu.js", () => {
    let consoleError, commit, dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        consoleError = sinon.spy();
        sinon.stub(console, "error").callsFake(consoleError);
    });

    afterEach(sinon.restore);

    describe("clickedMenuElement", () => {
        const path = ["generic"];
        let element, focus, getElementById, getters, section;

        beforeEach(() => {
            focus = sinon.spy();
            getElementById = sinon.fake.returns({focus});
            sinon.stub(document, "getElementById").callsFake(getElementById);
            element = {};
            section = sinon.fake.returns(element);
            getters = {section};
        });

        it("log an error if the menu element with the given path does not have an itemType", () => {
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.notCalled).to.be.true;
            expect(dispatch.notCalled).to.be.true;
            expect(consoleError.calledOnce).to.be.true;
            expect(consoleError.firstCall.args.length).to.equal(1);
            expect(consoleError.firstCall.args[0]).to.equal("Menu: A menu entry is missing the required value \"itemType\".");
        });
        it("should commit the path for the element and dispatch an action to activate the element if it's not a folder", () => {
            element.itemType = "genericElement";
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal("Menu/Navigation/addEntry");
            expect(commit.firstCall.args[1]).to.equal(path);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args.length).to.equal(2);
            expect(dispatch.firstCall.args[0]).to.equal("setElementActive");
            expect(dispatch.firstCall.args[1]).to.eql({moduleNamespace: "GenericElement", isActive: true});
            expect(consoleError.notCalled).to.be.true;
        });
        it("should commit the path for the element and focus the first sub-element if it's a folder", async () => {
            element.itemType = "folder";
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal("Menu/Navigation/addEntry");
            expect(commit.firstCall.args[1]).to.equal(path);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            expect(dispatch.notCalled).to.be.true;
            expect(consoleError.notCalled).to.be.true;
            await Vue.nextTick();
            expect(getElementById.calledOnce).to.be.true;
            expect(getElementById.firstCall.args.length).to.equal(1);
            expect(getElementById.firstCall.args[0]).to.equal(`menu-offcanvas-body-items-element-0-${path[0]}`);
            expect(focus.calledOnce).to.be.true;
            expect(focus.firstCall.args.length).to.equal(0);
        });
    });

    describe("setElementActive", () => {
        const isActive = true,
            moduleNamespace = "ModuleName",
            functionName = `Modules/${moduleNamespace}/setActive`;
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

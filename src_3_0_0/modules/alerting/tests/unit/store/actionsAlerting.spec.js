import actions from "../../../store/actionsAlerting";
import sinon from "sinon";
import {expect} from "chai";

describe("src_3_0_0/modules/alerting/store/actionsAlerting.js", () => {
    let commit;


    beforeEach(() => {
        commit = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it("cleanup", async function () {
        const state = {
            alerts: [
                {
                    hash: "123",
                    initial: true,
                    mustBeConfirmed: false
                }
            ]
        };

        actions.cleanup({state, commit});
        expect(commit.calledThrice).to.be.true;
        expect(commit.getCall(0).args).to.eql(["addToDisplayedAlerts", {hash: "123", initial: true, mustBeConfirmed: false}]);
        expect(commit.getCall(1).args).to.eql(["removeFromAlerts", {hash: "123", initial: true, mustBeConfirmed: false}]);
        expect(commit.getCall(2).args).to.eql(["setReadyToShow", false]);
    });
    it("setAlertAsRead", async function () {
        const state = {
            alerts: [
                {
                    hash: "found",
                    mustBeConfirmed: true
                }
            ]
        };

        actions.alertHasBeenRead({state, commit}, "found");
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args).to.eql(["setAlertAsRead", {hash: "found", mustBeConfirmed: true}]);
    });
    it("setAlertAsUnread", async function () {
        const state = {
            alerts: [
                {
                    hash: "found",
                    mustBeConfirmed: false
                }
            ]
        };

        actions.alertHasBeenRead({state, commit}, "found");
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args).to.eql(["setAlertAsUnread", {hash: "found", mustBeConfirmed: false}]);
    });
    it("addSingleAlert adds a valid alert", async function () {
        const state = {
                alerts: [],
                displayedAlerts: [],
                availableCategories: ["news", "success", "warning", "error", "info"]
            },
            checkValue = actions.addSingleAlert({state, commit}, {hash: "123", content: "123", displayFrom: false});

        expect(checkValue).to.be.true;
        expect(commit.calledTwice).to.be.true;
        expect(commit.firstCall.args[0]).to.eql("Modules/News/addNews");
        expect(commit.firstCall.args[1].content).to.eql("123");
    });
    it("addSingleAlert doesnt show alert with not valid time restriction", async function () {
        const state = {
                alerts: [],
                displayedAlerts: [],
                availableCategories: ["news", "success", "warning", "error", "info"]
            },
            checkValue = actions.addSingleAlert({state, commit}, {hash: "123", content: "123", "displayFrom": "2022-08-24 05:00", "displayUntil": "2022-09-28 23:59"});

        expect(checkValue).to.be.false;
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.eql("Modules/News/addNews");
        expect(commit.firstCall.args[1].content).to.eql("123");
    });
    it("addSingleAlert shows alert with valid time restriction", async function () {
        const state = {
                alerts: [],
                displayedAlerts: [],
                availableCategories: ["news", "success", "warning", "error", "info"]
            },
            checkValue = actions.addSingleAlert({state, commit}, {hash: "123", content: "123", "displayFrom": "2022-08-24 05:00", "displayUntil": "2088-09-28 23:59"});

        expect(checkValue).to.be.true;
        expect(commit.calledTwice).to.be.true;
        expect(commit.firstCall.args[0]).to.eql("Modules/News/addNews");
        expect(commit.firstCall.args[1].content).to.eql("123");

    });
    it("addSingleAlert doesnt show alert with already existing hash", async function () {
        sinon.stub(console, "warn");
        const state = {
            alerts: [{hash: "2db391b6db7866773874b3a5e60123040adb656a"}],
            displayedAlerts: [],
            availableCategories: ["news", "success", "warning", "error", "info"]
        };

        actions.addSingleAlert({state, commit}, {hash: "2db391b6db7866773874b3a5e60123040adb656a", content: "123", "displayFrom": "2022-08-24 05:00", "displayUntil": "2088-09-28 23:59"});

        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.firstCall.args).to.eql(["Alert ignored (duplicate): 2db391b6db7866773874b3a5e60123040adb656a"]);
        expect(commit.calledTwice).to.be.true;
        expect(commit.firstCall.args[0]).to.eql("Modules/News/addNews");
        expect(commit.firstCall.args[1].content).to.eql("123");
        expect(commit.secondCall.args[0]).to.eql("setReadyToShow");
        expect(commit.secondCall.args[1]).to.be.true;
    });
});

import sinon from "sinon";
import actionsRouting from "../../../store/actionsRouting";
import {expect} from "chai";

describe("src_3_0_0/modules/routing/store/actionsRouting.js", () => {
    let state,dispatch;

    beforeEach(() => {
        dispatch = sinon.spy();
        state = {
            type: "routing",
            geosearch: {
                type: null,
                serviceId: null
            },
            geosearchReverse: {
                type: null,
                serviceId: null
            },
            directionsSettings: {
                type: null,
                serviceId: null
            },
            isochronesSettings: {
                type: null,
                serviceId: null
            }
        };
    });

    afterEach(sinon.restore);

    it("should throw error because of missing required config parameter", () => {
        try {
            actionsRouting.checkNonOptionalConfigFields({state});
        }
        catch (e) {
            expect(e.message).equal("Routing tool is not configured correctly. The following required fields are missing: geosearch.type, geosearch.serviceId, geosearchReverse.type, geosearchReverse.serviceId, directionsSettings.type, directionsSettings.serviceId, isochronesSettings.type, isochronesSettings.serviceId");
        }
    });

    it("should not throw error because of missing required config parameter", () => {
        state.geosearch.type = "type";
        state.geosearch.serviceId = "serviceId";
        state.geosearchReverse.type = "type";
        state.geosearchReverse.serviceId = "serviceId";
        state.directionsSettings.type = "type";
        state.directionsSettings.serviceId = "serviceId";
        state.isochronesSettings.type = "type";
        state.isochronesSettings.serviceId = "serviceId";
        actionsRouting.checkNonOptionalConfigFields({state});
    });

    it("setFirstWayPoint shall call reset and addWaypoint", () => {
        const displayName = "displayName",
        coordinates = [1,2];

        actionsRouting.setFirstWayPoint({dispatch}, {displayName, coordinates});
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.firstCall.args).to.eql(["Directions/reset"]);
        expect(dispatch.secondCall.args).to.eql(["Directions/addWaypoint", {index: 0, displayName, coordinates, fromExtern: true}]);
    });
});

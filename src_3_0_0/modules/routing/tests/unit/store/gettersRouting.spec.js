import {expect} from "chai";
import gettersRouting from "../../../store/gettersRouting";

describe("src_3_0_0/modules/routing/store/gettersRouting.js", () => {

    describe("filteredRoutingToolOptions", () => {
        it("should return all routingToolOptions", () => {
            expect(gettersRouting.filteredRoutingToolOptions({routingToolOptions: []}).length).equal(2);
        });

        it("should return only one valid routingToolOptions", () => {
            expect(gettersRouting.filteredRoutingToolOptions({routingToolOptions: ["DIRECTIONS", "TEST"]}).length).equal(1);
        });
    });

});

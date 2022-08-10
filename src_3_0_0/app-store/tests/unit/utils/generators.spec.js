import {expect} from "chai";
import {generateSimpleGetters} from "../../../utils/generators";

describe("src_3_0_0/app-store/utils/generators.js", () => {
    describe("generateSimpleGetters", () => {
        it("should generate two simple getters as functions", () => {
            const state = {
                    abc: 123,
                    coordinates: [0, 10]
                },
                simpleGetters = generateSimpleGetters(state);

            expect(typeof simpleGetters.abc).equals("function");
            expect(typeof simpleGetters.coordinates).equals("function");
        });
    });
});

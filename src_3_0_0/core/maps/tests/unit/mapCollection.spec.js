import {expect} from "chai";
import mapCollect from "../../mapCollection";

describe("src_3_0_0/core/maps/maps.js", () => {
    before(() => {
        mapCollection.clear();
    });

    describe("addMap nad getMap", () => {
        it("add a 2D map to mapCollection", () => {
            const map = {
                map: "map",
                mode: "2D"
            };

            mapCollect.addMap(map, "2D");

            expect(mapCollect.getMap("2D")).to.deep.equals(map);
        });
    });

    describe("clear and getMap", () => {
        it("clear the mapCollection", () => {
            const map = {
                map: "map",
                mode: "2D"
            };

            mapCollect.clear(map, "2D");

            expect(mapCollect.getMap("2D")).to.be.undefined;
        });
    });
});

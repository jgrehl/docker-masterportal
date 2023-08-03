import {expect} from "chai";

import {initializeMaps} from "../../maps";

describe("src_3_0_0/core/maps/maps.js", () => {
    before(() => {
        mapCollection.clear();
    });

    describe("initializeMaps", () => {
        it("2D map should exists after createMaps", () => {
            const portalConfig = {
                    portal: "config"
                },
                configJs = {
                    config: "js"
                };

            initializeMaps(portalConfig, configJs);

            expect(mapCollection.getMap("2D")).to.be.not.undefined;
        });
    });
});

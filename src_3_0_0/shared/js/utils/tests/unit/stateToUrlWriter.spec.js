import {expect} from "chai";
import {getStateAsUrlParams} from "../../stateToUrlWriter";


describe("src_3_0_0/shared/js/utils/stateToUrlWriter.js", () => {
    it("test getStateAsUrlParams", () => {
        const rootGetters = {
                visibleLayerConfigs: [
                    {
                        id: "1",
                        visibility: "true",
                        transparency: "0"
                    },
                    {
                        id: "2",
                        visibility: "true",
                        transparency: "50"
                    }
                ],
                "Maps/center": [123, 456],
                "Maps/zoom": "7"
            },
            expected = "?Map/layerIds=1,2&visibility=true,true&transparency=0,50&Map/center=[123,456]&Map/zoomLevel=7",
            actual = getStateAsUrlParams(null, rootGetters);

        expect(actual.substring(actual.indexOf("?"))).to.be.equals(expected);

    });
});

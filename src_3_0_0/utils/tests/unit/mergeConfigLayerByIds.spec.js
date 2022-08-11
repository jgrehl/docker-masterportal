import mergeConfigLayerByIds from "../../mergeConfigLayerByIds.js";
import {expect} from "chai";

describe("src/utils/mergeConfigLayerByIds.js", () => {
    // let layerConfig;

    beforeEach(() => {
        // layerConfig = {
        //     Themenconfig: {
        //         Hintergrundkarten: {
        //             Layer: [
        //                 {
        //                     id: [
        //                         "717",
        //                         "718",
        //                         "719",
        //                         "720",
        //                         "13712",
        //                         "13709",
        //                         "13714",
        //                         "13716"
        //                     ],
        //                     visibility: true,
        //                     name: "Geobasiskarten (farbig)"
        //                 },
        //                 {
        //                     id: "453"
        //                 }
        //             ]
        //         }
        //     }
        // };
    });


    it("should return empty object if no param is given", () => {
        const merged = mergeConfigLayerByIds();

        expect(merged).to.be.null;
    });
    it("should ", () => {
        // todo getOrMergeRawLayer call cannot be tested due to problems mocking imported functions
        // const merged = mergeConfigLayerByIds(layerConfig.Themenconfig.Hintergrundkarten.Layer[0].id);

        // expect(merged).not.to.be.null;
    });


});


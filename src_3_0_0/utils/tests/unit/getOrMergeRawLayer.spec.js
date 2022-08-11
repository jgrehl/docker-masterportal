import getOrMergeRawLayer from "../../getOrMergeRawLayer.js";
import {expect} from "chai";

describe("src/utils/getOrMergeRawLayer.js", () => {
    // let layerConfig;
    // const backGroundLayer = {
    //     id: "452"
    // };

    beforeEach(() => {
        // layerConfig = {
        //     Hintergrundkarten: {
        //         Layer: [
        //             {
        //                 id: "453",
        //                 visibility: true
        //             },
        //             backGroundLayer
        //         ]
        //     },
        //     Fachdaten: {
        //         Layer: [
        //             {
        //                 id: "1132",
        //                 name: "100 Jahre Stadtgruen POIs",
        //                 visibility: true
        //             },
        //             {
        //                 id: "10220"
        //             }
        //         ]
        //     }
        // };
    });


    it("should return null if no param is given", () => {
        expect(getOrMergeRawLayer()).to.be.null;
    });
    it("should return null if no param is given", () => {
        // todo getOrMergeRawLayer call cannot be tested due to problems mocking imported functions
        // expect(getOrMergeRawLayer(layerConfig.Hintergrundkarten.Layer[0])).not.to.be.null;
    });


});


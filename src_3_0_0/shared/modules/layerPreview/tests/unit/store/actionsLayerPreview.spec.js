import {expect} from "chai";
import sinon from "sinon";

import actions from "../../../store/actionsLayerPreview";

const {initialize} = actions;

describe("src_3_0_0/modules/layerPreview/store/actionsLayerPreview", () => {
    let commit,
        getters,
        rootGetters;

    beforeEach(() => {
        commit = sinon.spy();
        getters = {
            previewCenter: null,
            previewZoomLevel: null
        };
        rootGetters = {
            "Maps/initialCenter": null,
            "Maps/initialZoom": null
        };

    });

    afterEach(sinon.restore);

    describe("initialize", () => {
        it("initializes with center given as array and getters and rootGetters return null", () => {
            const center = [1, 1],
                zoomLevel = 5;

            initialize({commit, getters, rootGetters}, {center, zoomLevel});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreviewCenter");
            expect(commit.firstCall.args[1]).to.be.deep.equals({center});
            expect(commit.secondCall.args[0]).to.be.equals("setPreviewZoomLevel");
            expect(commit.secondCall.args[1]).to.be.deep.equals({zoomLevel});
        });

        it("initializes with center given as string and getters and rootGetters return null", () => {
            const center = "1,1",
                zoomLevel = 5;

            initialize({commit, getters, rootGetters}, {center, zoomLevel});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreviewCenter");
            expect(commit.firstCall.args[1]).to.be.deep.equals({center: [1, 1]});
            expect(commit.secondCall.args[0]).to.be.equals("setPreviewZoomLevel");
            expect(commit.secondCall.args[1]).to.be.deep.equals({zoomLevel});
        });

        it("initializes with center and zoomLevel is null", () => {
            const center = null,
                zoomLevel = null;

            rootGetters = {
                "Maps/initialCenter": [2, 2],
                "Maps/initialZoom": 9
            };

            initialize({commit, getters, rootGetters}, {center, zoomLevel});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreviewCenter");
            expect(commit.firstCall.args[1]).to.be.deep.equals({center: [2, 2]});
            expect(commit.secondCall.args[0]).to.be.equals("setPreviewZoomLevel");
            expect(commit.secondCall.args[1]).to.be.deep.equals({zoomLevel: 9});
        });
    });
});

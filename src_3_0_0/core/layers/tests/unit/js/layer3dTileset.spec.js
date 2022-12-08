import {expect} from "chai";
import sinon from "sinon";
import Layer3dTileset from "../../../js/layer3dTileset";

describe("src_3_0_0/core/js/layers/layer3dTileset.js", () => {
    let attributes,
        cesium3DTilesetSpy,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            name: "tilesetLayer",
            url: "the_url",
            typ: "TileSet3D",
            cesium3DTilesetOptions: {
                maximumScreenSpaceError: 6
            }
        };

        mapCollection.clear();

        global.Cesium = {};
        global.Cesium.Cesium3DTileset = () => { /* no content*/ };
        global.Cesium.Cesium3DTileStyle = () => { /* no content*/ };

        cesium3DTilesetSpy = sinon.spy(global.Cesium, "Cesium3DTileset");
        sinon.spy(global.Cesium, "Cesium3DTileStyle");
    });

    afterEach(() => {
        sinon.restore();
        global.Cesium = null;
    });

    describe("createLayer", () => {
        let checkLayer;

        before(() => {
            /**
             * Checks the layer for attributes content.
             * @param {Object} layer the layer
             * @param {Object} terrainLayer the terrainLayer
             * @param {Object} attrs the attributes
             * @returns {void}
             */
            checkLayer = (layer, terrainLayer, attrs) => {
                expect(layer).not.to.be.undefined;
                expect(terrainLayer.get("name")).to.be.equals(attrs.name);
                expect(terrainLayer.get("id")).to.be.equals(attrs.id);
                expect(terrainLayer.get("typ")).to.be.equals(attrs.typ);
                expect(layer.tileset.layerReferenceId).to.be.equals(attrs.id);
            };
        });

        it("new Layer3dTileset should create an layer with warning", () => {
            const layer3dTileset = new Layer3dTileset(attributes);

            expect(layer3dTileset).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create a tileset layer", function () {
            const layer3dTileset = new Layer3dTileset(attributes),
                layer = layer3dTileset.getLayer();

            checkLayer(layer, layer3dTileset, attributes);
            expect(cesium3DTilesetSpy.calledOnce).to.equal(true);
        });

        it("createLayer shall create a visible tileset layer", function () {
            Object.assign(attributes, {visibility: true});

            const layer3dTileset = new Layer3dTileset(attributes),
                layer = layer3dTileset.getLayer();

            checkLayer(layer, layer3dTileset, attributes);
            expect(layer3dTileset.get("visibility")).to.equal(true);
            expect(cesium3DTilesetSpy.calledOnce).to.equal(true);
            expect(cesium3DTilesetSpy.calledWithMatch({maximumScreenSpaceError: 6})).to.equal(true);
        });
    });
});

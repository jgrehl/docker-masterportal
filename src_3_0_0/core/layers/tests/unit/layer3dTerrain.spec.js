import {expect} from "chai";
import sinon from "sinon";
import Layer3dTerrain from "../../layer3dTerrain";

describe("src_3_0_0/core/layers/layer3dTerrain.js", () => {
    let attributes,
        cesiumEllipsoidTerrainProviderSpy,
        cesiumTerrainProviderSpy,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        attributes = {
            name: "terrainTestLayer",
            id: "id",
            typ: "Terrain3D",
            cesiumTerrainProviderOptions: {
                requestVertexNormals: true
            }
        };

        global.Cesium = {};
        global.Cesium.CesiumTerrainProvider = () => { /* no content*/ };
        global.Cesium.EllipsoidTerrainProvider = () => { /* no content*/ };

        cesiumEllipsoidTerrainProviderSpy = sinon.spy(global.Cesium, "EllipsoidTerrainProvider");
        cesiumTerrainProviderSpy = sinon.spy(global.Cesium, "CesiumTerrainProvider");
    });

    after(() => {
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
            };
        });

        it("new Layer3d should create an layer with warning", () => {
            const layer3dTerrain = new Layer3dTerrain({});

            expect(layer3dTerrain).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create a terrain layer", () => {
            const layer3dTerrain = new Layer3dTerrain(attributes),
                layer = layer3dTerrain.getLayer();

            checkLayer(layer, layer3dTerrain, attributes);
            expect(cesiumTerrainProviderSpy.notCalled).to.equal(true);
            expect(cesiumEllipsoidTerrainProviderSpy.notCalled).to.equal(true);
        });
    });
});

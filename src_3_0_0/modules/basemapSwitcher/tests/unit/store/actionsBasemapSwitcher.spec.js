import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsBasemapSwitcher";


describe("basemapSwitcher/store/actionsBasemapSwitcher", () => {

    let layerConfigs,
        dispatch,
        rootGetters;

    beforeEach(() => {

        layerConfigs = [
            {id: "453", visibility: true, backgroundLayer: true, showInLayerTree: true, zIndex: 1}
        ];

        dispatch = sinon.spy();
        rootGetters = {
            layerConfigsByAttributes: () => layerConfigs,
            determineZIndex: () => layerConfigs[0].zIndex,
            isBackgroundLayer: () => layerConfigs[0].backgroundLayer
        };
    });


    it("updateLayerVisibilityAndZIndex", () => {
        const layerId = "453";

        actions.updateLayerVisibilityAndZIndex({dispatch, rootGetters}, layerId);

        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0]).to.equal("updateLayerConfigZIndex");
        expect(dispatch.secondCall.args[0]).to.equal("replaceByIdInLayerConfig");
        expect(dispatch.firstCall.args[1].layerContainer[0].zIndex).to.equal(1);
        expect(dispatch.secondCall.args[1].layerConfigs).to.deep.equal([{id: "453", layer: {id: "453", visibility: true, showInLayerTree: true, zIndex: 2}}]);

    });
});

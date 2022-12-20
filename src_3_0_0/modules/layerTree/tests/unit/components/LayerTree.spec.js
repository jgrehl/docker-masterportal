import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import LayerTreeComponent from "../../../components/LayerTree.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/layerTree/components/LayerTree.vue", () => {
    let wrapper;

    afterEach(() => {
        sinon.restore();
    });

    it("renders the LayerTree with LayerTreeNode", () => {
        wrapper = shallowMount(LayerTreeComponent);

        expect(wrapper.find("#layer-tree").exists()).to.be.true;
        expect(wrapper.findAll("layer-tree-node-stub").length).to.be.equals(1);
    });
});

import {config, shallowMount} from "@vue/test-utils";
import SnippetCheckboxFilterInMapExtentComponent from "../../../components/SnippetCheckboxFilterInMapExtent.vue";
import {expect} from "chai";

config.global.mocks.$t = key => key;

describe("src/modules/tools/filter/components/SnippetCheckboxFilterInMapExtent.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetCheckboxFilterInMapExtentComponent, {
            propsData: {
                filterId: 1
            }
        });
    });

    it("should render correctly", () => {
        expect(wrapper.find("input").classes("snippetCheckbox")).to.be.true;
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(false);
    });
});

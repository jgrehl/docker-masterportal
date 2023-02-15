import {shallowMount, config} from "@vue/test-utils";
import SnippetFeatureInfo from "../../../components/SnippetFeatureInfo.vue";
import Feature from "ol/Feature";
import {expect} from "chai";

config.global.mocks.$t = key => key;

describe("src/modules/tools/filter/components/SnippetFeatureInfo.vue", () => {
    it("should have correct default values", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {});

        expect(wrapper.vm.adjustment).to.be.false;
        expect(wrapper.vm.title).to.be.true;
        expect(wrapper.vm.snippetId).to.equal(0);
        expect(wrapper.vm.layerId).to.be.undefined;
        expect(wrapper.vm.visible).to.be.false;
    });
    it("should not render with default values", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {});

        expect(wrapper.isVisible()).to.be.false;
    });
    it("should render if visible is true", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {});

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.isVisible()).to.be.true;
    });

    it("should render with a title if the title is a string", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                title: "foobar"
            }
        });

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find("h6").text()).to.be.equal("foobar");
    });
    it("should render without a title if title is a boolean and false", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true,
                title: false
            }
        });

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find("h6").exists()).to.be.false;
    });

    it("should rename object keys", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {});
        let obj = {
            "foo_123": "bar",
            "foo_ 1_23": "bar"
        };

        obj = wrapper.vm.beautifyObjectKeys(obj);

        expect(obj).to.deep.equal({
            "Foo 123": "bar",
            "Foo  1 23": "bar"
        });
    });

    it("should render feature info if it available", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {});

        wrapper.setData({featureInfo: {"foo": "bar"}});
        await wrapper.vm.$nextTick();

        expect(wrapper.find("dt").text()).to.be.equal("foo:");
        expect(wrapper.find("dd").text()).to.be.equal("bar");
    });

    describe("getUniqueObjectFromAttributes", () => {
        it("should return null if first param is not an array", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {});

            expect(wrapper.vm.getUniqueObjectFromAttributes(null)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(undefined)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(1234)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes("string")).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(true)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(false)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes({})).to.be.null;
        });
        it("should return null if second param is not an array", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {});

            expect(wrapper.vm.getUniqueObjectFromAttributes([], null)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], undefined)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], 1234)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], "string")).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], true)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], false)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], {})).to.be.null;
        });
        it("should return null if second param is an array but has no length", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {});

            expect(wrapper.vm.getUniqueObjectFromAttributes([], [])).to.be.null;
        });
        it("should return an object with unique keys and a list of values for each attrName (first param)", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {}),
                items = [
                    new Feature({foo: "bar"}),
                    new Feature({foo: "bar"}),
                    new Feature({foo: "baz"})
                ],
                expected = {
                    foo: ["bar", "baz"]
                };

            expect(wrapper.vm.getUniqueObjectFromAttributes(["foo"], items)).to.deep.equal(expected);
        });
    });
});

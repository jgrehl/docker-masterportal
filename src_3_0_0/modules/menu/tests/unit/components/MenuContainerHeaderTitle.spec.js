import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import MenuContainerHeaderTitle from "../../../components/MenuContainerHeaderTitle.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerHeaderTitle.vue", () => {
    const idAppendix = "mainMenu",
        id = `#menu-offcanvas-header-title-${idAppendix}`,
        titleText = "My Portal";
    let isMobile,
        store;

    beforeEach(() => {
        isMobile = false;
        store = new Vuex.Store({
            namespaces: true,
            getters: {
                isMobile: () => isMobile
            }
        });
    });

    it("should render the component and display an anchor tag with '#' as href and include the text if the view is not mobile and only text is given as a prop", () => {
        const wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: titleText}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("data-bs-toggle")).to.equal(titleText);
        expect(anchor.attributes("data-bs-placement")).to.equal("bottom");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(titleText);
        expect(anchor.find("img").exists()).to.be.false;
    });
    it("should render the component and display an anchor tag with the given link as href and include the text if the view is not mobile and text as well as link are given as props", () => {
        const link = "https://some.url.com",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: titleText, link}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal(link);
        expect(anchor.attributes("target")).to.equal("_blank");
        expect(anchor.attributes("data-bs-toggle")).to.equal(titleText);
        expect(anchor.attributes("data-bs-placement")).to.equal("bottom");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(titleText);
        expect(anchor.find("img").exists()).to.be.false;
    });
    it("should render the component and display an anchor tag with '#' as href, include the text and display an image if the view is not mobile and text as well as logo are given as props", () => {
        const logo = "some png",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: titleText, logo}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("data-bs-toggle")).to.equal(titleText);
        expect(anchor.attributes("data-bs-placement")).to.equal("bottom");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(titleText);
        expect(anchor.findAll("img").length).to.equal(1);
        expect(anchor.find("img").attributes("src")).to.equal(logo);
        expect(anchor.find("img").attributes("alt")).to.equal(titleText);
    });
    it("should render the component and display an anchor tag with '#' as href, include the text and use the toolTip as title prop of the anchor if the view is not mobile and text as well as toolTip are given as props", () => {
        const toolTip = "Opens something",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: titleText, toolTip}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;

        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("data-bs-toggle")).to.equal(titleText);
        expect(anchor.attributes("data-bs-placement")).to.equal("bottom");
        expect(anchor.attributes("title")).to.equal(toolTip);
        expect(anchor.classes()).to.eql(["header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(titleText);
        expect(anchor.find("img").exists()).to.be.false;
    });
    it("should not render the component if the view is mobile, regardless of the given props", () => {
        isMobile = true;

        const wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: titleText}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.false;
    });
});
